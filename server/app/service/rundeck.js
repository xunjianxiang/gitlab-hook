'use strict';

const Service = require('egg').Service;
const moment = require('moment');

const linebreak = '  \n';

class RundeckService extends Service {
  async publish() {
    const setting = await this.service.group.getGroupSetting(this.ctx.extra.project.group_id);
    this.ctx.extra.rundeck = {
      domain: setting && setting.rundeck && setting.rundeck.domain || this.config.rundeck.domain,
      token: setting && setting.rundeck && setting.rundeck.token || this.config.rundeck.token,
    };
    this.ctx.extra.rundeck = Object.assign({}, setting && setting.rundeck, this.config.rundeck);
    this.logger.info('rundeck publish setting', this.ctx.extra.rundeck);
    const { param: publish_id } = this.ctx.extra.step;
    this.logger.info('rundeck publish job id', publish_id);
    const execute_id = await this.execution(publish_id);
    this.logger.info('rundeck execute id', execute_id);
    if (!execute_id) return;
    const execute_info = await this.query(execute_id);
    this.logger.info('rundeck execute status', execute_info.status);
    if (execute_info.status !== 'succeeded') return;
    const verify_status = await this.verify(execute_id);
    this.logger.info('rundeck execute verify', verify_status);
    if (!verify_status) return;
    this.logger.info('发布成功');
    this.alarm('发布成功', true);
    return true;
  }

  async execution(id) {
    const { rundeck, project, job } = this.ctx.extra;

    const tags = await this.app.invokeGitlabApi(this.ctx.helper.apiParamsInject(this.app.api.gitlab.tag.list, project.remote.id));

    tags.sort((prev, current) => {
      const prev_date = +moment(prev.commit.created_at);
      const current_date = +moment(current.commit.created_at);
      if (prev_date > current_date) return -1;
      if (prev_date < current_date) return 1;
      return 0;
    });

    const version = tags[0].name;

    const api = `${rundeck.domain}/api/12/job/${id}/executions`;
    const args = `-git_repo_name ${project.remote.name} -git_branch_name ${job.branch.replace('refs/heads/', '')} -version ${version}`;

    return new Promise((resolve, reject) => {
      this.app.curl(api, {
        method: 'POST',
        dataType: 'text',
        data: {
          argString: args,
        },
        headers: {
          'X-Rundeck-Auth-Token': rundeck.token,
        },
      })
        .then(async response => {
          const result = await this.ctx.helper.xml2js(response.data);
          if (result.result) {
            console.log(result);
            reject(new Error(result.result.error.$.code));
          } else {
            resolve(result.executions.execution.$.id);
          }
        })
        .catch(error => {
          reject(new Error(`Rundeck 服务器连接失败${linebreak}${error.message || error.statusText}`));
        });
    })
      .catch(error => {
        this.alarm(error.message);
      });
  }

  async query(id) {
    const { rundeck } = this.ctx.extra;
    const api = `${rundeck.domain}/api/1/execution/${id}`;
    return new Promise((resolve, reject) => {
      this.app.curl(api, {
        dataType: 'text',
        headers: {
          'X-Rundeck-Auth-Token': rundeck.token,
        },
      })
        .then(async response => {
          const result = await this.ctx.helper.xml2js(response.data);
          const action = {
            running: info => {
              setTimeout(() => {
                this.query(info.id).then(info => {
                  resolve(info);
                }).catch(error => {
                  reject(error);
                });
              }, 5000);
            },
            succeeded: info => {
              resolve(info);
            },
            failed: info => {
              reject(new Error(info));
            },
            aborted: info => {
              reject(new Error(info));
            },
          };
          const info = result.result.executions.execution.$;
          action[info.status](info);
        })
        .catch(error => {
          reject(new Error(`Rundeck 服务器连接失败${linebreak}${error.message || error.statusText}`));
        });
    })
      .catch(error => {
        this.alarm(error.message);
      });
  }

  async verify(id) {
    const { rundeck } = this.ctx.extra;
    const api = `${rundeck.domain}/api/5/execution/${id}/output`;
    return new Promise((resolve, reject) => {
      this.app.curl(api, {
        dataType: 'json',
        headers: {
          'X-Rundeck-Auth-Token': rundeck.token,
        },
      })
        .then(response => {
          const error_logs = response.data.entries.filter(item => item.level === 'ERROR' && item.log).map(item => item.log);
          if (!error_logs.length) {
            resolve(true);
          } else {
            reject(new Error(error_logs.join(linebreak)));
          }
        })
        .catch(error => {
          reject(new Error(`Rundeck 服务器连接失败${linebreak}${error.message || error.statusText}`));
        });
    })
      .catch(error => {
        this.alarm(error.message);
      });
  }

  async alarm(message, status = false) {
    status || this.service.hooklog.addHookLogMessage(message);
    const { project } = this.ctx.extra;
    const id = project && project.setting && project.setting.dingtalk && project.setting.dingtalk.id || this.config.dingtalk.id;
    const level = project && project.setting && project.setting.dingtalk && project.setting.dingtalk.level || this.config.dingtalk.level;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const messages = [];
    messages.push(`发布时间：${datetime}`);
    messages.push(`操作人员：${this.ctx.request.body.user_name}`);
    messages.push(`集成业务：${this.ctx.request.body.project.name}`);
    messages.push(`提交分支：${this.ctx.request.body.ref.replace('refs/heads/', '')}`);
    messages.push(`代码仓库：${this.ctx.request.body.project.http_url}`);
    messages.push('执行业务：持续集成');
    messages.push('执行模块：Rundeck');
    messages.push(`集成信息：${message}`);
    const data = messages.join(linebreak);
    this.ctx.helper.dingtalk({ id, level, data });
  }
}

module.exports = RundeckService;

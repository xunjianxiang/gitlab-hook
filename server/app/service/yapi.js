'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const moment = require('moment');

const linebreak = '  \n';

class YapiService extends Service {
  async autotest() {
    const { project, step } = this.ctx.extra;
    const setting = await this.service.group.getGroupSetting(this.ctx.extra.project.group_id);
    const yapi = {
      domain: setting && setting.yapi && setting.yapi.domain || this.config.yapi.domain,
      id: project && project.setting && project.setting.yapi && project.setting.yapi.id,
    };

    if (!yapi.id) {
      this.alarm(`请检测项目 ${this.ctx.request.body.project.name} 的 YApi 关联项目设置`);
      return;
    }

    const testcases = await this.ctx.model.YapiInterfaceCol.find({ project_id: yapi.id }).catch(error => this.logger.error(error));

    if (!testcases.length) return true;

    const token = await this.ctx.model.YapiToken.findOne({ project_id: yapi.id });

    const responses = await Promise.all(testcases.map(testcase => {
      return this.app
        .curl(`${yapi.domain}/api/open/run_auto_test?id=${testcase.id}&token=${token.token}&mode=json&email=false&env_name=${step.param}`, {
          dataType: 'json',
        })
        .then(response => response.data);
    }));

    const testresults = responses.map((item, index) => {
      const result = {
        id: testcases[index].id,
        message: item.errcode ? item.errmsg : item.message.msg,
      };
      if (!item.errcode) {
        result.response = item;
      }
      return result;
    });

    const info = testresults.map(item => !!(item.response && !item.response.message.failedNum));
    const total = info.length;
    const succeed = info.filter(item => item).length;
    const failed = info.filter(item => !item).length;

    this.alarm(`成功测试集：${succeed}，失败测试集：${failed}，总计：${total}`);
    this.report(testresults);
    this.logger.info('yapi autotest');
    return !failed;
  }

  async alarm(message) {
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
    messages.push('执行模块：YApi 接口测试');
    messages.push(`集成信息：${message}`);
    const data = messages.join(linebreak);
    this.ctx.helper.dingtalk({ id, level, data });
  }

  async report(testresults) {
    const { project, job } = this.ctx.extra;
    const body = this.ctx.request.body;
    const data = {
      testresults,
      name: project.name,
      repo: body.project.name,
      branch: body.ref.replace('refs/heads/', ''),
      commits: body.commits,
    };
    const content = fs.readFileSync(path.join(__dirname, '..', 'view/autotest.pug'), 'utf-8');
    const users = await this.ctx.model.User.find({
      _id: {
        $in: project.users.map(user => user.id),
      },
    }, 'email');
    const to = users.map(receiver => receiver.email);
    const subject = `${project.name} - ${job.name} - API 测试报告`;
    const html = pug.render(content, data);
    if (!to.length) return;
    this.ctx.helper.mail({ to, subject, html });
  }
}

module.exports = YapiService;

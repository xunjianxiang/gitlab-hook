'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class GitlabController extends Controller {
  async getGitlabGroupList() {
    const groups = await this.app.invokeGitlabApi(`${this.app.api.gitlab.group.list}?per_page=100&page=1`);
    let code,
      message,
      data;
    if (groups) {
      code = 0;
      data = groups.map(group => {
        return {
          id: group.id,
          name: group.name,
          desc: group.description,
        };
      });
    } else {
      code = 1;
      message = 'gitlab 分组列表获取失败';
    }
    this.ctx.body = { code, message, data };
  }

  async getGitlabGroupMemberList() {
    this.ctx.validate({
      group_id: { type: 'string' },
    });

    const { group_id } = this.ctx.request.body;

    let code,
      message,
      data;

    const remoteid = await this.service.group.getGroupRemoteId(group_id, 1);

    const result = await this.app.invokeGitlabApi(`${this.ctx.helper.apiParamsInject(this.app.api.gitlab.group.members, remoteid)}?per_page=100&page=1`);
    if (result.message) {
      code = 1;
      message = result.message;
    } else {
      code = 0;
      data = result.map(member => {
        return {
          id: member.id,
          name: member.name,
        };
      });
    }

    this.ctx.body = { code, message, data };
  }

  async getGitlabProjectList() {
    this.ctx.validate({
      group_id: { type: 'string' },
    });

    const { group_id } = this.ctx.request.body;

    let code,
      message,
      data;

    const remoteid = await this.service.group.getGroupRemoteId(group_id, 1);

    const result = await this.app.invokeGitlabApi(`${this.ctx.helper.apiParamsInject(this.app.api.gitlab.project.list, remoteid)}?per_page=100&page=1`);
    if (result.message) {
      code = 1;
      message = result.message;
    } else {
      code = 0;
      data = result.map(project => {
        return {
          id: project.id,
          name: project.name,
          desc: project.desc,
        };
      });
    }

    this.ctx.body = { code, message, data };
  }

  async getGitlabProjectMemberList() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });

    const { project_id } = this.ctx.request.body;

    let code,
      message,
      data;

    const remoteid = await this.service.project.getProjectRemoteId(project_id, 1);

    const result = await this.app.invokeGitlabApi(`${this.ctx.helper.apiParamsInject(this.app.api.gitlab.project.members, remoteid)}?per_page=100&page=1`);
    if (result.message) {
      code = 1;
      message = result.message;
    } else {
      code = 0;
      data = result.map(member => {
        return {
          id: member.id,
          name: member.name,
        };
      });
    }

    this.ctx.body = { code, message, data };
  }

  async getGitlabProjectBranchList() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });

    const { project_id } = this.ctx.request.body;

    let code,
      message,
      data;

    const remoteid = await this.service.project.getProjectRemoteId(project_id, 1);

    const result = await this.app.invokeGitlabApi(`${this.ctx.helper.apiParamsInject(this.app.api.gitlab.branch.list, remoteid)}?per_page=100&page=1`);
    if (result.message) {
      code = 1;
      message = result.message;
    } else {
      code = 0;
      data = result.map(branch => branch.name);
    }

    this.ctx.body = { code, message, data };
  }

  async hook() {
    const GitlabHookEventMap = {
      push: this.push,
    };

    this.ctx.validate({
      event_name: Object.keys(GitlabHookEventMap),
      ref: { type: 'string' },
      project_id: { type: 'number' },
    });
    const { event_name, project_id, ref } = this.ctx.request.body;

    // 检测配置
    const project = await this.service.project.getProject({ 'remote.id': project_id });

    if (!project) {
      this.ctx.status = 400;
      this.ctx.body = '系统未找到当前项目配置';
      return;
    }

    const job = await this.service.job.getJob({ project_id: project.id, branch: ref });

    if (!job) {
      this.ctx.status = 400;
      this.ctx.body = '系统未找到当前分支配置';
      return;
    }

    // 记录
    this.service.hooklog.addHookLog({
      job_id: job.id,
      data: this.ctx.request.body,
    });

    GitlabHookEventMap[event_name].call(this);
    this.ctx.status = 200;
  }

  async push() {
    const { project_id, ref } = this.ctx.request.body;
    const project = await this.service.project.getProject({ 'remote.id': project_id });
    const job = await this.service.job.getJob({ project_id: project.id, branch: ref });
    const steps = await this.service.step.getStepList(job.id);

    steps.sort((prev, current) => {
      return !prev.order && !current.order
        ? (+moment(prev.createdAt) > +moment(current.createdAt) ? 0 : 1)
        : (prev.order > current.order ? 0 : 1);
    });

    for (const step of steps) {
      this.logger.info('step', step.type);
      this.ctx.extra = { project, job, step };
      if (step.type === 'rundeck') {
        const status = await this.service.rundeck.publish();
        if (!status) break;
      }
      if (step.type === 'yapi') {
        const status = await this.service.yapi.autotest();
        if (!status) break;
      }
    }
  }
}

module.exports = GitlabController;

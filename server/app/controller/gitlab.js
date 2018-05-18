'use strict';

const Controller = require('egg').Controller;

class GitlabController extends Controller {
  async getGitlabGroupList() {
    const groups = await this.app.invokeGitlabApi(this.app.api.gitlab.group.list);
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

    const result = await this.app.invokeGitlabApi(this.ctx.helper.apiParamsInject(this.app.api.gitlab.group.members, remoteid));
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

    const result = await this.app.invokeGitlabApi(this.ctx.helper.apiParamsInject(this.app.api.gitlab.project.list, remoteid));
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

    const result = await this.app.invokeGitlabApi(this.ctx.helper.apiParamsInject(this.app.api.gitlab.project.members, remoteid));
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
}

module.exports = GitlabController;

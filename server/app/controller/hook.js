'use strict';

const Controller = require('egg').Controller;

class HookController extends Controller {
  async index() {
    this.ctx.validate({
      event_name: [ 'push' ],
      ref: { type: 'string' },
      project_id: { type: 'number' },
    });
    const { event_name, project_id, ref } = this.ctx.request.body;
    console.log(project_id);

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

    if (this[event_name] && this[event_name] instanceof Function) {
      this[event_name]();
      this.ctx.status = 200;
    } else {
      this.ctx.status = 500;
    }

  }

  async push(body) {
    body = body || this.ctx.request.body;
    console.log(body);
  }
}

module.exports = HookController;

'use strict';

const Controller = require('egg').Controller;

class JobController extends Controller {
  async getJobList() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });

    const { project_id } = this.ctx.request.body;
    const jobs = await this.ctx.service.job.getJobList(project_id);
    let code,
      message,
      data;
    if (jobs) {
      code = 0;
      data = jobs;
    } else {
      code = 1;
      message = '任务列表获取失败';
    }
    this.ctx.body = { code, message, data };
  }

  async addJob() {
    this.ctx.validate({
      project_id: { type: 'string' },
      name: { type: 'string' },
      branch: { type: 'string' },
    });
    const job = await this.ctx.service.job.addJob(this.ctx.request.body);
    let code,
      message,
      data;
    if (job) {
      code = 0;
      data = job;
    } else {
      code = 1;
      message = '任务添加失败';
    }
    this.ctx.body = { code, message, data };
  }

  async deleteJob() {
    this.ctx.validate({
      id: { type: 'string' },
    });
    // TODO
    // 判断是否存在步骤
    let code,
      message,
      data;
    const { id } = this.ctx.request.body;
    const job = await this.ctx.service.job.getJobById(id);
    if (job && job.steps && job.steps.length) {
      code = 403;
      message = '请先清空该任务下步骤';
    } else {
      const status = await this.ctx.service.job.deleteJob(id);
      if (status) {
        code = 0;
        message = '任务删除成功';
      } else {
        code = 1;
        message = '任务删除失败';
      }
    }
    this.ctx.body = { code, message, data };
  }

}

module.exports = JobController;

'use strict';

const Controller = require('egg').Controller;

class JobController extends Controller {
  async getJobList() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });

    const { project_id } = this.ctx.request.body;
    const jobs = await this.service.job.getJobList(project_id);
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
    const job = await this.service.job.addJob(this.ctx.request.body);
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
    const job = await this.service.job.getJob({ _id: id });
    if (job && job.steps && job.steps.length) {
      code = 403;
      message = '请先清空该任务下步骤';
    } else {
      const status = await this.service.job.deleteJob(id);
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

  async getJobExecuteStatus() {
    this.ctx.validate({
      job_ids: {
        type: 'array',
        itemType: 'string',
      },
    });
    const { job_ids } = this.ctx.request.body;
    const code = 0;
    const data = {};
    for (const index in job_ids) {
      const job_id = job_ids[index];
      const log = await this.ctx.service.hooklog.getHookLogStatus(job_id);
      data[job_id] = log.status;
    }
    this.ctx.body = { code, data };
  }

  async updateJobExecuteStatus() {
    this.ctx.validate({
      job_id: { type: 'string' },
    });

    const { job_id } = this.ctx.request.body;
    const log = await this.ctx.service.hooklog.getHookLog(job_id);
    console.log(log.data);
    const response = await this.ctx.curl('http://127.0.0.1:4000/api/ci/gitlab_hook', {
      method: 'POST',
      contentType: 'json',
      dataType: 'text',
      data: log.data,
    })
      .then(response => {
        return {
          code: response.status === 200 ? 0 : response.status,
          message: response.status === 200 ? '任务重新执行成功' : response.data,
        };

      })
      .catch(error => ({ code: 1, message: error.message }));

    this.ctx.body = response;
  }
}

module.exports = JobController;

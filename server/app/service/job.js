'use strict';

const Service = require('egg').Service;

class JobService extends Service {
  async getJobList(project_id) {
    const jobs = await this.ctx.model.Job
      .find({
        project_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return jobs;
  }

  async getJobById(job_id) {
    const job = await this.ctx.model.Job
      .findOne({ _id: job_id })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return job;
  }

  async addJob(params) {
    const job = await this.ctx.model.Job
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return job;
  }

  async deleteJob(job_id) {
    const job = await this.ctx.model.Job
      .findOneAndRemove({
        _id: job_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return job;
  }
}

module.exports = JobService;

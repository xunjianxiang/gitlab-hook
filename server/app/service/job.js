'use strict';

const Service = require('egg').Service;

class JobService extends Service {
  async getJobList(project_id) {
    let jobs = await this.ctx.model.Job
      .find({
        project_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    if (jobs) {
      jobs = jobs.map(job => job.toJSON());
      for (const index in jobs) {
        const job = jobs[index];
        const log = await this.ctx.service.hooklog.getHookLogStatus(job.id);
        job.status = log.status;
      }
      return jobs;
    }
    return jobs;
    // const jobs = await this.ctx.model.Job
    //   .aggregate()
    //   .match({ project_id: this.app.mongoose.Types.ObjectId(project_id) })
    //   .lookup({ from: 'hooklogs', localField: '_id', foreignField: 'job_id', as: 'status' })
    //   .exec();

    // return jobs;

  }

  async getJob(condition) {
    const job = await this.ctx.model.Job
      .findOne(condition)
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

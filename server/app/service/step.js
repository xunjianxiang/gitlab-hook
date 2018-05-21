'use strict';

const Service = require('egg').Service;

class StepService extends Service {
  async getStepList(job_id) {
    const steps = await this.ctx.model.Step
      .find({
        job_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return steps;
  }

  async addStep(params) {
    const step = await this.ctx.model.Step
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return step;
  }

  async updateStep(id, update) {
    const step = await this.ctx.model.Step
      .findOneAndUpdate({
        _id: id,
      }, update)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return step;
  }

  async deleteStep(id) {
    const step = await this.ctx.model.Step
      .findOneAndRemove({
        _id: id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return step;
  }
}

module.exports = StepService;

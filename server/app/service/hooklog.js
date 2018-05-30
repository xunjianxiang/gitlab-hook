'use strict';

const Service = require('egg').Service;

class HookLogService extends Service {
  async addHookLog(params) {
    const log = this.ctx.model.HookLog
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return log;
  }

  async getHookLog(job_id) {
    const log = this.ctx.model.HookLog
      .findOne({
        job_id,
      },
      null,
      {
        sort: {
          _id: -1,
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return log;
  }

  async getHookLogStatus(job_id) {
    const log = this.ctx.model.HookLog
      .findOne({
        job_id,
      },
      'status',
      {
        sort: {
          _id: -1,
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return log;
  }

  async setHookLogStatus(job_id, status) {
    const log = this.ctx.model.HookLog
      .findOneAndUpdate({
        job_id,
      }, {
        status,
      }, {
        sort: {
          _id: -1,
        },
        new: true,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return log;
  }

  async getHookLogList(job_id) {
    const logs = this.ctx.model.HookLog
      .find({
        job_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return logs;
  }

  async addHookLogMessage(job_id, message) {
    const log = this.ctx.model.HookLog
      .findOneAndUpdate({
        job_id,
      }, {
        $push: {
          messages: message,
        },
        status: 'error',
      }, {
        sort: {
          _id: -1,
        },
        new: true,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return log;
  }
}

module.exports = HookLogService;

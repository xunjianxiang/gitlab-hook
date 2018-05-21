'use strict';

const Service = require('egg').Service;

class HookLogService extends Service {
  async addHookLog(params) {
    const log = this.ctx.model.HookLog
      .create(params)
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
}

module.exports = HookLogService;

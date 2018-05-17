'use strict';

module.exports = {

  async mongooseErrorCatch(error) {
    // 上报
    this.ctx.logger.error(error);
    return null;
  },

};

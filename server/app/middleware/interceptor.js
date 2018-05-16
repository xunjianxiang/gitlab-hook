'use strict';

module.exports = () => {
  return async function interceptor(ctx, next) {
    if (JSON.stringify(ctx.session) === '{}') {
      ctx.body = {
        code: 401,
        message: '请先登录',
      };
    } else {
      await next();
    }
  };
};

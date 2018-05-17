'use strict';

module.exports = () => {
  return async function interceptor(ctx, next) {
    if (ctx.session.user) {
      await next();
    } else {
      ctx.body = {
        code: 401,
        message: '请先登录',
      };
    }
  };
};

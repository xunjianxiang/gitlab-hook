'use strict';

module.exports = () => {
  return async function interceptor(ctx, next) {
    const user = ctx.session.user;
    if (user) {
      const { name, password, isldap } = user;
      isldap && await ctx.ldap(name, password);
      await next();
    } else {
      ctx.body = {
        code: 401,
        message: '未登录，请先登录',
      };
    }
  };
};

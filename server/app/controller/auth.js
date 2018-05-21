'use strict';

const Controller = require('egg').Controller;

class HookController extends Controller {
  async login() {
    // 重新登录时，删除之前登录信息
    this.ctx.session.user = null;

    let code,
      message,
      data;

    // 校验参数
    this.ctx.validate({
      name: { type: 'string' },
      password: { type: 'string' },
    });

    const { name, password, isldap } = this.ctx.request.body;
    let user;
    if (isldap) {
      // ldap 认证
      await this.ctx.ldap(name, password);
      user = await this.service.user.findOneByNameFromLdap(name, true);
      // 修改 session 中用户 password， 方便后期 ldap 实时认证
      user.password = password;
    } else {
      // 本地认证
      user = await this.service.user.findOneByNameAndPassword(name, password);
    }

    if (user) {
      this.ctx.session.user = user;
      code = 0;
      data = user;
    } else {
      code = code || 1;
      message = message || '账号密码错误';
    }

    this.ctx.body = { code, message, data };

  }

  async session() {
    let code,
      message,
      data;

    const user = this.ctx.session.user;
    if (user) {
      user.isldap && await this.ctx.ldap(user.name, user.password);
      code = 0;
      data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isldap: user.isldap,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } else {
      code = 401;
      message = '未登录';
    }
    this.ctx.body = { code, message, data };
  }

  async logout() {
    this.ctx.session = null;
    const code = 0;
    this.ctx.body = { code };
  }
}

module.exports = HookController;

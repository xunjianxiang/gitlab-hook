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
      // dap 认证
      code = await this.app.ldap(name, password);
      if (code) {
        message = 'ldap 认证失败';
      } else {
        user = await this.service.user.findOneByNameFromLdap(name, true);
      }
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
    await this.service.user.createOne({
      name: 'admin',
      email: 'admin@shuzilm.cn',
      role: 1,
      password: 'admin',
    });
    const user = this.ctx.session.user;
    if (user) {
      code = 0;
      data = user;
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

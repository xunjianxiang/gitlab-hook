'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getUserList() {
    let code,
      message,
      data;
    const users = await this.ctx.service.user.getUserList();
    if (users) {
      code = 0;
      data = users;
    } else {
      code = 1;
      message = '用户列表获取失败';
    }
    this.ctx.body = { code, message, data };
  }

}

module.exports = UserController;

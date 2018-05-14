'use strict';

const Controller = require('egg').Controller;

const GitlabEventMap = {
  'Push Hook': 'push',
  'Tag Push Hook': 'tag',
};

class HookController extends Controller {
  async index() {
    const event = GitlabEventMap[this.ctx.headers['x-gitlab-event']];
    if (!event) {
      this.ctx.status = 400;
      return;
    }

    if (this[event] && this[event] instanceof Function) {
      this[event]();
      this.ctx.status = 200;
    } else {
      this.ctx.status = 500;
    }

  }

  async push(body) {
    body = body || this.ctx.request.body;
    console.log(body);
  }
}

module.exports = HookController;

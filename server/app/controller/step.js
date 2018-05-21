'use strict';

const Controller = require('egg').Controller;

class StepController extends Controller {
  async getStepList() {
    this.ctx.validate({
      job_id: { type: 'string' },
    });

    const { job_id } = this.ctx.request.body;
    const code = 0;
    const data = await this.ctx.service.step.getStepList(job_id);
    this.ctx.body = { code, data };
  }

  async addStep() {
    this.ctx.validate({
      job_id: { type: 'string' },
      type: [ 'yapi', 'rundeck' ],
      param: { type: 'string' },
      order: { type: 'number', min: 1, required: false },
    });

    const step = await this.ctx.service.step.addStep(this.ctx.request.body);
    let code,
      message,
      data;
    if (step) {
      code = 0;
      data = {
        id: step.id,
      };
    } else {
      code = 1;
      message = '步骤添加失败';
    }
    this.ctx.body = { code, message, data };
  }

  async updateStep() {
    this.ctx.validate({
      id: { type: 'string' },
      type: [ 'yapi', 'rundeck' ],
      param: { type: 'string' },
      order: { type: 'number', min: 1, required: false },
    });
    const { id, type, param, order } = this.ctx.request.body;
    const step = await this.ctx.service.step.updateStep(id, { type, param, order });
    let code,
      message;
    if (step) {
      code = 0;
      message = '步骤更新成功';
    } else {
      code = 1;
      message = '步骤更新失败';
    }
    this.ctx.body = { code, message };
  }

  async deleteStep() {
    this.ctx.validate({
      id: { type: 'string' },
    });
    const { id } = this.ctx.request.body;
    const step = await this.ctx.service.step.deleteStep(id);
    let code,
      message;

    if (step) {
      code = 0;
      message = '步骤删除成功';
    } else {
      code = 0;
      message = '步骤删除失败';
    }

    this.ctx.body = { code, message };
  }
}

module.exports = StepController;

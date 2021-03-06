'use strict';

const Controller = require('egg').Controller;

class GroupController extends Controller {
  async getGroupList() {
    const groups = await this.service.group.getGroupList();
    this.ctx.body = {
      code: 0,
      data: groups || [],
    };
  }

  async addGroup() {
    // 校验参数
    this.ctx.validate({
      id: { type: 'number' },
      name: { type: 'string' },
      type: [ 1 ],
    }, this.ctx.request.body.remote);
    this.ctx.validate({
      name: { type: 'string' },
    });

    const { name, desc, remote } = this.ctx.request.body;

    // 检测远端仓库是否唯一
    const remoteUnique = await this.service.group.getRemoteUnique(remote);
    if (!remoteUnique) {
      this.ctx.body = {
        code: 409,
        message: '分组对应仓库已经存在',
      };
      return;
    }

    // 检测分组名称是否唯一
    const nameUnique = await this.service.group.getNameUnique(name);
    if (!nameUnique) {
      this.ctx.body = {
        code: 409,
        message: '分组名称重复',
      };
      return;
    }

    const group = await this.service.group.createGroup({
      name,
      desc,
      remote,
    });

    let code,
      message,
      data;
    if (group) {
      code = 0;
      data = {
        id: group.id,
      };
    } else {
      code = 1;
      message = '添加失败';
    }

    this.ctx.body = { code, message, data };
  }

  async getGroupUserList() {
    this.ctx.validate({
      id: { type: 'string' },
    });
    const { id } = this.ctx.request.body;
    const code = 0;
    const data = await this.service.group.getGroupUserList(id);
    this.ctx.body = { code, data };
  }

  async addGroupUser() {
    this.ctx.validate({
      group_id: { type: 'string' },
      user_id: { type: 'string' },
    });
    const { group_id, user_id, user_role } = this.ctx.request.body;
    let code,
      message;

    const exists = await this.service.group.getGroupUserExists(group_id, user_id, user_role);

    if (exists) {
      code = 409;
      message = '请不要添加重复的成员';
    } else {
      const status = await this.service.group.createGroupUser(group_id, user_id, user_role);
      if (status) {
        code = 0;
      } else {
        code = 1;
        message = '添加成员失败';
      }
    }

    this.ctx.body = { code, message };
  }

  async deleteGroupUser() {
    this.ctx.validate({
      group_id: { type: 'string' },
      user_id: { type: 'string' },
    });
    const { group_id, user_id } = this.ctx.request.body;
    let code,
      message;
    const status = await this.service.group.removeGroupUser(group_id, user_id);
    if (status) {
      code = 0;
    } else {
      code = 1;
      message = '删除失败';
    }
    this.ctx.body = { code, message };
  }

  async getGroupSetting() {
    this.ctx.validate({
      id: { type: 'string' },
    });
    const { id } = this.ctx.request.body;
    const setting = await this.service.group.getGroupSetting(id);
    let code,
      message,
      data;
    if (setting) {
      code = 0;
      data = setting;
    } else {
      code = 1;
      message = '分组设置获取失败';
    }
    this.ctx.body = { code, message, data };
  }

  async updateGroupSetting() {
    this.ctx.validate({
      id: { type: 'string' },
      setting: { type: 'object' },
    });

    const { id, setting } = this.ctx.request.body;
    const status = await this.service.group.updateGroupSetting(id, setting);
    let code,
      message,
      data;
    if (status) {
      code = 0;
      message = '分组设置更新成功';
    } else {
      code = 1;
      message = '分组设置更新失败';
    }
    this.ctx.body = { code, message, data };
  }

}

module.exports = GroupController;

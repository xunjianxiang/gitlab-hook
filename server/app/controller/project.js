'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async getProjectList() {
    this.ctx.validate({
      group_id: { type: 'string' },
    });
    const { group_id } = this.ctx.request.body;
    const code = 0;
    const data = await this.service.project.getProjectList(group_id);
    this.ctx.body = { code, data };
  }

  async addProject() {
    this.ctx.validate({
      id: { type: 'number' },
      name: { type: 'string' },
      type: { type: 'enum', values: [ 1 ] },
    }, this.ctx.request.body.remote);
    this.ctx.validate({
      group_id: { type: 'string' },
      name: { type: 'string' },
    });

    const { name, remote } = this.ctx.request.body;

    // 检测远端项目是否唯一
    const remoteUnique = await this.service.project.getRemoteUnique(remote);
    if (!remoteUnique) {
      this.ctx.body = {
        code: 409,
        message: '项目对应仓库已经存在',
      };
      return;
    }

    // 检测分组名称是否唯一
    const nameUnique = await this.service.project.getNameUnique(name);
    if (!nameUnique) {
      this.ctx.body = {
        code: 409,
        message: '项目名称重复',
      };
      return;
    }

    let code,
      message,
      data;

    const project = await this.service.project.addProject(this.ctx.request.body);

    if (project) {
      code = 0;
      data = {
        id: project.id,
      };
    } else {
      code = 1;
      message = '项目添加失败';
    }

    this.ctx.body = { code, message, data };
  }


  async getProjectUserList() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });
    const { project_id } = this.ctx.request.body;
    const users = await this.service.project.getProjectUserList(project_id);
    const code = 0;
    const data = users;
    this.ctx.body = { code, data };
  }

  async addProjectUser() {
    this.ctx.validate({
      project_id: { type: 'string' },
      user_id: { type: 'string' },
    });
    const { project_id, user_id, user_role } = this.ctx.request.body;
    let code,
      message;
    const exists = await this.service.project.getProjectUserExists(project_id, user_id);
    if (exists) {
      code = 409;
      message = '请不要添加重复的成员';
    } else {
      const status = await this.service.project.addProjectUser(project_id, user_id, user_role);
      if (status) {
        code = 0;
      } else {
        code = 1;
        message = '添加成员失败';
      }
    }

    this.ctx.body = { code, message };
  }

  async deleteProjectUser() {
    this.ctx.validate({
      project_id: { type: 'string' },
      user_id: { type: 'string' },
    });

    const { project_id, user_id } = this.ctx.request.body;

    let code,
      message;

    const status = await this.service.project.deleteProjectUser(project_id, user_id);
    if (status) {
      code = 0;
    } else {
      code = 1;
      message = '项目成员删除失败';
    }

    this.ctx.body = { code, message };

  }

  async getProjectSetting() {
    this.ctx.validate({
      project_id: { type: 'string' },
    });

    const { project_id } = this.ctx.request.body;
    const setting = await this.service.project.getProjectSetting(project_id);
    let code,
      message,
      data;
    if (setting) {
      code = 0;
      data = setting;
    } else {
      code = 1;
      message = '项目设置获取失败';
    }
    this.ctx.body = { code, message, data };
  }

  async updateProjectSetting() {
    this.ctx.validate({
      id: { type: 'string' },
      level: { type: 'string' },
    }, this.ctx.request.body.setting.dingtalk);
    this.ctx.validate({
      project_id: { type: 'string' },
      setting: { type: 'object' },
    });

    const { project_id, setting } = this.ctx.request.body;

    const status = this.service.project.updateProjectSetting(project_id, setting);

    let code,
      message;
    if (status) {
      code = 0;
      message = '项目设置更新成功';
    } else {
      code = 1;
      message = '项目设置更新失败';
    }

    this.ctx.body = { code, message };
  }
}

module.exports = ProjectController;

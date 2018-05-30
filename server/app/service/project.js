'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {
  async getRemoteUnique(remote) {
    const project = await this.ctx.model.Project
      .findOne({
        remote,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !project;
  }

  async getNameUnique(name) {
    const project = await this.ctx.model.Project
      .findOne({
        name,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !project;
  }

  async getProjectList(group_id) {
    const user = this.ctx.session.user;
    const condition = user.role === 1
      ? { group_id }
      : { group_id, 'users.id': { $in: [ user.id ] } };
    const projects = await this.ctx.model.Project
      .find(condition)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return projects;
  }

  async getProjectRemoteId(project_id, remote_type) {
    const project = await this.ctx.model.Project
      .findOne({
        _id: project_id,
        'remote.type': remote_type,
      }, 'remote.id').catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project && project.remote && project.remote.id;
  }

  async getProject(condition) {
    const project = await this.ctx.model.Project
      .findOne(condition)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }

  async addProject(params) {
    params.users = this.service.group.getGroupUserList(params.group_id);
    const project = await this.ctx.model.Project
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }

  async deleteProject(project_id) {
    const project = await this.ctx.model.Project
      .findOneAndRemove({
        _id: project_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }

  async getProjectUserExists(project_id, user_id) {
    const exists = await this.ctx.model.Project
      .findOne({
        _id: project_id,
        'users.id': user_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return exists;
  }

  async getProjectUserList(project_id) {
    const project = await this.ctx.model.Project
      .findOne({
        _id: project_id,
      }, 'users')
      .populate({ path: 'users.id', select: 'name email' })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project
      ? project.users
        .filter(user => user.id)
        .map(user => {
          user.id.role = user.role;
          return user.id;
        })
      : [];
  }

  async addProjectUser(project_id, user_id, user_role) {
    const project = await this.ctx.model.Project
      .findOneAndUpdate({
        _id: project_id,
      }, {
        $push: {
          users: {
            id: user_id,
            role: user_role,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }

  async deleteProjectUser(project_id, user_id) {
    const project = await this.ctx.model.Project
      .findOneAndUpdate({
        _id: project_id,
      }, {
        $pull: {
          users: {
            id: user_id,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }

  async getProjectSetting(project_id) {
    const project = await this.ctx.model.Project
      .findOne({
        _id: project_id,
      }, 'setting')
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project && project.setting;
  }

  async updateProjectSetting(project_id, setting) {
    const project = await this.ctx.model.Project
      .findOneAndUpdate({
        _id: project_id,
      }, {
        setting,
      }, {
        new: true,
        fields: 'setting',
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project;
  }
}

module.exports = ProjectService;

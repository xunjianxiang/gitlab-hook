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
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
      }, 'projects')
      .populate('projects')
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group
      ? group.projects
      : [];
  }

  async getProjectRemoteId(project_id, remote_type) {
    const project = await this.ctx.model.Project
      .findOne({
        _id: project_id,
        'remote.type': remote_type,
      }, 'remote.id').catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return project && project.remote && project.remote.id;
  }

  async addProject(params) {
    const project = await this.ctx.model.Project
      .create(params)
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
    return project && project.users && project.users.map(user => {
      user.id.role = user.role;
      return user.id;
    });
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

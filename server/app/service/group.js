'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async getRemoteUnique(remote) {
    const group = await this.ctx.model.Group
      .findOne({
        remote,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !group;
  }

  async getNameUnique(name) {
    const group = await this.ctx.model.Group
      .findOne({
        name,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return !group;
  }

  async getGroupListByUserId(uid) {
    const groups = await this.ctx.model.Group
      .find({
        users: { $in: [ uid ] },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return groups;
  }

  async createGroup(params) {
    const group = await this.ctx.model.Group
      .create(params)
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async getGroupUserExists(group_id, user_id) {
    const exists = await this.ctx.model.Group
      .findOne({
        _id: group_id,
        'users.id': user_id,
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return exists;
  }

  async getGroupUserList(group_id) {
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
      }, 'users')
      .populate({ path: 'users.id', select: 'name email' })
      .exec()
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group
      ? group.users.map(item => {
        item.id.role = item.role;
        return item.id;
      })
      : [];
  }

  async createGroupUser(group_id, user_id, user_role) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        $push: {
          users: {
            id: user_id,
            role: user_role,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async removeGroupUser(group_id, user_id) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        $pull: {
          users: {
            id: user_id,
          },
        },
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group;
  }

  async getGroupSetting(group_id) {
    const group = await this.ctx.model.Group
      .findOne({
        _id: group_id,
      }, 'setting')
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group.setting;
  }

  async updateGroupSetting(group_id, setting) {
    const group = await this.ctx.model.Group
      .findOneAndUpdate({
        _id: group_id,
      }, {
        setting,
      }, {
        new: true,
        fields: 'setting',
      })
      .catch(error => this.ctx.helper.mongooseErrorCatch(error));
    return group.setting;
  }
}

module.exports = UserService;

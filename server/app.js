'use strict';
const meanieMongooseToJson = require('meanie-mongoose-to-json');
// app.js
module.exports = app => {
  app.mongoose.plugin(meanieMongooseToJson);
  app.api = {
    gitlab: {
      group: {
        list: '/groups',
        members: '/groups/{1}/members',
      },
      project: {
        list: '/groups/{1}/projects',
        members: '/projects/{1}/members',
      },
      branch: {
        list: '/projects/{1}/repository/branches',
      },
      tag: {
        list: '/projects/{1}/repository/tags',
      },
    },
  };

  app.messenger.once('egg-ready', async () => {
    // 创建 admin 账户
    const user = await app.model.User.findOne({ name: 'admin' });
    user || await app.model.User.create({ name: 'admin', email: 'admin@shuzilm.cn', password: 'admin', role: 1 });
  });
};

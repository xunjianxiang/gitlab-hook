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
};

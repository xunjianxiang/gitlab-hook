'use strict';
const meanieMongooseToJson = require('meanie-mongoose-to-json');
// app.js
module.exports = app => {
  app.mongoose.plugin(meanieMongooseToJson);
};

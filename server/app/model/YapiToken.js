'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('yapi');

  const YapiTokenSchema = new Schema({
    project_id: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }, {
    timestamps: false,
  });

  return connection.model('YapiToken', YapiTokenSchema, 'token');
};

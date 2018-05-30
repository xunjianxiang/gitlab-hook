'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('yapi');

  const StepSchema = new Schema({
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    project_id: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
    },
    uid: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  }, {
    timestamps: false,
  });

  return connection.model('YapiInterfaceCol', StepSchema, 'interface_col');
};

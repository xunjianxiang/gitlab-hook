'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const ProjectSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    desc: { type: String },
    remote: {
      id: {
        type: Number,
        unique: true,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: Number,
        enum: [ 1 ],
        required: true,
      },
    },
    users: {
      type: [ Schema.Types.ObjectId ],
      ref: 'User',
      default: [],
    },
    jobs: {
      type: [ Schema.Types.ObjectId ],
      ref: 'Job',
      default: [],
    },
    setting: {
      yapi: {
        id: { type: Number },
      },
      dingtalk: {
        id: {
          type: Number,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    },
  }, {
    timestamps: true,
  });

  return connection.model('Project', ProjectSchema);
};

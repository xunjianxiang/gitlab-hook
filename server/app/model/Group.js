'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const GroupSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    desc: { type: String },
    remote: {
      id: {
        type: Number,
        autoIndex: true,
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
    projects: {
      type: [ Schema.Types.ObjectId ],
      ref: 'Project',
      default: [],
    },
    setting: {
      rundeck: {
        domain: {
          type: String,
        },
        token: {
          type: String,
        },
      },
      yapi: {
        domain: {
          type: String,
        },
      },
    },
  }, {
    timestamps: true,
  });

  return connection.model('Group', GroupSchema);
};

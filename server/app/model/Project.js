'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const ProjectUserSchema = new Schema({
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    role: {
      type: Number,
      enum: [ 1, 3 ],
      default: 3,
    },
  }, {
    _id: false,
  });

  const ProjectSettingSchema = new Schema({
    yapi: {
      id: {
        type: String,
      },
    },
    dingtalk: {
      id: {
        type: String,
      },
      level: {
        type: String,
      },
    },
  }, {
    _id: false,
  });

  const ProjectSchema = new Schema({
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
      type: [ ProjectUserSchema ],
      default: [],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    setting: {
      type: ProjectSettingSchema,
      default: {
        dingtalk: {
          id: '',
          level: '',
        },
        yapi: {
          id: '',
        },
      },
    },
  }, {
    timestamps: true,
  });

  return connection.model('Project', ProjectSchema);
};

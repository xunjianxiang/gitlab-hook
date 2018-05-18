'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const GroupUserSchema = new Schema({
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

  const GroupSettingSchema = new Schema({
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
  }, {
    _id: false,
  });

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
      type: [ GroupUserSchema ],
      default: [],
    },
    projects: {
      type: [ Schema.Types.ObjectId ],
      ref: 'Project',
      default: [],
    },
    setting: {
      type: GroupSettingSchema,
      default: {
        rundeck: {
          domain: '',
          token: '',
        },
        yapi: {
          domain: '',
        },
      },
    },
  }, {
    timestamps: true,
  });

  return connection.model('Group', GroupSchema);
};

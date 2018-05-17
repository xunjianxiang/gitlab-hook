'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const OperationLogSchema = new Schema({
    scope: {
      type: String,
      enum: [ 'group', 'project', 'job' ],
      required: true,
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    data: {
      original: {
        type: Schema.Types.Mixed,
      },
      current: {
        type: Schema.Types.Mixed,
      },
    },
    user_name: {
      type: String,
    },
  }, {
    timestamps: { createdAt: 'createdAt' },
  });

  return connection.model('OperationLog', OperationLogSchema);
};

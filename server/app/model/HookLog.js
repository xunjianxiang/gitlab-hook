'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const HookLogSchema = new Schema({
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
    event: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: [ 1 ],
      required: true,
    },
    gitlab_webhook_info: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: [ 'success', 'error', 'pending' ],
      required: true,
    },
    messages: {
      type: [ String ],
    },
  }, {
    timestamps: true,
  });

  return connection.model('HookLog', HookLogSchema);
};

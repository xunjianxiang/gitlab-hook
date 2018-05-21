'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const HookLogSchema = new Schema({
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    type: {
      type: Number,
      enum: [ 1 ],
      default: 1,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: [ 'success', 'error', 'pending' ],
      default: 'pending',
    },
    messages: {
      type: [ String ],
      default: [],
    },
  }, {
    timestamps: true,
  });

  return connection.model('HookLog', HookLogSchema);
};

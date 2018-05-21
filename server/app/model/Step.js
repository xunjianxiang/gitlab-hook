'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const StepSchema = new Schema({
    type: {
      type: String,
      enum: [ 'rundeck', 'yapi' ],
      required: true,
    },
    order: {
      type: Number,
      min: 1,
    },
    param: {
      type: String,
      required: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  }, {
    timestamps: true,
  });

  return connection.model('Step', StepSchema);
};

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const StepSchema = new Schema({
    id: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      enum: [ 'rundeck, yapi' ],
    },
    rundeck_jobid: {
      type: String,
    },
    yapi_env: {
      type: String,
    },
    order: {
      type: Number,
      min: 1,
    },
  });

  const JobSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    desc: { type: String },
    branch: { type: String },
    steps: {
      type: [ StepSchema ],
      required: false,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  }, {
    timestamps: true,
  });

  return connection.model('Job', JobSchema);
};

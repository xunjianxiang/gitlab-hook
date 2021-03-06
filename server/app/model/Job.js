'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const JobSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    desc: { type: String },
    branch: { type: String },
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

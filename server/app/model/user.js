'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connection = app.mongooseDB.get('ci');

  const UserSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: Number,
      enum: [ 1, 3 ],
      default: 3,
    },
    password: { type: String },
    isldap: { type: Boolean },
  }, {
    timestamps: true,
  });

  return connection.model('User', UserSchema);
};

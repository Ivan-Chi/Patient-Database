const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  admin: {
    type: Boolean,
    default: false,
  }
}
, { timestamps: true }
);

UserSchema.virtual('url').get(function() {
  return `/users/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
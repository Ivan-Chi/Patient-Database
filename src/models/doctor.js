const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DateTime } = require('luxon');

const doctorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

doctorSchema.virtual('url').get(function () {
  return `/doctors/${this._id}`;
});

doctorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

doctorSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

doctorSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Doctor', doctorSchema);
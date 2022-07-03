const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DateTime } = require('luxon');

const patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: { type: String },
  phone: { type: Number },
  email: { type: String },
  medicalHistory: { type: String },
  insurance: { type: Schema.Types.ObjectId, ref: 'Insurance' },
}, { timestamps: true });

patientSchema.virtual('url').get(function () {
  return `/patients/${this._id}`;
});

patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual('dateOfBirthFormatted').get(function () {
  return this.dateOfBirth ? DateTime.fromJSDate(this.dateOfBirth).toFormat('LLLL dd, yyyy') : '';
});

patientSchema.virtual('dateOfBirthISO').get(function () {
  return this.dateOfBirth ? DateTime.fromJSDate(this.dateOfBirth).toFormat('yyyy-LL-dd') : '';
});

patientSchema.virtual('age').get(function () {
  return this.dateOfBirth ? DateTime.fromJSDate(this.dateOfBirth).diffNow().years : '';
});

patientSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

patientSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Patient', patientSchema);
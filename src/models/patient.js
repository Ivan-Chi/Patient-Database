const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DateTime } = require('luxon');

const patientSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  medicalHistory: { type: String, required: true },
  insurance: { type: Schema.Types.ObjectId, ref: 'Insurance' },
  visits: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

patientSchema.virtual('url').get(function () {
  return `/patients/${this._id}`;
});

patientSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

patientSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Patient', patientSchema);
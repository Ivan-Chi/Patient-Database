const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Patient = require('../models/patient');
const { DateTime } = require('luxon');

const insuranceSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

insuranceSchema.virtual('url').get(function () {
  return `/insurances/${this._id}`;
});

insuranceSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

insuranceSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Insurance', insuranceSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const visitSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, default: Date.now, required: true },
  diagnosis: { type: String },
  treatment: { type: String },
  purchases: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  price: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

visitSchema.virtual('url').get(function () {
  return `/visits/${this._id}`;
});

visitSchema.virtual('dateFormatted').get(function () {
  return DateTime.fromJSDate(this.date).toFormat('yyyy-LL-dd');
});

visitSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

visitSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Visit', visitSchema);
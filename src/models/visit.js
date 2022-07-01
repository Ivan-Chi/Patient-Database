const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date, default: Date.now },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  purchases: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
  price: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

visitSchema.virtual('url').get(function () {
  return `/visits/${this._id}`;
});

visitSchema.virtual('createdAtFormatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat('dd LLL yyyy');
});

visitSchema.virtual('updatedAtFormatted').get(function () {
  return DateTime.fromJSDate(this.updatedAt).toFormat('dd LLL yyyy');
});

module.exports = mongoose.model('Visit', visitSchema);
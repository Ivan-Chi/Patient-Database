const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date, default: Date.now },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

visitSchema.virtual('url').get(function () {
  return `/visits/${this._id}`;
});

module.exports = mongoose.model('Visit', visitSchema);
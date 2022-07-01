const Patient = require('../models/patient');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Patient.find({}, function(err, patients) {
    if (err) {
      return next(err);
    }
    res.render('patients/index', { title: 'Patients', patients: patients });
  });
}

exports.new = function(req, res, next) {
  res.render('patients/new', { title: 'New Patient' });
}

exports.show = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patients/show', { title: 'Patient', patient: patient });
  });
}

exports.edit = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patients/edit', { title: 'Edit Patient', patient: patient });
  });
}

exports.delete = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patients/delete', { title: 'Delete Patient', patient: patient });
  });
}

exports.destroy = function(req, res, next) {
  Patient.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/patients');
  });
}

exports.create = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('patients/new', { title: 'New Patient', errors: errors.array() });
  }
  const patient = new Patient(req.body);
  patient.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/patients');
  });
}

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('patients/edit', { title: 'Edit Patient', errors: errors.array() });
  }
  Patient.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/patients');
  });
}
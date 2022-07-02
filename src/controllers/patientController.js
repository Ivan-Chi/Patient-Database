const Patient = require('../models/patient');
const { validationResult } = require('express-validator');
const insurance = require('../models/insurance');

exports.index = function(req, res, next) {
  Patient.find({}, function(err, patients) {
    if (err) {
      return next(err);
    }
    res.render('patientsIndex', { title: 'Patients', patients: patients });
  });
}

exports.new = function(req, res, next) {
  res.render('patientsNew', { title: 'New Patient' });
}

exports.show = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patientsShow', { title: 'Patient', patient: patient });
  });
}

exports.edit = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patientsEdit', { title: 'Edit Patient', patient: patient });
  });
}

exports.delete = function(req, res, next) {
  Patient.findById(req.params.id, function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patientsDelete', { title: 'Delete Patient', patient: patient });
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
    return res.render('patientsNew', { title: 'New Patient', errors: errors.array() });
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
    return res.render('patientsEdit', { title: 'Edit Patient', errors: errors.array() });
  }
  Patient.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/patients');
  });
}
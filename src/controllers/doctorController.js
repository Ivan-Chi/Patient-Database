const Doctor = require('../models/doctor');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Doctor.find({}, function(err, doctors) {
    if (err) {
      return next(err);
    }
    res.render('doctorsIndex', { title: 'Doctors', doctors: doctors });
  });
}

exports.new = function(req, res, next) {
  res.render('doctorsNew', { title: 'New Doctor' });
}

exports.show = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctorsShow', { title: 'Doctor', doctor: doctor });
  });
}

exports.edit = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctorsEdit', { title: 'Edit Doctor', doctor: doctor });
  });
}

exports.delete = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctorsDelete', { title: 'Delete Doctor', doctor: doctor });
  });
}

exports.destroy = function(req, res, next) {
  Doctor.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/doctors');
  });
}

exports.create = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('doctorsNew', { title: 'New Doctor', errors: errors.array() });
  }
  const doctor = new Doctor(req.body);
  doctor.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/doctors');
  });
}

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('doctorsEdit', { title: 'Edit Doctor', errors: errors.array() });
  }
  Doctor.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/doctors');
  });
}

const Doctor = require('../models/doctor');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Doctor.find({}, function(err, doctors) {
    if (err) {
      return next(err);
    }
    res.render('doctors/index', { title: 'Doctors', doctors: doctors });
  });
}

exports.new = function(req, res, next) {
  res.render('doctors/new', { title: 'New Doctor' });
}

exports.show = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctors/show', { title: 'Doctor', doctor: doctor });
  });
}

exports.edit = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctors/edit', { title: 'Edit Doctor', doctor: doctor });
  });
}

exports.delete = function(req, res, next) {
  Doctor.findById(req.params.id, function(err, doctor) {
    if (err) {
      return next(err);
    }
    res.render('doctors/delete', { title: 'Delete Doctor', doctor: doctor });
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
    return res.render('doctors/new', { title: 'New Doctor', errors: errors.array() });
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
    return res.render('doctors/edit', { title: 'Edit Doctor', errors: errors.array() });
  }
  Doctor.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/doctors');
  });
}

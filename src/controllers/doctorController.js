const Doctor = require('../models/doctor');
const Visit = require('../models/visit');
const { body, validationResult } = require('express-validator');
const async = require('async');

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
  async.parallel({
    doctor: function(callback) {
      Doctor.findById(req.params.id).exec(callback);
    },
    visits: function(callback) {
      Visit.find({ doctor: req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if(results.visits.length > 0) {
      res.render('doctorsDelete', { title: 'Delete Doctor', doctor: results.doctor, visits: results.visits });
    } else {
      Doctor.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/doctors');
      });
    }
  });
}

exports.create = [
  body('firstName').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long'),
  body('lastName').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long'),
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('phone').isLength({ min: 3 }).withMessage('Phone must be at least 10 characters long'),
  body('address').isLength({ min: 1 }).withMessage('Address must be at least 3 characters long'),

  (req, res, next) => {
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
]

exports.update = [
  body('firstName').isLength({ min: 1 }).withMessage('Name must be at least 3 characters long'),
  body('lastName').isLength({ min: 1 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('phone').isLength({ min: 3 }).withMessage('Phone must be at least 10 characters long'),
  body('address').isLength({ min: 1 }).withMessage('Address must be at least 3 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Doctor.findById(req.params.id, function(err, doctor) {
        if (err) {
          return next(err);
        }
          res.render('doctorsEdit', { title: 'Edit Doctor', doctor, errors: errors.array() });
      });
      return;
    }

    Doctor.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/doctors');
    });
  }
]
const Patient = require('../models/patient');
const { body, validationResult } = require('express-validator');
const Insurance = require('../models/insurance');
const Visit = require('../models/visit');
const async = require('async');

exports.index = function(req, res, next) {
  Patient.find().populate('insurance').exec(function(err, patients) {
    if (err) {
      return next(err);
    }
    res.render('patientsIndex', { title: 'Patients', patients: patients });
  });
}


exports.new = function(req, res, next) {
  Insurance.find({}, function(err, insurances) {
    if (err) {
      return next(err);
    }
    res.render('patientsNew', { title: 'New Patient', insurances: insurances });
  });
}

exports.show = function(req, res, next) {
  Patient.findOne({ _id: req.params.id }).populate('insurance').exec(function(err, patient) {
    if (err) {
      return next(err);
    }
    res.render('patientsShow', { title: 'Patient', patient: patient });
  });
}

exports.edit = function(req, res, next) {
  async.parallel({
    patient: function(callback) {
      Patient.findById(req.params.id).populate('insurance').exec(callback);
    },
    insurances: function(callback) {
      Insurance.find({}, callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('patientsEdit', { title: 'Edit Patient', patient: results.patient, insurances: results.insurances });
  });
}

exports.delete = function(req, res, next) {
  async.parallel({
    patient: function(callback) {
      Patient.findById(req.params.id).populate('insurance').exec(callback);
    },
    visits: function(callback) {
      Visit.find({ patient: req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if(results.visits.length > 0) {
      res.render('patientsDelete', { title: 'Delete Patient', patient: results.patient, visits: results.visits });
    } else {
      Patient.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/patients');
      });
    }
  });
}

exports.create = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required').escape(),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required').escape(),
  body('dateOfBirth').trim().isLength({ min: 1 }).withMessage('Date of birth is required').escape(),
  body('address').trim().isLength({ min: 1 }).withMessage('Address is required').escape(),
  body('phone')
    .trim()
    .isLength({ min: 3 }).withMessage('Phone is required')
    .escape(),
  body('email')
    .trim()
    .isLength({ min: 1 }).withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .escape(),
  body('medicalHistory').trim().isLength({ min: 1 }).withMessage('Medical history is required').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Insurance.find({}, function(err, insurances) {
        if (err) {
          return next(err);
        }
        res.render('patientsNew', { title: 'New Patient', insurances: insurances, errors: errors.array() });
      });
      return;
    }
    const patient = new Patient(req.body);
    patient.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/patients');
    });
  }
]

exports.update = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required').escape(),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required').escape(),
  body('dateOfBirth').trim().isLength({ min: 1 }).withMessage('Date of birth is required').escape(),
  body('address').trim().isLength({ min: 1 }).withMessage('Address is required').escape(),
  body('phone')
    .trim()
    .isLength({ min: 3 }).withMessage('Phone is required')
    .escape(),
  body('email')
    .trim()
    .isLength({ min: 1 }).withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .escape(),
  body('medicalHistory').trim().isLength({ min: 1 }).withMessage('Medical history is required').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel({
        patient: function(callback) {
          Patient.findById(req.params.id).populate('insurance').exec(callback);
        },
        insurances: function(callback) {
          Insurance.find(callback);
        }
      }, function(err, results) {
        return res.render('patientsEdit', { 
          title: 'Edit Patient', 
          patient: results.patient,
          insurances: results.insurances,
          errors: errors.array() 
        });
      });
      return;
    }
    Patient.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(`/patients/${req.params.id}`);
    });
  }
]

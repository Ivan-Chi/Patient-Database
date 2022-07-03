const Visit = require('../models/visit');
const { body, validationResult } = require('express-validator');
const async = require('async');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.index = function(req, res, next) {
  Visit.find()
    .populate('patient')
    .populate('doctor')
  .exec(function(err, visits) {
    if (err) {
      return next(err);
    }
    res.render('visitsIndex', { title: 'Visits', visits: visits });
  });
}

exports.new = function(req, res, next) {
  async.parallel({
    patients: function(callback) {
      Patient.find(callback);
    },
    doctors: function(callback) {
      Doctor.find(callback);
    },
    products: function(callback) {
      Product.find(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('visitsNew', { title: 'New Visit', patients: results.patients, doctors: results.doctors, products: results.products });
  });  
}

exports.show = function(req, res, next) {
  Visit.findOne({ _id: req.params.id })
    .populate({
      path: 'purchases',
      select:
        '_id name description msrp',
    })
    .populate('doctor')
    .populate('patient')
    .exec(function(err, visit) {
    if (err) {
      return next(err);
    }
    res.render('visitsShow', { title: 'Visit', visit: visit });
  });
}

exports.edit = function(req, res, next) {
  async.parallel({
    visit: function(callback) {
      Visit.findById(req.params.id, callback);
    },
    patients: function(callback) {
      Patient.find(callback);
    },
    doctors: function(callback) {
      Doctor.find(callback);
    },
    products: function(callback) {
      Product.find(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('visitsEdit', { title: 'Edit Visit', visit: results.visit, patients: results.patients, doctors: results.doctors, products: results.products });
  })
}

exports.delete = function(req, res, next) {
  Visit.findById(req.params.id, function(err, visit) {
    if (err) {
      return next(err);
    }
    res.render('visitsDelete', { title: 'Delete Visit', visit: visit });
  });
}

exports.destroy = function(req, res, next) {
  Visit.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/visits');
  });
}

exports.create = [
  body('patient').isLength({ min: 1 }).trim().withMessage('Patient is required').escape(),
  body('doctor').isLength({ min: 1 }).trim().withMessage('Doctor is required').escape(),
  body('date').trim().isDate().withMessage('Date must be a valid date').escape(),
  body('price').isLength({ min: 1 }).trim().withMessage('Price is required').escape(),
  body('diagnosis').escape(),
  body('treatment').escape(),
  body('notes').escape(),
  body('purchases').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel({
        patients: function(callback) {
          Patient.find(callback);
        },
        doctors: function(callback) {
          Doctor.find(callback);
        },
        products: function(callback) {
          Product.find(callback);
        }
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        res.render('visitsNew', { title: 'New Visit', patients: results.patients, doctors: results.doctors, products: results.products, errors: errors.array() });
      });
      return;
    } 

    for(let i = 0; i < req.body["purchases[]"].length; i++) {
      req.body["purchases[]"][i] = mongoose.Types.ObjectId(req.body["purchases[]"][i]);
    }

    const visit = new Visit({
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: req.body.date,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      notes: req.body.notes,
      purchases: req.body["purchases[]"],
      price: req.body.price
    });
    visit.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/visits');
    });
  }
]

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('visitsEdit', { title: 'Edit Visit', errors: errors.array() });
  }
  Visit.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/visits');
  });
}
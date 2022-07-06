const Insurance = require('../models/insurance');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/patient');
const async = require('async');

exports.index = function(req, res, next) {
  Insurance.find({}, function(err, insurances) {
    if (err) {
      return next(err);
    }
    res.render('insurancesIndex', { title: 'Insurances', insurances: insurances });
  });
}

exports.new = function(req, res, next) {
  res.render('insurancesNew', { title: 'New Insurance' });
}

exports.show = function(req, res, next) {
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurancesShow', { title: 'Insurance', insurance: insurance });
  });
}

exports.edit = function(req, res, next) {
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurancesEdit', { title: 'Edit Insurance', insurance: insurance });
  });
}

exports.delete = function(req, res, next) {
  if(!req.user.admin) {
    return res.redirect('/insurances');
  }

  async.parallel({
    insurance: function(callback) {
      Insurance.findById(req.params.id).exec(callback);
    },
    patients: function(callback) {
      Patient.find({ 'insurance': req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.patients.length > 0) {
      res.render('insurancesDelete', { title: 'Delete Insurance', insurance: results.insurance, patients: results.patients });
    } else {
      Insurance.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/insurances');
      });
    }
  });
}

exports.create = [
  body('name').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long').escape(),
  body('address').isLength({ min: 1 }).withMessage('Address must be at least 1 characters long').escape(),
  body('phone').isLength({ min: 1 }).withMessage('Phone must be at least 1 characters long').escape(),
  body('email').isEmail().withMessage('Email must be a valid email address').escape(),

  (req, res, next) => {
    if(!req.user.admin) {
      return res.redirect('/insurances');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('insurancesNew', { title: 'New Insurance', errors: errors.array() });
    }
    const insurance = new Insurance({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
    });
    insurance.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/insurances');
    });
  }
]

exports.update = [
  body('name').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long').escape(),
  body('address').isLength({ min: 1 }).withMessage('Address must be at least 1 characters long').escape(),
  body('phone').isLength({ min: 3 }).withMessage('Phone must be at least 3 characters long').escape(),
  body('email').isEmail().withMessage('Email must be a valid email address').escape(),

  (req, res, next) => {
    if(!req.user.admin) {
      return res.redirect('/insurances');
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Insurance.findById(req.params.id, function(err, insurance) {
        if (err) {
          return next(err);
        }
      return res.render('insurancesEdit', { title: 'Edit Insurance', insurance, errors: errors.array() });
      });
      return;
    }
    Insurance.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
    }, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(`/insurances/${req.params.id}`);
    });
  }
]
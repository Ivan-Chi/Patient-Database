const Insurance = require('../models/insurance');
const { validationResult } = require('express-validator');

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
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurancesDelete', { title: 'Delete Insurance', insurance: insurance });
  });
}

exports.destroy = function(req, res, next) {
  Insurance.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/insurances');
  });
}

exports.create = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('insurancesNew', { title: 'New Insurance', errors: errors.array() });
  }
  const insurance = new Insurance(req.body);
  insurance.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/insurances');
  });
}

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('insurancesEdit', { title: 'Edit Insurance', errors: errors.array() });
  }
  Insurance.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/insurances');
  });
}
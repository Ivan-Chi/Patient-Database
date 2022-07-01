const Insurance = require('../models/insurance');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Insurance.find({}, function(err, insurances) {
    if (err) {
      return next(err);
    }
    res.render('insurances/index', { title: 'Insurances', insurances: insurances });
  });
}

exports.new = function(req, res, next) {
  res.render('insurances/new', { title: 'New Insurance' });
}

exports.show = function(req, res, next) {
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurances/show', { title: 'Insurance', insurance: insurance });
  });
}

exports.edit = function(req, res, next) {
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurances/edit', { title: 'Edit Insurance', insurance: insurance });
  });
}

exports.delete = function(req, res, next) {
  Insurance.findById(req.params.id, function(err, insurance) {
    if (err) {
      return next(err);
    }
    res.render('insurances/delete', { title: 'Delete Insurance', insurance: insurance });
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
    return res.render('insurances/new', { title: 'New Insurance', errors: errors.array() });
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
    return res.render('insurances/edit', { title: 'Edit Insurance', errors: errors.array() });
  }
  Insurance.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/insurances');
  });
}
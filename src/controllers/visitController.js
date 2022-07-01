const Visit = require('../models/visit');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Visit.find({}, function(err, visits) {
    if (err) {
      return next(err);
    }
    res.render('visits/index', { title: 'Visits', visits: visits });
  });
}

exports.new = function(req, res, next) {
  res.render('visits/new', { title: 'New Visit' });
}

exports.show = function(req, res, next) {
  Visit.findById(req.params.id, function(err, visit) {
    if (err) {
      return next(err);
    }
    res.render('visits/show', { title: 'Visit', visit: visit });
  });
}

exports.edit = function(req, res, next) {
  Visit.findById(req.params.id, function(err, visit) {
    if (err) {
      return next(err);
    }
    res.render('visits/edit', { title: 'Edit Visit', visit: visit });
  });
}

exports.delete = function(req, res, next) {
  Visit.findById(req.params.id, function(err, visit) {
    if (err) {
      return next(err);
    }
    res.render('visits/delete', { title: 'Delete Visit', visit: visit });
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

exports.create = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('visits/new', { title: 'New Visit', errors: errors.array() });
  }
  const visit = new Visit(req.body);
  visit.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/visits');
  });
}

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('visits/edit', { title: 'Edit Visit', errors: errors.array() });
  }
  Visit.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/visits');
  });
}
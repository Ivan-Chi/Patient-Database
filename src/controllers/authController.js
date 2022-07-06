const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');

exports.signin = function(req, res, next) {
  if (req.user) {
    return res.redirect('/visits');
  }
  res.render('signin', { title: 'Sign In' });
}

exports.signup = function(req, res, next) {
  if (req.user) {
    return res.redirect('/visits');
  }
  res.render('signup', { title: 'Sign Up' });
}

exports.authenticate = [
  body('username').isLength({ min: 1 }).trim().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signin', { title: 'Sign In', errors: errors.array() });
    } else {
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
        // failureFlash: true
      })(req, res, next);
    }
  }
]

exports.create = [
  body('username').isLength({ min: 1 }).trim().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('password-confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }).withMessage('Passwords must match'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signup', { title: 'Sign Up', errors: errors.array() });
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hash
        });
        user.save(function(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/signin');
        });
      });
    }
  }
]

exports.logout = function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}
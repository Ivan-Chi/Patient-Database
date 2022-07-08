const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');

exports.signin = function(req, res, next) {
  if (req.user) {
    return res.redirect('/visits');
  }
  return res.render('signin', { title: 'Sign In' });
}

exports.signup = function(req, res, next) {
  if (req.user) {
    return res.redirect('/visits');
  }
  return res.render('signup', { title: 'Sign Up' });
}

exports.authenticate = [
  body('username').isLength({ min: 1 }).trim().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signin', { title: 'Sign In', errors: errors.array() });
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
      return res.render('signup', { title: 'Sign Up', errors: errors.array() });
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
          return res.redirect('/signin');
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
    return res.redirect('/');
  });
}

exports.users = function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    return res.render('users', { title: 'Users', users: users });
  });
}

exports.delete = function(req, res, next) {
  if(!req.user.admin){
    return res.redirect('/');
  }
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    if(user.admin){
      User.count({admin: true}, function(err, count) {
        if (err) {
          return next(err);
        }
        if(count>1){
          User.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect('/users');
          });
        } else {
          return res.redirect('/users');
        }
      });
    } else{
      User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/users');
      });
    }
  });
}

exports.makeAdmin = function(req, res, next) {
  if(!req.user.admin){
    return res.redirect('/');
  }

  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    if(user.admin){
      User.count({admin: true}, function(err, count) {
        if (err) {
          return next(err);
        }
        if(count>1){
          user.admin = false;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
          });
          return res.redirect('/users');
        }
        return res.redirect('/users');
      });
    }
    else{
      user.admin = true;
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/users');
      });
    }
  });
}

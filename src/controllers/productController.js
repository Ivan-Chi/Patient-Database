const Product = require('../models/product');
const { body, validationResult } = require('express-validator');
const Visit = require('../models/visit');
const async = require('async');

exports.index = function(req, res, next) {
  Product.find({}, function(err, products) {
    if (err) {
      return next(err);
    }
    res.render('productsIndex', { title: 'Products', products: products });
  });
}

exports.new = function(req, res, next) {
  res.render('productsNew', { title: 'New Product' });
}

exports.show = function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.render('productsShow', { title: 'Product', product: product });
  });
}

exports.edit = function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.render('productsEdit', { title: 'Edit Product', product: product });
  });
}

exports.delete = function(req, res, next) {
  async.parallel({
    product: function(callback) {
      Product.findById(req.params.id).exec(callback);
    },
    visits: function(callback) {
      Visit.find({ purchases: req.params.id }).exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (results.visits.length > 0) {
      res.render('productsDelete', { title: 'Delete Product', product: results.product, visits: results.visits });
    } else {
      Product.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/products');
      });
    }
  });
}

exports.create = [
  body('name').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long').escape(),
  body('description').isLength({ min: 1 }).withMessage('Description must be at least 1 characters long').escape(),
  body('msrp').isLength({ min: 1 }).withMessage('MSRP must be at least 1 characters long').escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('productsNew', { title: 'New Product', errors: errors.array() });
    }
    const product = new Product(req.body);
    product.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/products');
    });
  }
]

exports.update = [
  body('name').isLength({ min: 1 }).withMessage('Name must be at least 1 characters long').escape(),
  body('description').isLength({ min: 1 }).withMessage('Description must be at least 1 characters long').escape(),
  body('msrp').isLength({ min: 1 }).withMessage('MSRP must be at least 1 characters long').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('productsEdit', { title: 'Edit Product', errors: errors.array() });
    }
    Product.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/products');
    });
  }
]
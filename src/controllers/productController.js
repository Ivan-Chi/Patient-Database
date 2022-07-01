const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Product.find({}, function(err, products) {
    if (err) {
      return next(err);
    }
    res.render('products/index', { title: 'Products', products: products });
  });
}

exports.new = function(req, res, next) {
  res.render('products/new', { title: 'New Product' });
}

exports.show = function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.render('products/show', { title: 'Product', product: product });
  });
}

exports.edit = function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.render('products/edit', { title: 'Edit Product', product: product });
  });
}

exports.delete = function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return next(err);
    }
    res.render('products/delete', { title: 'Delete Product', product: product });
  });
}

exports.destroy = function(req, res, next) {
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/products');
  });
}

exports.create = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/new', { title: 'New Product', errors: errors.array() });
  }
  const product = new Product(req.body);
  product.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/products');
  });
}

exports.update = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/edit', { title: 'Edit Product', errors: errors.array() });
  }
  Product.findByIdAndUpdate(req.params.id, req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/products');
  });
}
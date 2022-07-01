const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor');
const insuranceController = require('../controllers/insurance');
const patientController = require('../controllers/patient');
const productController = require('../controllers/product');
const visitController = require('../controllers/visit');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Doctors
router.get('/doctors', doctorController.index);
router.get('/doctors/new', doctorController.new);
router.get('/doctors/:id', doctorController.show);
router.get('/doctors/:id/update', doctorController.edit);
router.get('/doctors/:id/delete', doctorController.delete);

router.post('/doctors/:id/delete', doctorController.destroy);
router.post('/doctors/new', doctorController.create);
router.post('/doctors/:id/update', doctorController.update);

// gets and posts for insurance
router.get('/insurances', insuranceController.index);
router.get('/insurances/new', insuranceController.new);
router.get('/insurances/:id', insuranceController.show);
router.get('/insurances/:id/update', insuranceController.edit);
router.get('/insurances/:id/delete', insuranceController.delete);

router.post('/insurances/new', insuranceController.create);
router.post('/insurances/:id/delete', insuranceController.destroy);
router.post('/insurances/:id/update', insuranceController.update);

// gets and posts for patient
router.get('/patients', patientController.index);
router.get('/patients/new', patientController.new);
router.get('/patients/:id', patientController.show);
router.get('/patients/:id/update', patientController.edit);
router.get('/patients/:id/delete', patientController.delete);

router.post('/patients/new', patientController.create);
router.post('/patients/:id/delete', patientController.destroy);
router.post('/patients/:id/update', patientController.update);

// gets and posts for product
router.get('/products', productController.index);
router.get('/products/new', productController.new);
router.get('/products/:id', productController.show);
router.get('/products/:id/update', productController.edit);
router.get('/products/:id/delete', productController.delete);

router.post('/products/new', productController.create);
router.post('/products/:id/delete', productController.destroy);
router.post('/products/:id/update', productController.update);

// gets and posts for visit
router.get('/visits', visitController.index);
router.get('/visits/new', visitController.new);
router.get('/visits/:id', visitController.show);
router.get('/visits/:id/update', visitController.edit);
router.get('/visits/:id/delete', visitController.delete);

router.post('/visits/new', visitController.create);
router.post('/visits/:id/delete', visitController.destroy);
router.post('/visits/:id/update', visitController.update);

module.exports = router;

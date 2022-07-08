const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');
const insuranceController = require('../controllers/insuranceController');
const patientController = require('../controllers/patientController');
const productController = require('../controllers/productController');
const visitController = require('../controllers/visitController');
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.redirect('/signin');
});

// gets and posts for doctor
router.get('/doctors', doctorController.index);
router.get('/doctors/new', doctorController.new);
router.get('/doctors/:id', doctorController.show);
router.get('/doctors/:id/update', doctorController.edit);
router.get('/doctors/:id/delete', doctorController.delete);

router.post('/doctors/:id/delete', doctorController.delete);
router.post('/doctors/new', doctorController.create);
router.post('/doctors/:id/update', doctorController.update);

// gets and posts for insurance
router.get('/insurances', insuranceController.index);
router.get('/insurances/new', insuranceController.new);
router.get('/insurances/:id', insuranceController.show);
router.get('/insurances/:id/update', insuranceController.edit);
router.get('/insurances/:id/delete', insuranceController.delete);

router.post('insurances/:id/delete', insuranceController.delete);
router.post('/insurances/new', insuranceController.create);
router.post('/insurances/:id/update', insuranceController.update);

// gets and posts for patient
router.get('/patients', patientController.index);
router.get('/patients/new', patientController.new);
router.get('/patients/:id', patientController.show);
router.get('/patients/:id/update', patientController.edit);
router.get('/patients/:id/delete', patientController.delete);

router.post('/patients/:id/delete', patientController.delete);
router.post('/patients/new', patientController.create);
router.post('/patients/:id/update', patientController.update);

// gets and posts for product
router.get('/products', productController.index);
router.get('/products/new', productController.new);
router.get('/products/:id', productController.show);
router.get('/products/:id/update', productController.edit);
router.get('/products/:id/delete', productController.delete);

router.post('/products/:id/delete', productController.delete);
router.post('/products/new', productController.create);
router.post('/products/:id/update', productController.update);

// gets and posts for visit
router.get('/visits', visitController.index);
router.get('/visits/new', visitController.new);
router.get('/visits/:id', visitController.show);
router.get('/visits/:id/update', visitController.edit);
router.get('/visits/:id/delete', visitController.delete);

router.post('/visits/:id/delete', visitController.delete);
router.post('/visits/new', visitController.create);
router.post('/visits/:id/update', visitController.update);

// gets and posts for authentication
router.get('/signin', authController.signin);
router.get('/signup', authController.signup);
router.post('/signin', authController.authenticate)
router.post('/signup', authController.create);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

router.get('/users', authController.users);
// router.get('/users/:id/delete', authController.delete);
// router.post('users/:id/makeAdmin', authController.makeAdmin);
router.all('/users/:id/delete', authController.delete);
router.all('/users/:id/makeAdmin', authController.makeAdmin);

module.exports = router;

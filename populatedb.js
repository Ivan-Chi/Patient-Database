#! /usr/bin/env node

console.log(
  'Populating database with sample data -- please wait.'
);

const userArgs = process.argv.slice(2);

const async = require('async');
const { faker } = require('@faker-js/faker');
const Doctor = require('./src/models/doctor');
const Patient = require('./src/models/patient');
const Product = require('./src/models/product');
const Visit = require('./src/models/visit');
const Insurance = require('./src/models/insurance');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB');
});
mongoose.connection.on('error', err => {
  console.log('Error connecting to MongoDB:', err);
});

const doctors = [];
const patients = [];
const products = [];
const visits = [];
const insurances = [];

const doctorCreate = ( firstName, lastName, phone, email, address, cb) => {
  doctorDetails = { firstName, lastName, phone, email, address };
  const doctor = new Doctor(doctorDetails);
  doctor.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Doctor: ' + doctor);
    doctors.push(doctor);
    cb(null, doctor);
  });
}

const patientCreate = (firstName, lastName, dateOfBirth, address, phone, email, medicalHistory, insurance, cb) => {
  patientDetails = { firstName, lastName, dateOfBirth, address, phone, medicalHistory, insurance };
  const patient = new Patient(patientDetails);
  patient.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Patient: ' + patient);
    patients.push(patient);
    cb(null, patient);
  });
}

const productCreate = (name, description, msrp, cb) => {
  productDetails = { name, description, msrp };
  const product = new Product(productDetails);
  product.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Product: ' + product);
    products.push(product);
    cb(null, product);
  });
}

const visitCreate = (patient, doctor, date, diagnosis, treatment, purchases, price, notes, cb) => {
  visitDetails = { patient, doctor, date, diagnosis, treatment, purchases, price, notes };
  const visit = new Visit(visitDetails);
  visit.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Visit: ' + visit);
    visits.push(visit);
    cb(null, visit);
  });
}

const insuranceCreate = (name, phone, address, email, cb) => {
  insuranceDetails = { name, phone, address, email };
  const insurance = new Insurance(insuranceDetails);
  insurance.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Insurance: ' + insurance);
    insurances.push(insurance);
    cb(null, insurance);
  });
}

const createDoctors = cb => {
  async.parallel([
    callback => doctorCreate(faker.name.firstName(), faker.name.lastName(), faker.phone.number('########'), faker.internet.email(), faker.address.streetAddress(), callback),
    callback => doctorCreate(faker.name.firstName(), faker.name.lastName(), faker.phone.number('########'), faker.internet.email(), faker.address.streetAddress(), callback),
    callback => doctorCreate(faker.name.firstName(), faker.name.lastName(), faker.phone.number('########'), faker.internet.email(), faker.address.streetAddress(), callback),
    callback => doctorCreate(faker.name.firstName(), faker.name.lastName(), faker.phone.number('########'), faker.internet.email(), faker.address.streetAddress(), callback),
    callback => doctorCreate(faker.name.firstName(), faker.name.lastName(), faker.phone.number('########'), faker.internet.email(), faker.address.streetAddress(), callback)
  ], cb);
}


const createProducts = cb => {
  async.parallel([
    callback => productCreate(faker.commerce.productName(), faker.commerce.productDescription(), faker.commerce.price(), callback),
    callback => productCreate(faker.commerce.productName(), faker.commerce.productDescription(), faker.commerce.price(), callback),
    callback => productCreate(faker.commerce.productName(), faker.commerce.productDescription(), faker.commerce.price(), callback),
    callback => productCreate(faker.commerce.productName(), faker.commerce.productDescription(), faker.commerce.price(), callback),
    callback => productCreate(faker.commerce.productName(), faker.commerce.productDescription(), faker.commerce.price(), callback)
  ], cb);
}

const createInsurances = cb => {
  async.parallel([
    callback => insuranceCreate(faker.company.companyName(), faker.phone.number('########'), faker.address.streetAddress(), faker.internet.email(), callback),
    callback => insuranceCreate(faker.company.companyName(), faker.phone.number('########'), faker.address.streetAddress(), faker.internet.email(), callback),
    callback => insuranceCreate(faker.company.companyName(), faker.phone.number('########'), faker.address.streetAddress(), faker.internet.email(), callback),
    callback => insuranceCreate(faker.company.companyName(), faker.phone.number('########'), faker.address.streetAddress(), faker.internet.email(), callback),
  ], cb);
}

const createPatients = cb => {
  async.parallel([
    callback => patientCreate(faker.name.findName(), faker.name.lastName(), faker.date.past(), faker.address.streetAddress(), faker.phone.number('########'), faker.lorem.paragraph(), insurances[0], callback),
    callback => patientCreate(faker.name.findName(), faker.name.lastName(), faker.date.past(), faker.address.streetAddress(), faker.phone.number('########'), faker.lorem.paragraph(), insurances[1], callback),
    callback => patientCreate(faker.name.findName(), faker.name.lastName(), faker.date.past(), faker.address.streetAddress(), faker.phone.number('########'), faker.lorem.paragraph(), insurances[4], callback),
    callback => patientCreate(faker.name.findName(), faker.name.lastName(), faker.date.past(), faker.address.streetAddress(), faker.phone.number('########'), faker.lorem.paragraph(), insurances[2], callback),
    callback => patientCreate(faker.name.findName(), faker.name.lastName(), faker.date.past(), faker.address.streetAddress(), faker.phone.number('########'), faker.lorem.paragraph(), insurances[3], callback),
  ], cb);
}

const createVisits = cb => {
  async.parallel([
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
    callback => visitCreate(patients[Math.floor(Math.random() * patients.length)], doctors[Math.floor(Math.random() * doctors.length)], faker.date.past(), faker.lorem.paragraph(), faker.lorem.sentence(), [products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)], products[Math.floor(Math.random() * products.length)]], faker.commerce.price(100, 599, 0), faker.lorem.sentence(), callback),
  ], cb);
}

async.series( 
  [createDoctors, createProducts, createInsurances, createPatients, createVisits],
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log('done');
    }
    mongoose.connection.close();
  }
);

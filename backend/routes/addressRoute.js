const router = require('express').Router();
let Address = require('../models/addressModel');
const generateRandomAddress = require('./faker/fakerAddress'); 
const mongoose = require('mongoose');

router.route('/generate-address').get((request, response) => {
  const address = generateRandomAddress(); 
  // console.log(address);
  response.json(address);
});

router.route('/get/:userID/:addressType').get((request, response) => {
  Address.find({ 
    userID: request.params.userID, 
    addressType: request.params.addressType 
  })
    .then(addresses => response.json(addresses))
    .catch(error => response.status(400).json(error));
});

router.route('/create/:userID/:addressType').post((request, response) => {
  const userID = request.params.userID;
  const addressType = request.params.addressType; 
  const modelRef = ((s) => s.charAt(0).toUpperCase() + s.slice(1))(addressType);

  const newAddress = new Address({
    ...request.body,
    userID: new mongoose.Types.ObjectId(userID),
    modelRef: modelRef  
  });  
  // console.log(newAddress);
  
  newAddress.save()
    .then(() => response.json('Address added!'))
    .catch(error => response.status(400).json(error));
});

router.route('/getone/:userID/:addressID').get((request, response) => {
  Address.findById(request.params.addressID)
    .then(address => response.json(address))
    .catch(error => response.status(400).json(error));
});

router.route('/update/:userID/:addressID').put((request, response) => {
  const updateData = {
    ...request.body,
  };
  // console.log(updateData);

  Address.findByIdAndUpdate(request.params.addressID,
    updateData, { new: true, runValidators: true })
      .then(address => response.json(address))
      .catch(error => response.status(400).json(error));
});

router.route('/delete/:userID/:addressID').delete((request, response) => {
  Address.findByIdAndDelete(request.params.addressID)
    .then(() => response.json(`Address ${request.params.addressID} deleted.`))
    .catch(error => response.status(400).json(error));
});

module.exports = router;
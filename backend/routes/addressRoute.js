const router = require('express').Router();
let Address = require('../models/addressModel');
const generateRandomAddress = require('./faker/fakerAddress'); 
const mongoose = require('mongoose');

router.route('/generate-address').get((request, response) => {
  const address = generateRandomAddress(); 
  // console.log(address);
  response.json(address);
});

router.route('/get/:refID/:addressType').get((request, response) => {
  Address.find({ 
    refID: request.params.refID, 
    addressType: request.params.addressType 
  })
    .then(addresses => response.json(addresses))
    .catch(error => response.status(400).json(error));
});

router.route('/create/:refID/:addressType').post((request, response) => {
  const refID = request.params.refID;
  const modelRef = request.params.addressType; 

  const newAddress = new Address({
    ...request.body,
    refID: new mongoose.Types.ObjectId(refID),
    modelRef: modelRef
  });  
  // console.log(newAddress);
  
  newAddress.save()
    .then(() => response.json('Address added!'))
    .catch(error => response.status(400).json(error));
});

router.route('/getone/:refID/:addressID').get((request, response) => {
  Address.findById(request.params.addressID)
    .then(address => response.json(address))
    .catch(error => response.status(400).json(error));
});

router.route('/update/:refID/:addressID').put((request, response) => {
  const updateData = {
    ...request.body,
  };
  // console.log(updateData);

  Address.findByIdAndUpdate(request.params.addressID,
    updateData, { new: true, runValidators: true })
      .then(address => response.json(address))
      .catch(error => response.status(400).json(error));
});

router.route('/delete/:refID/:addressID').delete((request, response) => {
  Address.findByIdAndDelete(request.params.addressID)
    .then(() => response.json(`Address ${request.params.addressID} deleted.`))
    .catch(error => response.status(400).json(error));
});

module.exports = router;
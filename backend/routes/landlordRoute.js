const router = require('express').Router();
let Landlord = require('../models/landlordModel');
let Address = require('../models/addressModel');
let Contract = require('../models/contractModel');
const generateRandomLandlord = require('./faker/fakerLandlord'); 

router.route('/generate-landlord').get((request, response) => {
  const landlord = generateRandomLandlord(); 
  // console.log(landlord);
  response.json(landlord);
});

router.route('/get').get((request, response) => {
  Landlord.find()
    .then(landlords => response.json(landlords))
    .catch(error => response.status(400).json(error));
});

router.route('/create').post((request, response) => {
  const newLandlord = new Landlord(request.body);  
  
  newLandlord.save()
    .then(() => response.json('Landlord added!'))
    .catch(error => response.status(400).json(error));
});

router.route('/get/:landlordID').get((request, response) => {
  Landlord.findById(request.params.landlordID)
    .then(landlord => response.json(landlord))
    .catch(error => response.status(400).json(error));
});

router.route('/update/:landlordID').put((request, response) => {
  const updateData = request.body;

  Landlord.findByIdAndUpdate(request.params.landlordID,
    updateData, { new: true, runValidators: true })
      .then(landlord => response.json(landlord))
      .catch(error => response.status(400).json(error));
});

router.route('/delete/:landlordID').delete((request, response) => {
  Landlord.findByIdAndDelete(request.params.landlordID) // delete Landlord
    .then(() => Address.deleteOne({ refID: request.params.landlordID })) // delete Landlord's Address
    .then(() => Contract.find({ landlordID: request.params.landlordID }).select('_id')) // Get All Landlord's Contract ID
    .then((contracts) => {
      const deletionPromises = contracts.map(contract =>
        Address.deleteOne({ refID: contract._id }) // Delete Contract's Address
          .then(() => 
            Contract.deleteOne({ _id: contract._id }) // Delete Landlord's Contract
          )
      );
      return Promise.all(deletionPromises);
    }) // Delete Landlord's Contract
    .then(() => response.json(`Landlord ${request.params.landlordID} deleted,
      and all related addresses and contracts deleted.`)) 
    .catch(error => response.status(400).json(error));
});

module.exports = router;
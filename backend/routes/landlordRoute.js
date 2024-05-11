const router = require('express').Router();
let Landlord = require('../models/landlordModel');
let Address = require('../models/addressModel');
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
  Landlord.findByIdAndDelete(request.params.landlordID)
    .then(() => Address.deleteMany({ userID: request.params.landlordID }))
    .then(() => response.json(`Landlord ${request.params.landlordID} and its Address deleted.`))
    .catch(error => response.status(400).json(error));
});

module.exports = router;
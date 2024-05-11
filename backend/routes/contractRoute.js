const router = require('express').Router();
let Contract = require('../models/contractModel');
let Address = require('../models/addressModel');
const generateRandomContract = require('./faker/fakerContract'); 

router.route('/generate-contract').get((request, response) => {
  const contract = generateRandomContract(); 
  // console.log(contract);
  response.json(contract);
});


router.route('/get').get((request, response) => {
  Contract.find()
    .populate('landlordID', 'firstName surName')  
    .populate({
      path: 'tenantBasket',
      select: 'firstName surName'  
    })
    .then(contracts => response.json(contracts))
    .catch(error => response.status(400).json(error));
});

router.route('/create').post((request, response) => {
  const newContract = new Contract(request.body);

  newContract.save()
    .then(() => response.json('Contract added!'))
    .catch(error => response.status(400).json(error));
});

router.route('/get/:contractID').get((request, response) => {
  Contract.findById(request.params.contractID)
    .populate('landlordID', 'firstName surName')  
    .populate({
      path: 'tenantBasket',
      select: 'firstName surName'  
    })
    .then(contract => response.json(contract))
    .catch(error => response.status(400).json(error));
});

router.route('/update/:contractID').put((request, response) => {
  Contract.findByIdAndUpdate(request.params.contractID,
    request.body, { new: true, runValidators: true })
      .then(contract => response.json(contract))
      .catch(error => response.status(400).json(error));
});

router.route('/delete/:contractID').delete((request, response) => {
  Contract.findByIdAndDelete(request.params.contractID)
    .then(() => Address.deleteMany({ refID: request.params.contractID }))
    .then(() => response.json(`Contract Property ${request.params.contractID} and its Address deleted.`))
    .catch(error => response.status(400).json(error));
});

module.exports = router;
const router = require('express').Router();
let Tenant = require('../models/tenantModel');
let Address = require('../models/addressModel');
const generateRandomTenant = require('./faker/fakerTenant'); 

router.route('/generate-tenant').get((request, response) => {
  const tenant = generateRandomTenant(); 
  console.log(tenant);
  response.json(tenant);
});

router.route('/get').get((request, response) => {
  Tenant.find()
    .then(tenants => response.json(tenants))
    .catch(error => response.status(400).json(error));
});

router.route('/create').post((request, response) => {
  const newTenant = new Tenant(request.body);  
  
  newTenant.save()
    .then(() => response.json('Tenant added!'))
    .catch(error => response.status(400).json(error));
});

router.route('/get/:tenantID').get((request, response) => {
  Tenant.findById(request.params.tenantID)
    .then(tenant => response.json(tenant))
    .catch(error => response.status(400).json(error));
});

router.route('/update/:tenantID').put((request, response) => {
  const updateData = request.body;

  Tenant.findByIdAndUpdate(request.params.tenantID,
    updateData, { new: true, runValidators: true })
      .then(tenant => response.json(tenant))
      .catch(error => response.status(400).json(error));
});

router.route('/delete/:tenantID').delete((request, response) => {
  Tenant.findByIdAndDelete(request.params.tenantID)
    .then(() => Address.deleteMany({ tenantID: request.params.tenantID }))
    .then(() => response.json(`Tenant ${request.params.tenantID} and its Address deleted.`))
    .catch(error => response.status(400).json(error));
});

module.exports = router;
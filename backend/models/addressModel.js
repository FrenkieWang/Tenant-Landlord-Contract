const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userID: { 
    type: Schema.Types.ObjectId, 
    refPath: 'modelRef', 
    required: true 
  },
  modelRef: {
    type: String,
    enum: ['Tenant', 'Landlord'],  
    required: true,
  },
  addressType: {
    type: String,
    enum: ['tenant', 'landlord'],
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String,
  },
  town: {
    type: String,
    required: true
  },
  countyCity: {
    type: String,
    required: true
  },
  eircode: {
    type: String,
  },
}, { collection: 'Address' });

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
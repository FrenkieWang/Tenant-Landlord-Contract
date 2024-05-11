const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contractSchema = new Schema({
    landlordID: { 
      type: Schema.Types.ObjectId, 
      ref: 'Landlord', 
      required: true 
    },
    tenantBasket: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Tenant',
      required: true,
    }],
    contractDate: {
      type: Date,
      required: true
    },
    monthlyFee: {
      type: Number,
      required: true
    },
    doorNumber: {
      type: String,
      required: true
    },
    contractLength: {
      type: String,
      required: true,
      enum: ['Month', 'Year', 'Permanent']
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Apartment', 'Semi-Detached', 'Detached', 'Other']
    },
    propertyTypeOther: {
      type: String
    }
  }, { collection: 'Contract' });

contractSchema.pre('validate', function(next) {
  if (!this.propertyTypeOther && this.propertyType === 'Other') {
    this.invalidate('propertyTypeOther', 'Property type must be specified if "Other" is selected');
  }
  if (!this.tenantBasket || this.tenantBasket.length < 1 || this.tenantBasket.length > 3) {
    this.invalidate('tenantBasket', 'Contract can only have 1 to 3 Tenants!');
  }
  next();
});

const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;
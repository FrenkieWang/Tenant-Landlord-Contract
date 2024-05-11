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
    }]
  }, { collection: 'Contract' });

contractSchema.pre('validate', function(next) {
  if (!this.tenantBasket || this.tenantBasket.length < 1 || this.tenantBasket.length > 3) {
    this.invalidate('tenantBasket', 'Contract can only have 1 to 3 Tenants!');
  }
  next();
});

const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;
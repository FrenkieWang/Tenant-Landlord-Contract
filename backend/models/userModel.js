const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  title: { 
    type: String, 
    enum: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other']
  },
  titleOther: {
    type: String
  },
  firstName: { 
    type: String,
  },
  surName: {  
    type: String,
    required: true  
  },
  mobile: {  
    type: String,
    required: true  
  },
  email: { 
    type: String,
    required: true  
  }
}, { collection: 'Tenant' });

tenantSchema.pre('validate', function(next) {
  if (this.title === 'Other' && !this.titleOther) {
    this.invalidate('titleOther', 'Title must be specified if "Other" is selected');
  }
  next();
});

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;
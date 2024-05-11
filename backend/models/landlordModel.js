const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landlordSchema = new Schema({
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
  phoneNumber: {  
    type: String,
    required: true  
  },
  email: { 
    type: String,
    required: true  
  },

  // Landlord - Additional Personal Details
  dateOfBirth: {
    type: Date,
    required: true
  },
  rentPermit: {
    type: String,
    enum: ['Y', 'N'],
    required: true
  },
  contactViaEmail: {
    type: String,
    enum: ['Y', 'N'],
    required: true
  }
}, { collection: 'Landlord' });

// Validate Data in Rest API
landlordSchema.pre('validate', function(next) {
  if (!this.titleOther && this.title === 'Other') {
    this.invalidate('titleOther', 'Title must be specified if "Other" is selected');
  }
  next();
});

const Landlord = mongoose.model('Landlord', landlordSchema);
module.exports = Landlord;
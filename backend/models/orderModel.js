const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    tenantID: { 
      type: Schema.Types.ObjectId, 
      ref: 'Tenant', 
      required: true 
    },
    phoneBasket: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Phone',
      required: true,
    }]
  }, { collection: 'Order' });

orderSchema.pre('validate', function(next) {
  if (!this.phoneBasket || this.phoneBasket.length < 1) {
    this.invalidate('phoneBasket', 'Tenant must purchase at least one Phone!');
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
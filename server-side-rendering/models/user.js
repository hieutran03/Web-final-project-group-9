const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  passHash: {
    type: String,
    required: true,
  },
  cart: [
    {
      products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  address: {
    type: String,
    required: true,
    default: 'Viet Nam'
  },


})
userSchema.pre('find', function() {
  this.populate('cart.products');
});
exports.User = mongoose.model('User', userSchema);
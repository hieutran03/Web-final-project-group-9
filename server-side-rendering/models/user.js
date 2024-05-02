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

  verified: {
    type: Boolean,
  },

  isAdmin: {
    type: Boolean,
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
},{
  toObject: { virtuals: true },
})

userSchema.pre('find', function() {
  this.populate('cart.products');
});
userSchema.virtual('cartTotal').get(function() {
  return this.cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
})
exports.User = mongoose.model('User', userSchema);
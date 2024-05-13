const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
    // required: true,
  },

  image: {
    type: String,
    default: ''
  },

  images: [{
    type: String
  }],

  brand: {
    type: String,
    default: '',
  },

  price: {
    type: Number,
    default: 0,
  },
  discountPercentage:{
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 9999,
  },
  position: {
    type: Number,
    default: 0,
  },
  
  deleted: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  status:{
    type: String,
    default: 'active',
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      childComments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          content: {
            type: String,
            required: true
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // rating: {
  //   type: Number,
  //   default: 0,
  //   min: 0,
  //   max: 5,
  // },
  // numReviews: {
  //   type: Number,
  //   default: 0,
  // },
},{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

productSchema.virtual('oldPrice').get(function(){
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.price)
});
productSchema.virtual('newPrice').get(function(){
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    this.price - (this.price * this.discountPercentage / 100)
  )
});
productSchema.virtual('finalPrice').get(function(){
  return this.price - (this.price * this.discountPercentage / 100);
});
exports.Product = mongoose.model('Product', productSchema);
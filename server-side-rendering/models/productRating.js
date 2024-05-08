const mongoose = require('mongoose');
const productRatingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  users: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true
    }
  }],
  analysisRating: {
    star5: {
      type: Number,
      default: 0
    },
    star4: {
      type: Number,
      default: 0
    },
    star3: {
      type: Number,
      default: 0
    },
    star2: {
      type: Number,
      default: 0
    },
    star1: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});
productRatingSchema.virtual('totalRating').get(function () {
  return this.analysisRating.star5 + this.analysisRating.star4 + this.analysisRating.star3 + this.analysisRating.star2 + this.analysisRating.star1;
});
const ProductRating = mongoose.model('ProductRating', productRatingSchema);
module.exports = { ProductRating };
const mongoose = require('mongoose');

const productViewedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewedProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }]
});


module.exports = mongoose.model('ProductViewed', productViewedSchema);;

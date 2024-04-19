const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
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

    rating: {
        type: Number,
        default: 0,
        min:0,
        max:5,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    dateCreated:{
        type: Date,
        default: Date.now,
    },
})

exports.Product = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    uniqueName: {
        type: String,
        slug: "name",
        unique: true,
    },
    // icon: {
    //     type: String,
    // },

    // color: {
    //     type: String,
    // }
})

exports.Category = mongoose.model('Category', categorySchema);
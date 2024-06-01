const mongoose = require('mongoose');

const searchKeysSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const SearchKeys = mongoose.model('SearchKeys', searchKeysSchema);
module.exports = SearchKeys;
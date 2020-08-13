const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const item = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  name: {
    type: String,
    default: '~anonymous~'
  },
  category: {
    type: String,
    enum: ['Electronics','Furnature','Clothing','Other'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
  contact: {
    required: true,
    type: String
  },
}, {
  timestamps: true,
});

const ItemEntry = mongoose.model('item', item);

module.exports = ItemEntry;
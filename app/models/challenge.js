// app/models/challenge.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var challengeSchema = mongoose.Schema({
  title: String,
  overview: String,
  description: String,
  slug: String,
  author_id: String,
  category: String,
  day_limit: Number,
  img0: String,
  views: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('challenge', challengeSchema);

// app/models/challenge.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var challengeSchema = mongoose.Schema({
  title: String,
  overview: String,
  description: String,
  type: String,
  slug: String,
  author_id: String,
  category: String,
  day_limit: Number,
  reward: String,
  rewards_number: Number,
  img0: String,
  files_resources: String,
  views: {
    type: Number,
    default: 0
  },
  is_public: {
    type: Boolean,
    default: true,
  },  
  is_active: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Date,
    default: Date()
  }
});

challengeSchema.index({'$**': 'text'});
-
module.exports = mongoose.model('challenge', challengeSchema);

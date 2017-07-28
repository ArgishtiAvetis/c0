const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema({
	//title: String,
	body: String,
	challenge_id: String,
	author_id: String,
	is_accepted: {
		type: String,
		default: 'Pending'
	},
	is_active: {
	    type: Boolean,
		default: true
	},
    published: {
        type: Date,
        default: Date()
	}
});

module.exports = mongoose.model('idea', ideaSchema);
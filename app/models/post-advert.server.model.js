'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Post advert Schema
 */
var PostAdvertSchema = new Schema({
	


	address: { 
		type: String,
		default: '',
		trim: true
	},

	description: { 
		type: String,
		default: '',
		trim: true
	},

	title: {
		type: String,
		default: '',
		trim: true
	},


	image: {
		type: String,
		required: 'Please fill Comment name',
		default: '',
		trim: true
	},

	price: {
		type: Number,
		default: '',
		trim: true
	},


	
	stock: {
		type: Number,
		default: '',
		trim: true
	},
	
	email: {
		type: String,
		default: '',
		trim: true
	},


	

	contact: {
		type: String,
		default: '',
		trim: true
	},

	location: {
		type: String,
		default: '',
		trim: true
	},

	
	created: {
		type: Date,
		default: Date.now
	},

	

	

	comments: [{ type: Schema.ObjectId, ref: 'Comment' }],

	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('PostAdvert', PostAdvertSchema);
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	body: {
		type: String,
		default: '',
		required: 'Please fill Comment name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},

	postAdvert: {
		type: Schema.ObjectId,
		ref: 'PostAdvert'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Comment', CommentSchema);
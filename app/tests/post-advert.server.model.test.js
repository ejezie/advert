'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PostAdvert = mongoose.model('PostAdvert');

/**
 * Globals
 */
var user, postAdvert;

/**
 * Unit tests
 */
describe('Post advert Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			postAdvert = new PostAdvert({
				name: 'Post advert Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return postAdvert.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			postAdvert.name = '';

			return postAdvert.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PostAdvert.remove().exec();
		User.remove().exec();

		done();
	});
});
'use strict';

(function() {
	// Post adverts Controller Spec
	describe('Post adverts Controller Tests', function() {
		// Initialize global variables
		var PostAdvertsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Post adverts controller.
			PostAdvertsController = $controller('PostAdvertsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Post advert object fetched from XHR', inject(function(PostAdverts) {
			// Create sample Post advert using the Post adverts service
			var samplePostAdvert = new PostAdverts({
				name: 'New Post advert'
			});

			// Create a sample Post adverts array that includes the new Post advert
			var samplePostAdverts = [samplePostAdvert];

			// Set GET response
			$httpBackend.expectGET('post-adverts').respond(samplePostAdverts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.postAdverts).toEqualData(samplePostAdverts);
		}));

		it('$scope.findOne() should create an array with one Post advert object fetched from XHR using a postAdvertId URL parameter', inject(function(PostAdverts) {
			// Define a sample Post advert object
			var samplePostAdvert = new PostAdverts({
				name: 'New Post advert'
			});

			// Set the URL parameter
			$stateParams.postAdvertId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/post-adverts\/([0-9a-fA-F]{24})$/).respond(samplePostAdvert);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.postAdvert).toEqualData(samplePostAdvert);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PostAdverts) {
			// Create a sample Post advert object
			var samplePostAdvertPostData = new PostAdverts({
				name: 'New Post advert'
			});

			// Create a sample Post advert response
			var samplePostAdvertResponse = new PostAdverts({
				_id: '525cf20451979dea2c000001',
				name: 'New Post advert'
			});

			// Fixture mock form input values
			scope.name = 'New Post advert';

			// Set POST response
			$httpBackend.expectPOST('post-adverts', samplePostAdvertPostData).respond(samplePostAdvertResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Post advert was created
			expect($location.path()).toBe('/post-adverts/' + samplePostAdvertResponse._id);
		}));

		it('$scope.update() should update a valid Post advert', inject(function(PostAdverts) {
			// Define a sample Post advert put data
			var samplePostAdvertPutData = new PostAdverts({
				_id: '525cf20451979dea2c000001',
				name: 'New Post advert'
			});

			// Mock Post advert in scope
			scope.postAdvert = samplePostAdvertPutData;

			// Set PUT response
			$httpBackend.expectPUT(/post-adverts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/post-adverts/' + samplePostAdvertPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid postAdvertId and remove the Post advert from the scope', inject(function(PostAdverts) {
			// Create new Post advert object
			var samplePostAdvert = new PostAdverts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Post adverts array and include the Post advert
			scope.postAdverts = [samplePostAdvert];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/post-adverts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePostAdvert);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.postAdverts.length).toBe(0);
		}));
	});
}());
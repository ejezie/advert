'use strict';

//Setting up route
angular.module('post-adverts').config(['$stateProvider',
	function($stateProvider) {
		// Post adverts state routing
		$stateProvider.
		state('listPostAdverts', {
			url: '/post-adverts',
			templateUrl: 'modules/post-adverts/views/list-post-adverts.client.view.html'
		}).
		state('createPostAdvert', {
			url: '/post-adverts/create',
			templateUrl: 'modules/post-adverts/views/create-post-advert.client.view.html'
		}).
		state('viewPostAdvert', {
			url: '/post-adverts/:postAdvertId',
			templateUrl: 'modules/post-adverts/views/view-post-advert.client.view.html'
		}).
		state('editPostAdvert', {
			url: '/post-adverts/:postAdvertId/edit',
			templateUrl: 'modules/post-adverts/views/edit-post-advert.client.view.html'
		});
	}
]);
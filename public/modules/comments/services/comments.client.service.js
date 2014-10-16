'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
	function($resource) {
		return $resource('post-adverts/:postAdvertId/comments/:commentId', 
			{ commentId: '@_id', postAdvertId:'@postAdvert'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
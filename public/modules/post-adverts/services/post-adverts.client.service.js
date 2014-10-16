'use strict';

//Post adverts service used to communicate Post adverts REST endpoints
angular.module('post-adverts').factory('PostAdverts', ['$resource',
	function($resource) {
		return $resource('post-adverts/:postAdvertId', { postAdvertId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('post-adverts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Post adverts', 'post-adverts', 'dropdown', '/post-adverts(/create)?');
		Menus.addSubMenuItem('topbar', 'post-adverts', 'List Post adverts', 'post-adverts');
		Menus.addSubMenuItem('topbar', 'post-adverts', 'New Post advert', 'post-adverts/create');
	}
]);
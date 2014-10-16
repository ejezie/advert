'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users');
    var postAdverts = require('../../app/controllers/post-adverts');
    // Post adverts Routes
    app.route('/post-adverts')
        .get(postAdverts.list)
        .post(users.requiresLogin, postAdverts.create);


    app.route('/post-adverts/:postAdvertId')
        .get(postAdverts.read)
        .put(users.requiresLogin, postAdverts.hasAuthorization, postAdverts.update)
        .delete(users.requiresLogin, postAdverts.hasAuthorization, postAdverts.delete);

    // Finish by binding the Post advert middleware
    app.param('postAdvertId', postAdverts.postAdvertByID);
};

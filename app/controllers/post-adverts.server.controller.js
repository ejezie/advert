'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    PostAdvert = mongoose.model('PostAdvert'),
    _ = require('lodash');

/**
 * Create a Post advert
 */
exports.create = function(req, res) {
    console.log(req.body);
    var postAdvert = new PostAdvert(req.body);
    console.log(postAdvert);

    postAdvert.user = req.user;

    postAdvert.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(postAdvert);
        }
    });
};

/**
 * Show the current Post advert
 */
exports.read = function(req, res) {
    res.jsonp(req.postAdvert);
};

/**
 * Update a Post advert
 */
exports.update = function(req, res) {
    var postAdvert = req.postAdvert;

    postAdvert = _.extend(postAdvert, req.body);

    postAdvert.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(postAdvert);
        }
    });
};

/**
 * Delete an Post advert
 */
exports.delete = function(req, res) {
    var postAdvert = req.postAdvert;

    postAdvert.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(postAdvert);
        }
    });
};




/**
 * List of Post adverts
 */
exports.list = function(req, res) {
    PostAdvert.find().sort('-created').populate('user', 'displayName').populate('comments', 'body').exec(function(err, postAdverts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(postAdverts);
        }
    });
};

/**
 * Post advert middleware
 */
exports.postAdvertByID = function(req, res, next, id) {
    PostAdvert.findById(id).populate('user', 'displayName').exec(function(err, postAdvert) {
        if (err) return next(err);
        if (!postAdvert) return next(new Error('Failed to load Post advert ' + id));
        req.postAdvert = postAdvert;
        next();
    });
};

/**
 * Post advert authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.postAdvert.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

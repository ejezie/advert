'use strict';

// Post adverts controller
angular.module('post-adverts').controller('PostAdvertsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PostAdverts', 'Comments', '$modal', '$log',
    function($scope, $stateParams, $location, Authentication, PostAdverts, Comments, $modal, $log) {
        $scope.authentication = Authentication;




        //Modal function for create page
        $scope.advertCreate = function(size, selectedAdvert) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/post-adverts/views/create-post-advert.client.view.html',
                controller: function($scope, $modalInstance, postAdvert) {
                    $scope.postAdvert = postAdvert;
                    $scope.ok = function() {
                        $modalInstance.close($scope.postAdvert);

                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    postAdvert: function() {
                        return selectedAdvert;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at:' + new Date());
            });
        };





        //Modal function for edit page
        $scope.advertUpdate = function(size, selectedAdvert) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/post-adverts/views/edit-post-advert.client.view.html',
                controller: function($scope, $modalInstance, postAdvert) {
                    $scope.postAdvert = postAdvert;
                    $scope.ok = function() {
                        $modalInstance.close($scope.postAdvert);

                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    postAdvert: function() {
                        return selectedAdvert;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at:' + new Date());
            });
        };




        //image upload function
        $scope.onSelectFile = function($files) {
            $scope.files = $files;
            $scope.img = $files[0];
            $scope.images = '';

            var reader = new FileReader();

            reader.onload = function(e) {
                $scope.images = e.target.result;
            };

            reader.readAsDataURL($scope.files[0]);
        };






        // Create new Post advert
        $scope.create = function() {
            // Create new Post advert object
            var postAdvert = new PostAdverts({
                address: this.address,
                title: this.title,
                description: this.description,
                stock: this.stock,
                price: this.price,
                contact: this.contact,
                email: this.email,
                location: this.location
            });
            postAdvert.image = $scope.images;




            // Redirect after save
            postAdvert.$save(function(response) {
                $scope.comments.push(response);

                // Clear form fields
                $scope.address = '';
                $scope.title = '';
                $scope.photo = '';
                $scope.description = '';
                $scope.stock = '';
                $scope.price = '';
                $scope.contact = '';
                $scope.email = '';
                $scope.location = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Post advert
        $scope.remove = function(postAdvert) {
            if (postAdvert) {
                postAdvert.$remove();

                for (var i in $scope.postAdverts) {
                    if ($scope.postAdverts[i] === postAdvert) {
                        $scope.postAdverts.splice(i, 1);
                    }
                }
            } else {
                $scope.postAdvert.$remove(function() {
                    $location.path('post-adverts');
                });
            }
        };


        //Creating new comment
        $scope.addComment = function() {
            var comment = new Comments({
                body: this.name
            });

            comment.$save({
                postAdvertId: $stateParams.postAdvertId
            }, function(response) {
                var postAdvertId = $stateParams.postAdvertId;
                $scope.comments.push(response);
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        //Filter comment
        $scope.findComments = function() {
            $scope.comments = Comments.query({
                postAdvertId: $stateParams.postAdvertId
            });
        };

        // Update existing Post advert
        $scope.update = function() {
            var postAdvert = $scope.postAdvert;

            postAdvert.$update(function() {
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Post adverts
        $scope.find = function() {
            $scope.postAdverts = PostAdverts.query();
        };

        // Find existing Post advert
        $scope.findOne = function() {
            $scope.postAdvert = PostAdverts.get({
                postAdvertId: $stateParams.postAdvertId
            });
        };
    }
]);

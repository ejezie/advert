'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'classified';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'angularFileUpload',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('comments');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('post-adverts');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
//Setting up route
angular.module('comments').config([
  '$stateProvider',
  function ($stateProvider) {
    // Comments state routing
    $stateProvider.state('listComments', {
      url: '/comments',
      templateUrl: 'modules/comments/views/list-comments.client.view.html'
    }).state('createComment', {
      url: '/comments/create',
      templateUrl: 'modules/comments/views/create-comment.client.view.html'
    }).state('viewComment', {
      url: '/comments/:commentId',
      templateUrl: 'modules/comments/views/view-comment.client.view.html'
    }).state('editComment', {
      url: '/comments/:commentId/edit',
      templateUrl: 'modules/comments/views/edit-comment.client.view.html'
    });
  }
]);'use strict';
// Comments controller
angular.module('comments').controller('CommentsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Comments',
  function ($scope, $stateParams, $location, Authentication, Comments) {
    $scope.authentication = Authentication;
    // Create new Comment
    $scope.create = function () {
      // Create new Comment object
      var comment = new Comments({ name: this.name });
      // Redirect after save
      comment.$save(function (response) {
        $location.path('comments/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Comment
    $scope.remove = function (comment) {
      if (comment) {
        comment.$remove();
        for (var i in $scope.comments) {
          if ($scope.comments[i] === comment) {
            $scope.comments.splice(i, 1);
          }
        }
      } else {
        $scope.comment.$remove(function () {
          $location.path('comments');
        });
      }
    };
    // Update existing Comment
    $scope.update = function () {
      var comment = $scope.comment;
      comment.$update(function () {
        $location.path('comments/' + comment._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Comments
    $scope.find = function () {
      $scope.comments = Comments.query();
    };
    // Find existing Comment
    $scope.findOne = function () {
      $scope.comment = Comments.get({ commentId: $stateParams.commentId });
    };
  }
]);'use strict';
//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', [
  '$resource',
  function ($resource) {
    return $resource('post-adverts/:postAdvertId/comments/:commentId', {
      commentId: '@_id',
      postAdvertId: '@postAdvert'
    }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('post-adverts').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Post adverts', 'post-adverts', 'dropdown', '/post-adverts(/create)?');
    Menus.addSubMenuItem('topbar', 'post-adverts', 'List Post adverts', 'post-adverts');
    Menus.addSubMenuItem('topbar', 'post-adverts', 'New Post advert', 'post-adverts/create');
  }
]);'use strict';
//Setting up route
angular.module('post-adverts').config([
  '$stateProvider',
  function ($stateProvider) {
    // Post adverts state routing
    $stateProvider.state('listPostAdverts', {
      url: '/post-adverts',
      templateUrl: 'modules/post-adverts/views/list-post-adverts.client.view.html'
    }).state('createPostAdvert', {
      url: '/post-adverts/create',
      templateUrl: 'modules/post-adverts/views/create-post-advert.client.view.html'
    }).state('viewPostAdvert', {
      url: '/post-adverts/:postAdvertId',
      templateUrl: 'modules/post-adverts/views/view-post-advert.client.view.html'
    }).state('editPostAdvert', {
      url: '/post-adverts/:postAdvertId/edit',
      templateUrl: 'modules/post-adverts/views/edit-post-advert.client.view.html'
    });
  }
]);'use strict';
// Post adverts controller
angular.module('post-adverts').controller('PostAdvertsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'PostAdverts',
  'Comments',
  '$modal',
  '$log',
  function ($scope, $stateParams, $location, Authentication, PostAdverts, Comments, $modal, $log) {
    $scope.authentication = Authentication;
    //Modal function for create page
    $scope.advertCreate = function (size, selectedAdvert) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/post-adverts/views/create-post-advert.client.view.html',
          controller: function ($scope, $modalInstance, postAdvert) {
            $scope.postAdvert = postAdvert;
            $scope.ok = function () {
              $modalInstance.close($scope.postAdvert);
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          },
          size: size,
          resolve: {
            postAdvert: function () {
              return selectedAdvert;
            }
          }
        });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at:' + new Date());
      });
    };
    //Modal function for edit page
    $scope.advertUpdate = function (size, selectedAdvert) {
      var modalInstance = $modal.open({
          templateUrl: 'modules/post-adverts/views/edit-post-advert.client.view.html',
          controller: function ($scope, $modalInstance, postAdvert) {
            $scope.postAdvert = postAdvert;
            $scope.ok = function () {
              $modalInstance.close($scope.postAdvert);
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          },
          size: size,
          resolve: {
            postAdvert: function () {
              return selectedAdvert;
            }
          }
        });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at:' + new Date());
      });
    };
    //image upload function
    $scope.onSelectFile = function ($files) {
      $scope.files = $files;
      $scope.img = $files[0];
      $scope.images = '';
      var reader = new FileReader();
      reader.onload = function (e) {
        $scope.images = e.target.result;
      };
      reader.readAsDataURL($scope.files[0]);
    };
    // Create new Post advert
    $scope.create = function () {
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
      postAdvert.$save(function (response) {
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
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Post advert
    $scope.remove = function (postAdvert) {
      if (postAdvert) {
        postAdvert.$remove();
        for (var i in $scope.postAdverts) {
          if ($scope.postAdverts[i] === postAdvert) {
            $scope.postAdverts.splice(i, 1);
          }
        }
      } else {
        $scope.postAdvert.$remove(function () {
          $location.path('post-adverts');
        });
      }
    };
    //Creating new comment
    $scope.addComment = function () {
      var comment = new Comments({ body: this.name });
      comment.$save({ postAdvertId: $stateParams.postAdvertId }, function (response) {
        var postAdvertId = $stateParams.postAdvertId;
        $scope.comments.push(response);
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    //Filter comment
    $scope.findComments = function () {
      $scope.comments = Comments.query({ postAdvertId: $stateParams.postAdvertId });
    };
    // Update existing Post advert
    $scope.update = function () {
      var postAdvert = $scope.postAdvert;
      postAdvert.$update(function () {
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Post adverts
    $scope.find = function () {
      $scope.postAdverts = PostAdverts.query();
    };
    // Find existing Post advert
    $scope.findOne = function () {
      $scope.postAdvert = PostAdverts.get({ postAdvertId: $stateParams.postAdvertId });
    };
  }
]);'use strict';
//Post adverts service used to communicate Post adverts REST endpoints
angular.module('post-adverts').factory('PostAdverts', [
  '$resource',
  function ($resource) {
    return $resource('post-adverts/:postAdvertId', { postAdvertId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);
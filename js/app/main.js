(function() {
  angular.module('galaxy', ['ngRoute', 'appControllers'])
    // interceptors for ajax call, check data is loading or has been successfully fetched
    .factory("interceptors", function() {
      return {
        'request': function(request) {
          if (request.beforeComplete) request.beforeComplete();
          return request;
        },
        'response': function(response) {
          if (response.config.complete) response.config.complete(response);
          return response;
        }
      };
    })
    
    .config(function ($httpProvider, $routeProvider) {
      $httpProvider.interceptors.push('interceptors');
      
      // Routing
      $routeProvider
        .when ("/home", {
          templateUrl: "templates/home.html",
          controller: 'homeController'
        })
        .when ("/planets", {
          templateUrl: "templates/planets.html",
          controller: 'planetsController'
        })
        .when ("/planet/:id", {
          templateUrl: "templates/planet.html",
          controller: 'planetController'
        })
        .when ("/aboutme", {
          templateUrl: "templates/aboutme.html",
          controller: 'aboutMeController'
        })
        .otherwise({
          redirectTo: '/home'
        });
    });
})();
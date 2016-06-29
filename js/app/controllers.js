(function() {
	angular.module('appControllers', ['appDirectives'])
		.factory("pagination", function() {
      // service definition
      var service = {};
   
      // service implementation
      var getPagination = function(totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1;   
        // default page size is 10
        pageSize = pageSize || 10;
        var totalPages = Math.ceil(totalItems / pageSize), startPage, endPage;
        if (totalPages <= 10) {
          // less than 10 total pages -> show all
          startPage = 1;
          endPage = totalPages;
        } else {
          // more than 10 total pages -> calculate start and end pages
          if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
          } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
          } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
          }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = startIndex + pageSize;
 
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
 
        // return object that required
        return {
          totalItems: totalItems,
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages
        };
      }

      service.getPagination = getPagination;   
      return service;
    })
	
		.controller('homeController', function ($scope) {
      $scope.page = "Home";
    })

    .controller('planetController', function ($scope, $routeParams, $http, $q, orderByFilter) {
      var galaxy = this,
          url = 'http://swapi.co/api/planets';

      // Loading
      $scope.opacity = 0;
      $scope.load = true;

      $http.get(url).success(function(data) {
        // 10 items per page
        var length = Math.ceil(data.count / 10),
            array_url = [];
        // get planets data
        galaxy.planets = [];

        for(var i = 1; i <= length; i++) {
          array_url.push($http.get(url + "?page=" + i));
        }

        $q.all(array_url).then(function(arrayOfResults) {
        	// data load success
          $scope.opacity = 1;
        	$scope.load = false;

          arrayOfResults.map(function(value, key) {
            value.data.results.map(function(value, key) {
              galaxy.planets.push(value);
            });
          });

          // sort the data
          $scope.sorted = orderByFilter(galaxy.planets, 'name', false);
          // get single page content equal to data.name for SEO friendly
          $scope.sorted.map(function(value, key) {
            if(value.name.toLowerCase() === $routeParams.id){
              $scope.planet = value;
            }
          });

          // dummy data for planet images
          $http.get('images/data_images.json').success(function(data) {
            galaxy.planets.map(function(value, key) {
          		value.images = data.images[key];
              value.likes = 0;
          	});
          });
        });
      });

      $scope.unknown = function(field) {
        return {unknown: field === 'unknown'}
      }
      $scope.unknown_number = function(field) {
        return {unknown_number: field === 'unknown'}
      }
    })

    .controller('planetsController', function($scope, $http, $q, pagination, orderByFilter, $filter) {
      var galaxy = this,
          url = 'http://swapi.co/api/planets';

      // for loading using "interceptors"
      // $http({
      //   method: 'GET',
      //   url: url,
      //   beforeComplete: function() {
      //     galaxy.opacity = 1;
      //     galaxy.load = true;
      //   },
      //   complete: function() {
      //     galaxy.opacity = 0;
      //     galaxy.load = false;            
      //   }
      // });

      // for ng-show || ng-hide loading not using "interceptors", because "$q.all"
      galaxy.opacity = 0;
      galaxy.load = true;

      $http.get(url).success(function(data) {
        // 10 items per page as in data api url
        var length = Math.ceil(data.count / 10),
            array_url = [];
        // get planets data
        galaxy.planets = [];

        for(var i = 1; i <= length; i++) {
          array_url.push($http.get(url + "?page=" + i));
        }

        $q.all(array_url).then(function(arrayOfResults) {
          // for ng-show || ng-hide loading
          galaxy.opacity = 1;
          galaxy.load = false;

          arrayOfResults.map(function(value, key) {
            value.data.results.map(function(value, key) {
              galaxy.planets.push(value);
            });
          });
          
          // sort data
          $scope.sorted = orderByFilter(galaxy.planets, 'name', false);
          // filter search with pagination
          $scope.$watch('search', function(val){
            $scope.result = $filter('filter')($scope.sorted, val);
            $scope.planets = $scope.result.slice(0);

            // dummy data for planet images
            $http.get('images/data_images.json').success(function(data) {
              galaxy.planets.map(function(value, key) {
            		value.images = data.images[key];
            	});
            });

            // pagination
  					galaxy.planetItems = $scope.planets; // data of items to be paged
            galaxy.pager = {};

            var setPage = function(page) {
              if (page < 1 || page > galaxy.pager.totalPages) return;
              // get pager object from service
              galaxy.pager = pagination.getPagination(galaxy.planetItems.length, page, 12);       
              // get current page of items
              galaxy.items = galaxy.planetItems.slice(galaxy.pager.startIndex, galaxy.pager.endIndex);
            }
            galaxy.setPage = setPage;

            var initController = function() {
              // initialize to page 1
              galaxy.setPage(1);
            }();
          });
        });
      });

      // scaling image
      $scope.picture_mouseaction = function(scale) {
        var style = { scale: scale };
        return style;
      }
    })

    .controller('aboutMeController', function ($scope) {
      $scope.page = "About Me";
    });
})();
(function() {
  angular.module('appDirectives', [])
    .directive('navheader', function(){
      return {
        restrict: 'E',
        templateUrl: 'templates/navheader.html',
        controller: function($scope){
          $scope.leftmenu = '100%';
          $scope.toogle = function(){
            $scope.leftmenu !== '0%' ? 
              $scope.leftmenu = '0%' : $scope.leftmenu = '100%'
          };
        }
      };
    });
})();
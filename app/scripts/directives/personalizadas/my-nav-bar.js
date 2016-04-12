app.directive('myNavBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/nav-bar.html',
    controller: ["$scope", "$location", "$cookies", "$rootScope", function($scope, $location, $cookies, $rootScope) {

        $scope.Logout = function(){
          $rootScope.userData = null;
          $cookies.remove('theCookie');
          $cookies.remove('cpUserData');
          $location.path("auth/login");
        }
    }]
  };
});
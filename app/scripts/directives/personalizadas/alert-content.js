//Contenedor de alertas
app.directive('alertContent', function() {

  return {
    restrict: 'E',
    templateUrl: 'vistas/alert-content.html',
    controller: ["$scope", "Noty", function($scope, Noty) {

        $scope.closeAlert = function(index){
          Noty.close(index);
        }
    }]

  };
});
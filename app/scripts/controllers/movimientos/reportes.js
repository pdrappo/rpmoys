app.controller("ReportesController",["$scope", "$http", "$routeParams", "$http",  function($scope, $http, $routeParams, $http) {

    var id = $routeParams.id;
    $scope.comisiones = 0;

    $http({
        method: 'GET',
        url: base_url_api + "/movimientos/reporte/" + id
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.reporte = result.reporte;

          for (var i =  0; i < result.reporte.length; i++) {
            angular.forEach(result.reporte[i].movimientos, function (item) {
              var v = parseFloat(item.importe);
              if(v < 0)
                $scope.comisiones += v;
            });
          };

          
        }

      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la transacción", "warning", 5000);
      });



    $scope.getComision = function(index){
      var reporte = $scope.reporte[index];
      var comisiones = 0;

      angular.forEach(reporte.movimientos, function (item) {
        var v = parseFloat(item.importe);
        if(v < 0)
          comisiones -= v;
      });
      //var resultado = comisiones.toFixed(2);
      //$scope.comisiones += parseFloat(resultado);

      return comisiones.toFixed(2);
    }

}]);
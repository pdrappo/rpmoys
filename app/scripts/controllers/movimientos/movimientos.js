app.controller("MovimientosController",["$scope", "$http",  function($scope, $http) {
	$scope.total = 0;


    $http({
        method: 'GET',
        url: base_url_api + "movimientos/"
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.movimientos = result.movimientos;
          $scope.transferidos = result.transferidos;
        }

      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la transacción", "warning", 5000);
      });


	$scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }

        var total = 0;
        angular.forEach($scope.movimientos, function (item) {
            item.Selected = $scope.selectedAll;
	        if($scope.selectedAll){
		        total += parseFloat(item.importe);
		        $scope.total = total.toFixed(2);
	        }else
	        	$scope.total = total;
        });

    };

    $scope.sumar = function (index) {
    	var item = $scope.movimientos[index];
    	var total = parseFloat($scope.total);

    	if(item.Selected)
           	total += parseFloat(item.importe);
        else
            total -= parseFloat(item.importe);

        $scope.total = total.toFixed(2);

    };

    $scope.transferir = function(){
    	var array = [];

    	angular.forEach($scope.movimientos, function (item) {
	        if(item.Selected)
	        	this.push({orden: item.orden_id});
        }, array);

        $http({
	        method: 'POST',
	        url: base_url_api + "movimientos/transferir/",
	        data: {ordenes: array, total: $scope.total}
	      }).then(function successCallback(response) {
	        var result = response.data;
	        if(result.status == "ok"){
              $scope.total = 0;
              $scope.selectedAll = false;
	          $scope.movimientos = result.movimientos;
              $scope.transferidos = result.transferidos;
	        }

	      }, function errorCallback(response) {
	          Noty.add("Ocurrió un error al intentar guardar la transacción", "warning", 5000);
	      });
    }
}]);
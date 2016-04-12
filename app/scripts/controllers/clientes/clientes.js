app.controller('ClientesController',['$scope', '$http', 'Noty', function($scope, $http, Noty) {
	
	$scope.ready = false;
	$scope.clientes = [];
	$scope.clientesTemp = []; //Mantengo en memorio todos los clientes

	
	$http.get(base_url_api + 'personas/listar/').then(function(response){
		$scope.clientes = response.data;
		$scope.clientesTemp = response.data;
		$scope.ready = true;
	});
	

}]);
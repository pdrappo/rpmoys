app.controller('OrdenesController',['$scope', '$http', 'Noty', function($scope, $http, Noty) {

	$scope.ordenes = null;
	$scope.alertaTxt = "Aguarde mientras busco si hay ordenes pendientes";
	$http.get(base_url_api + 'ordenes/pendientes/').then(function(response){
     	var json = response.data;
     	
     	if(json.ordenes.length > 0)
     		$scope.alertaTxt = null;
     	else
     		$scope.alertaTxt = "Bien hecho. No tiene ordenes pendientes!";

     	$scope.ordenes = json.ordenes;
	});

	$scope.returnOrdenAddress = function(id){
     	var orden = _.findWhere($scope.ordenes, {id: id});
     	var localidad = (orden.cuenta_provincia_id == "20") ? "CAPITAL FEDERAL" : orden.cuenta_localidad;
		var direccion = orden.cuenta_calle + " " + orden.cuenta_numero + ", (" + orden.cuenta_zipcode +") " + localidad;
		return direccion;
	};

}]);
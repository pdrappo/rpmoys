//Contenedor de alertas
app.directive('clienteSearchBar', function() {

  return {
    restrict: 'E',
    templateUrl: 'vistas/directivas/personalizadas/cliente-search-bar.html',
    controller: ["$scope", "Noty", "$http", "$q", function($scope, Noty, $http,$q) {
        $scope.buscando = false;
        $scope.alertaTxt = "No se realizó ninguna busqueda.";
    	var canceler;
    	$scope.SearchCambio = function(){
			var search = $scope.searchBox;
			$scope.clientes = [];

    		if (canceler)
    			canceler.resolve();
            canceler = $q.defer();

			if(search.length > 2){
                $scope.buscando = true;
				$http.post(base_url_api +'/personas/buscar', {'term': search}, {timeout: canceler.promise})
				.then(function(response){
                    if(response.data.length < 1)
                        $scope.alertaTxt = "No se encontraron resultados";
                    else{
                        $scope.clientes = response.data;
                        $scope.alertaTxt = null;
                    }
					
				}).finally(function(){
                    $scope.buscando = false;
                });

			}else{
				$scope.clientes = $scope.clientesTemp;
			}
    	};
    }]

  };
});
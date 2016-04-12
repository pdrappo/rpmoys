app.controller('EditarOrdenController', ['$scope', '$routeParams', '$http', 'Noty', '$cookies', '$location', function($scope, $routeParams, $http, Noty, $cookies, $location) {
     //alert("Estas en ordenes");
    var orden_id = $routeParams.id;
    var cpUserData = $cookies.getObject('cpUserData');
	$scope.ready = false;
	var usuario_ml = "";

	$scope.monedas = [{id:"1", text:"DOLARES"}, {id:"2", text:"PESOS"}];
	$scope.orden = {
		cuenta: 0,
		items: [],
		referencia: "",
		fp: null,
		boni: null,
		contacto: null,
		entrega: null,
		autor: cpUserData.id,
		usuario_ml: null,
		observaciones: ""
	}
	$scope.items = [];
	$scope.item = {cantidad: 1, descripcion: null, importe: null, moneda: null};
	$scope.item.moneda = $scope.monedas[0];

	$http.get(base_url_api + '/ordenes/ver/' + orden_id).then(function(response){
     	var json = response.data;
     	//console.log(json.dato_impositivo);
		$scope.formas_pago = json.formas_pago;
		$scope.datos_impositivos = json.datos_impositivos;
		$scope.transportes = json.transportes;
		$scope.bonificaciones = json.bonificaciones;
		$scope.persona = json.persona;
		$scope.tipos_documentos = json.tipos_documentos;
		$scope.orden = json.orden;

		/* Datos impositivos */
     	var di = _.findWhere($scope.datos_impositivos, {id: $scope.persona.dato_impositivo});
     	$scope.persona.dato_impositivo_text  = di.descripcion;

     	/* Tipo de documento */
     	var tipo_doc = _.findWhere($scope.tipos_documentos, {id: $scope.persona.doc_tipo});
     	$scope.persona.tipo_doc_text = tipo_doc.descripcion;

     	/* Forma de Pago */
     	var fp = _.findWhere($scope.formas_pago, {id: $scope.persona.forma_pago});
     	$scope.persona.forma_pago_text = fp.descripcion;

     	var boni = _.findWhere($scope.bonificaciones, {id: $scope.persona.bonificacion});
     	$scope.persona.bonificacion_text = boni.descripcion;
		//$scope.direccion.pais = $scope.paises[0];
		$scope.orden.fp 		= _.findWhere($scope.formas_pago, {id: $scope.orden.forma_pago});
		$scope.orden.boni 		= _.findWhere($scope.bonificaciones, {id: $scope.orden.bonificacion});

		var entrega = _.findWhere($scope.transportes, {id: $scope.orden.entrega});
		$scope.orden.entrega 	= entrega;

		if($scope.orden.usuario_ml != null)
			$scope.checked = true;

		usuario_ml = $scope.orden.usuario_ml;
		$scope.ready = true;
	});

	$scope.AgregarArticulo = function(){
		$scope.orden.items.push($scope.item);
		$scope.item = {cantidad: 1, descripcion: null, importe: null, moneda: $scope.monedas[0]};
		//Oculto el Modal
		$scope.showDialog = false;
	};

	$scope.QuitarArticulo = function(index){
		$scope.orden.items.splice(index, 1);
	};

	$scope.addItem = function(){
		$scope.showDialog = true;
	};

	$scope.$watch('checked', function(newValue, oldValue) {
		$scope.orden.usuario_ml = newValue ? usuario_ml : null;
	});

	$scope.SubmitForm = function(){
		console.log($scope.orden);
		/*
        var request = $http({
            method: "POST",
            url: base_url_api + "ordenes/guardar/",
            //transformRequest: transformRequestAsFormPost,
            data: $scope.orden
        });
        // Store the data-dump of the FORM scope.
        request.success(
            function(response) {
                angular.forEach(response, function(value, key) {
                	Noty.add(value.mensaje, value.tipo, 5000);
                	if(value.tipo == "success"){
                		$location.path("/clientes/ver/" + $scope.persona.id);
                	}
				});
                
            }
        );*/
	};
 }]);
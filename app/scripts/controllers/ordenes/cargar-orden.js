app.controller('CargarOrdenController',['$scope', '$routeParams', '$http', 'Noty', '$cookies', '$location', function($scope, $routeParams, $http, Noty, $cookies, $location) {

	var cuenta_id = $routeParams.cuenta;
	var cpUserData = $cookies.getObject('cpUserData');
	$scope.ready = false;
	$scope.persona = null;
	$scope.cuenta =  null;
	$scope.forma_pago = null;
	$scope.datos_impositivos = null;
	$scope.bonificaciones = null;
	$scope.tipos_documentos = null;
	$scope.transportes = null;
	$scope.monedas = [{id:"1", text:"DOLARES"}, {id:"2", text:"PESOS"}];
	$scope.orden = {
		cuenta: cuenta_id,
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

	$http.get(base_url_api + 'ordenes/formulario/' + cuenta_id).then(function(response){
     	var json = response.data;
     	//console.log(json.dato_impositivo);
     	$scope.cuenta = json.cuenta;
     	$scope.orden.observaciones = $scope.cuenta.observaciones;
		$scope.formas_pago = json.formas_pago;
		$scope.datos_impositivos = json.datos_impositivos;
		$scope.transportes = json.transportes;
		$scope.bonificaciones = json.bonificaciones;
		$scope.persona = json.persona;
		$scope.tipos_documentos = json.tipos_documentos;

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
		$scope.orden.fp 		= fp;
		$scope.orden.boni 		= boni;

		if($scope.cuenta.contactos.length > 0)
			$scope.orden.contacto 	= $scope.cuenta.contactos[0].valor;

		$scope.orden.entrega 	= $scope.cuenta.entrega[0];

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
	}

	$scope.SubmitForm = function(index){

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
        );
	};

 }]);
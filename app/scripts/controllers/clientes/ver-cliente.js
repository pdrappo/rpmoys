app.controller('VerClienteController',['$scope', '$http', '$routeParams', 'Noty', '$cookies', '$location', function($scope, $http, $routeParams, Noty, $cookies, $location) {

	var persona_id = $routeParams.id;
	$scope.cpUserData = $cookies.getObject('cpUserData');

	$scope.ready = false;
	$scope.persona = null;
	$scope.cuentas = [];
	$scope.ordenes = [];
	$scope.cCFirstOpen = false;
	$scope.showDialog = false;
	$scope.cuenta = {
		persona_id: persona_id,
		direccion: {
			calle: null,
			numero: null,
			piso: null,
			depto: null,
			localidad: null,
			zipcode: null,
			provincia: null,
			pais: null
		},
		contacto: [],
		entrega: null,
		observaciones: null
	};

	$scope.oneAtATime = true;
	$scope.status = {
		isFirstOpen: true,
	    isFirstDisabled: false
	};

	//Modal de agregar contacto
	$scope.addContactoModal = false;

	//Modal de agregar transporte
	$scope.addTransporteModal = false;

	$scope.contacto = {
		nombre: "",
		datos:[{propiedad: "5", valor: ""}]
	};


	$http.get(base_url_api + 'personas/ver/' + persona_id).then(function(response){
     	$scope.persona = response.data.persona;
     	$scope.cuentas = response.data.cuentas;
     	$scope.ordenes = response.data.ordenes;
     	$scope.formas_pago = response.data.formas_pago;
		$scope.datos_impositivos = response.data.datos_impositivos;
		$scope.bonificaciones = response.data.bonificaciones;
		$scope.tipos_documentos = response.data.tipos_documentos;
		$scope.paises = response.data.paises;
		$scope.transportes = response.data.transportes;
     	
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
     	$scope.ready = true;

     	//Autocomplete
	    $scope.noCache = true;
	    $scope.isDisabled = false;

	    $scope.searchTextChange = function(text){
	    	//console.log('Text changed to ' + text);
	    };

	    $scope.selectedItemChange = function(item){
	    	//console.log(item);
	    };

	    $scope.querySearch = function(query){
	    	var results = query ? $scope.createFilterFor(query) : $scope.transportes;
	    	return results;
	    };

	    /**
	     * Create filter function for a query string
	     */
	    $scope.createFilterFor = function(query) {
	    	var array = [];
	    	var lowercaseQuery = angular.lowercase(query);
	      	_.find($scope.transportes, function(item) {
	      		var trpNombre = angular.lowercase(item.nombre);
	      		if(trpNombre.indexOf(lowercaseQuery) > -1)
	      			array.push(item);
			});
			return array;
	  	};
	});

	$scope.returnOrdenAddress = function(id){
     	var cuenta = _.findWhere($scope.cuentas, {id: id});
     	var localidad = (cuenta.provincia_id == "20") ? "CAPITAL FEDERAL" : cuenta.localidad_nombre;
		var direccion = "(" + cuenta.zipcode +") " + localidad;
		return direccion;

	};


	$scope.PaisCambio = function(){
		var pais_id = $scope.cuenta.direccion.pais.id || false;
		if(pais_id){
			$scope.cuenta.direccion.zipcode = "";
			$http.get(base_url_api + 'geo/provincia-por-pais/' + pais_id).then(function(response){
		     	$scope.provincias = response.data;
			});
		}
		
	};

	$scope.ProvinciaCambio = function(){
		var provincia_id = $scope.cuenta.direccion.provincia.id;
		$http.get(base_url_api + 'geo/localidad-por-provincia/' + provincia_id).then(function(response){
	     	$scope.localidades = response.data;
		});
	};

	$scope.ZipCodeCambio = function(){
		var zipcode = $scope.cuenta.direccion.zipcode;
		var pais_id = $scope.cuenta.direccion.pais.id;
		$scope.cuenta.direccion.localidad = null;

		if(zipcode.length > 3){
			$http.get(base_url_api + 'geo/localidades-zipcode-completa/' + zipcode + '/' + pais_id).then(function(response){
		     	$scope.localidades = response.data.localidades;
		     	$scope.provincias = null;
			});
		}
	};

	$scope.LocalidadCambio = function(){
		$scope.cuenta.direccion.zipcode = $scope.cuenta.direccion.localidad.cp;
	};

	//Contacto
	$scope.showModalContacto = function(){
		$scope.addContactoModal = true;
	}

	$scope.addProperty = function(){
		$scope.contacto.datos.push({propiedad: "5", valor: ""});
	}

	//Transporte
	$scope.showModalTransporte = function(){
		$scope.addTransporteModal = true;
	}

	$scope.addTransporte = function(){

		$scope.addTransporteModal = false;

		$http({
		  method: 'POST',
		  url: base_url_api + "transportes/guardar",
		  data: $scope.transporte
		}).then(function successCallback(response) {
			var result = response.data;
			var alerta = result.alerta;

			if(result.status == "error")
            	Noty.add(alerta.mensaje, alerta.tipo, 5000);
                	
            	if(result.status == "ok"){
            		$scope.transportes = result.transportes;
            		var trp = _.findWhere($scope.transportes, {id: result.selected});
     				$scope.cuenta.entrega = trp;
            	}
		  }, function errorCallback(response) {
		  	Noty.add("Ocurrió un error al intentar guardar el transporte", "warning", 5000);
		  }).finally(function(){

		});
	}

	$scope.removeProperty = function(index) {
      $scope.contacto.datos.splice(index, 1);
    };

    $scope.addContacto = function() {
      $scope.cuenta.contacto.push($scope.contacto);
      $scope.addContactoModal = false;
      $scope.contacto = {nombre: "", datos:[{propiedad: "5", valor: ""}]};
    };

	$scope.AgregarCuentaModal = function(){
		$scope.ModalNuevaCuenta = true;
	}

	$scope.AgregarCuenta = function(){

    	if($scope.cuenta.direccion.localidad == null){
    		Noty.add("Debe Seleccionar una localidad", "danger", 8000);
    		return false;
    	};

    	$http({
		  method: 'POST',
		  url: base_url_api + "cuentas/agregar/" + persona_id,
		  data: $scope.cuenta
		}).then(function successCallback(response) {
			var result = response.data;
			var alerta = result.alerta;

			if(result.status == "error")
            	Noty.add(alerta.mensaje, alerta.tipo, 5000);
                	
            	if(result.status == "ok"){
            		$scope.cuentas = result.cuentas;
            		$scope.toggleOpen();
            	}

		  }, function errorCallback(response) {
		  	Noty.add("Ocurrió un error al intentar guardar el transporte", "warning", 5000);
		  }).finally(function(){

		});

    	
    };

    $scope.setOrdenDelete = function(orden_id, index){
    	$scope.deleteOrden = {orden: orden_id, index: index};
    	$scope.EliminarOrdenConfirmacion = true;
    }

    $scope.eliminarOrden = function(){
    	var orden_id = $scope.deleteOrden.orden;
    	var index = $scope.deleteOrden.index;
    	$http.get(base_url_api + 'ordenes/eliminar/' + $scope.cpUserData.access_token + '/' + orden_id).then(function(response){
	       var result = response.data;
	       $scope.EliminarOrdenConfirmacion = false;
	       if(result.status == "ok"){
	       	$scope.ordenes.splice(index, 1);
	       	Noty.add("La orden se eliminó exitosamente.", "success");
	       }
	            
	       });

	    $scope.deleteOrden = {};
          
     }

}]);
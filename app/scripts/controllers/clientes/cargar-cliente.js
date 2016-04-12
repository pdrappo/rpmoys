app.controller('CargarClienteController',['$scope', '$http', 'Noty', '$location', function($scope, $http, Noty, $location) {
	$scope.ready = false;
	$scope.tipo_docs = null;
	$scope.provincias = null;
	$scope.localidades = null;
	$scope.transportes = null;
	$scope.bonificaciones = null;
	$scope.isProcessing = false;

	//Modal de agregar contacto
	$scope.addContactoModal = false;

	//Modal de agregar transporte
	$scope.addTransporteModal = false;

	$scope.contacto = {
		nombre: "",
		datos:[{propiedad: "5", valor: ""}]
	};

	$scope.cliente = {
		tipo_doc: null,
		doc_num: null,
		nombre: "",
		fp: null,
		di: null,
		direccion: {
			calle: null,
			num: null,
			piso: null,
			depto: null,
			localidad: null,
			zipcode: null,
			provincia: null,
			pais: null
		},
		id_sistema: null,
		contacto: [],
		bonificacion: null,
		entrega: null,
		observaciones: null
	}

	$http.get(base_url_api + 'personas/formulario/').then(function(response){
     	
     	var json = response.data;
     	$scope.tipo_docs = json.tipos_documentos;
		$scope.formas_pago = json.formas_pago;
		$scope.datos_impositivos = json.datos_impositivos;
		$scope.paises = json.paises;
		$scope.transportes = json.transportes;
		$scope.bonificaciones = json.bonificaciones;
		
		$scope.ready = true;
		$scope.InitFormControls();


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

	$scope.InitFormControls = function(){
		$scope.cliente.tipo_doc = $scope.tipo_docs[0];
		$scope.cliente.entrega = $scope.transportes[0];
		$scope.cliente.di = $scope.datos_impositivos[0];
		$scope.cliente.fp = $scope.formas_pago[0];
		$scope.cliente.bonificacion = $scope.bonificaciones[0];
		
		var trp = getTransporte({id:"1"});
     	$scope.cliente.entrega = trp;
     	$scope.transporte_search = trp.nombre;
		
	}
	//Autocomplete de transportes
	$scope.TransporteCambio = function(){
		var str = $scope.transporte_search;
		$scope.search_result = _.where($scope.transportes, {nombre:str});
		//getTransporte({nombre: str});
	}

	function getTransporte(options){
		var trp = _.findWhere($scope.transportes, options);
		$scope.search_result=trp;
		return trp;
	}

	$scope.PaisCambio = function(){
		var pais_id = $scope.cliente.direccion.pais.id || false;
		if(pais_id){
			$scope.cliente.direccion.zipcode = "";
			$http.get(base_url_api + 'geo/provincia-por-pais/' + pais_id).then(function(response){
		     	$scope.provincias = response.data;
			});
		}
		
	}

	$scope.ProvinciaCambio = function(){
		var provincia_id = $scope.cliente.direccion.provincia.id;
		$http.get(base_url_api + 'geo/localidad-por-provincia/' + provincia_id).then(function(response){
	     	$scope.localidades = response.data;
		});
	}

	$scope.ZipCodeCambio = function(){
		var zipcode = $scope.cliente.direccion.zipcode;
		var pais_id = $scope.cliente.direccion.pais.id;
		$scope.cliente.direccion.localidad = null;

		if(zipcode.length > 3){
			$http.get(base_url_api + 'geo/localidades-zipcode-completa/' + zipcode + '/' + pais_id).then(function(response){
		     	$scope.localidades = response.data.localidades;
		     	$scope.provincias = null;
			});
		}
	}
	/*
	$scope.CuitCambio = function(){
		var cuit_ = $scope.cliente.doc_num;
		var tipo = $scope.cliente.tipo_doc.id;
		if(cuit != null && cuit.toString().length >= 8){
			$http.get(base_url_api + 'personas/check-doc/' + tipo + '/' + cuit).then(function(response){
		     	if(response.data.length > 0)
		     		Noty.add("Alerta! El cliente ya existe!", "danger", 8000);
			});
		}else{
			console.log(tipo + " : " + cuit.length);
		}
	}*/

	$scope.LocalidadCambio = function(){
		$scope.cliente.direccion.zipcode = $scope.cliente.direccion.localidad.cp;
	}

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
     				$scope.cliente.entrega = trp;
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
      $scope.cliente.contacto.push($scope.contacto);
      $scope.addContactoModal = false;
      $scope.contacto = {nombre: "", datos:[{propiedad: "5", valor: ""}]};
    };

    $scope.SubmitForm = function(){
    	$scope.isProcessing = true;

    	if($scope.cliente.direccion.localidad == null){
    		Noty.add("Debe Seleccionar una localidad", "danger", 8000);
    		return false;
    	}


    	$http({
		  method: 'POST',
		  url: base_url_api + "clientes/guardar/",
		  data: $scope.cliente
		}).then(function successCallback(response) {
			var result = response.data;
			var alerta = result.alerta;
            	Noty.add(alerta.mensaje, alerta.tipo, 5000);
                	
            	if(result.status == "ok"){
            		$location.path("/clientes/ver/" + result.persona);
            	}
		  }, function errorCallback(response) {

		  }).finally(function(){
		  	$scope.isProcessing = false;
		  });


		/*
        var request = $http({
            method: "POST",
            url: base_url_api + "clientes/guardar/",
            //transformRequest: transformRequestAsFormPost,
            data: $scope.cliente
        });

        // Store the data-dump of the FORM scope.
        request.success(
            function(response) {
            	
                var alerta = response.alerta;
            	Noty.add(alerta.mensaje, alerta.tipo, 5000);
                	
            	if(response.status == "ok"){
            		$location.path("/clientes/ver/" + response.persona);
            	}
            }
        );*/

    	
    }
    

 }]);


app.controller('VerOrdenesController', ['$scope', '$routeParams', '$http', '$cookies', 'Noty', '$location', '$uibModal', function($scope, $routeParams, $http, $cookies, Noty, $location, $uibModal) {
  var orden_id = $routeParams.id;
  $scope.oneAtATime = true;
	$scope.status = {
		isFirstOpen: true,
	    isFirstDisabled: false
	};

  $scope.cpUserData = $cookies.getObject('cpUserData');
	$scope.monedas = [{id:"1", text:"DOLARES"}, {id:"2", text:"PESOS"}];
  

  $scope.intervenciones = [];
  $scope.transacciones = [];
  $scope.intervencionText = null;

  $http.get(base_url_api + 'ordenes/ver/' + orden_id).then(function(response){
    $scope.persona = response.data.persona;
    $scope.cuenta = response.data.cuenta;
    $scope.orden = response.data.orden;
    $scope.formas_pago = response.data.formas_pago;
		$scope.datos_impositivos = response.data.datos_impositivos;
		$scope.bonificaciones = response.data.bonificaciones;
		$scope.tipos_documentos = response.data.tipos_documentos;
		$scope.paises = response.data.paises;
		$scope.transportes = response.data.transportes;
    $scope.intervenciones = response.data.intervenciones;
    $scope.transacciones = response.data.movimientos;
   
     	/* Datos impositivos */
     	var di = _.findWhere($scope.datos_impositivos, {id: $scope.persona.dato_impositivo});
     	$scope.persona.dato_impositivo_text  = di.descripcion;

     	/* Tipo de documento */
     	var tipo_doc = _.findWhere($scope.tipos_documentos, {id: $scope.persona.doc_tipo});
     	$scope.persona.tipo_doc_text = tipo_doc.descripcion;

     	/* Forma de Pago */
     	var fp = _.findWhere($scope.formas_pago, {id: $scope.orden.forma_pago});
     	$scope.orden.forma_pago_text = fp.descripcion;

     	var boni = _.findWhere($scope.bonificaciones, {id: $scope.orden.bonificacion});
     	$scope.orden.bonificacion_text = boni.descripcion;

     	/* Entrega */
     	var entrega = _.findWhere($scope.transportes, {id: $scope.orden.entrega});
     	$scope.orden.entrega_text = entrega.nombre;

     	$scope.ready = true;

	});

function filtrarIntervenciones(data){
  $scope.intervenciones = [];
  $scope.transacciones = [];
  angular.forEach(data, function(value, key) {
    if(value.importe == null)
      $scope.intervenciones.push(value);
    else
      $scope.transacciones.push(value);
  });
}

	$scope.returnMoneda = function(moneda){
		var moneda = _.findWhere($scope.monedas, {id: moneda});
		return moneda.text;
	}

  $scope.SetIntervencionModal = function(){
    $scope.IntervencionFormModal = true;
  }

  $scope.guardarIntervencion = function(){

      $scope.IntervencionFormModal = false;
      var myIntervencion = {
           detalle: $scope.intervencionText,
           usuario: $scope.cpUserData.id,
           orden: $scope.orden.id,
           finalizar: "0"
      }

      guardarIntervencion(myIntervencion);

  }

  $scope.finalizarOrden = function(){

      $scope.IntervencionFormModal = false;
      var myIntervencion = {
           detalle: "Orden Finalizada por: " + $scope.cpUserData.nombre,
           usuario: $scope.cpUserData.id,
           orden: $scope.orden.id,
           finalizar: "1"
      }

      $scope.orden.finalizado = "OrdenFinalizada";

      guardarIntervencion(myIntervencion);

  }

  function guardarIntervencion(myIntervencion){
    $http({
      method: 'POST',
      url: base_url_api + "ordenes/guardar-intervencion/",
      data: myIntervencion
    }).then(function successCallback(response) {
      var result = response.data;
      if(result.status == "ok"){
        $scope.intervenciones = result.intervenciones;
        $scope.intervencionText = null;
      }
    }, function errorCallback(response) {
        Noty.add("Ocurrió un error al intentar guardar la intervención", "warning", 5000);
    });
  }

 $scope.EliminarOrdenModal = function(){
      $scope.EliminarOrdenConfirmacion = true;
 }

 $scope.SetRemitoModal = function(){
  $scope.editDocFormModal = true;
 }

 $scope.eliminarOrden = function(){
      $scope.EliminarOrdenConfirmacion = false;
      $http.get(base_url_api + 'ordenes/eliminar/' + cpUserData.access_token + '/' + orden_id).then(function(response){
           var result = response.data;
           if(result.status == "ok"){
                Noty.add("La orden se eliminó exitosamente.", "success");
                $location.path("clientes/ver/" + $scope.persona.id);
           }
                
      });
 }

 $scope.editarDoc = function(){
    $http({
        method: 'POST',
        url: base_url_api + "ordenes/editar-documentacion/",
        data: {remito: $scope.orden.remito, factura: $scope.orden.factura, orden: orden_id}
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.editDocFormModal = false;
          Noty.add("La documentación se editó exitosamente", "success", 5000);
        }


      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la intervención", "warning", 5000);
      });
 }

 $scope.eliminarIntervencion = function(id){

  $http({
        method: 'POST',
        url: base_url_api + "ordenes/eliminar-intervencion/",
        data: {intervencion: id, orden: orden_id}
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.intervenciones = result.intervenciones;
        }


      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la intervención", "warning", 5000);
      });
 }

 $scope.SetTransacModal = function(){
  $scope.transacModal = true;
 }

 $scope.transaccionForm = function(){
  $scope.transacModal = false;


  $scope.IntervencionFormModal = false;
      var myIntervencion = {
           detalle: $scope.transaccion.referencia,
           usuario: $scope.cpUserData.id,
           orden:   $scope.orden.id,
           importe: $scope.transaccion.importe
      }

  $http({
        method: 'POST',
        url: base_url_api + "movimientos/guardar-transaccion/",
        data: myIntervencion
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.transacciones = result.movimientos;
          $scope.transaccion.importe = "";
          $scope.transaccion.referencia = "";
        }

      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la transacción", "warning", 5000);
      });

 }

 $scope.eliminarMovimiento = function(id){

  $http({
        method: 'POST',
        url: base_url_api + "movimiento/eliminar/",
        data: {intervencion: id, orden: orden_id}
      }).then(function successCallback(response) {
        var result = response.data;
        if(result.status == "ok"){
          $scope.transacciones = result.movimientos;
        }


      }, function errorCallback(response) {
          Noty.add("Ocurrió un error al intentar guardar la intervención", "warning", 5000);
      });
 }


 }]);


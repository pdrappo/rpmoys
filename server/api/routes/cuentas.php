<?php
if(!defined("PANDORA")) die("Acceso denegado");

$app->post("/cuentas/agregar/:id", function($id) use($db){
	$app = \Slim\Slim::getInstance();
	$response = array();

	$cuenta = new Cuenta($db);

	$body = $app->request->getBody();
	$post = json_decode($body);

	$cuenta->persona_id = $post->persona_id;
	//$cuenta->contacto	= $post->contacto; Ahora lo guardo en cuentas_data
	$cuenta->calle 		= $post->direccion->calle;
	$cuenta->numero 	= $post->direccion->numero;
	$cuenta->piso 		= $post->direccion->piso;
	$cuenta->depto 		= $post->direccion->depto;
	$cuenta->localidad 	= $post->direccion->localidad->id;
	$cuenta->observaciones = $post->observaciones;

	$cuenta_id = $cuenta->cargar();
	if($cuenta_id){
		if($cuenta->guardar_entrega($cuenta_id, $post->entrega->id)){

			foreach ($post->contacto as $contacto) {
				//print_r($contacto->nombre);
				$datos = array("propiedad" => "39", "valor" => $contacto->nombre, "parent_id" => null, "cuenta_id" => $cuenta_id);
				$parent_id = $cuenta->guardar_datos($datos);

				if($parent_id){
					foreach ($contacto->datos as $prop) {
						$datos_prop = array("propiedad" => $prop->propiedad, "valor" => $prop->valor, "parent_id" =>$parent_id, "cuenta_id" => $cuenta_id);
						$cuenta->guardar_datos($datos_prop);
					}
				}
				
			}
			$cuentas_all = $cuenta->seleccionar_por_persona($post->persona_id);
			$response = array("status" => "ok", "cuentas" => $cuentas_all,"alerta" => array("mensaje" => "El cliente se guardó exitosamente", "tipo" => "success", "timeout" => 5000));
		}
		else{
			$cuenta->eliminar($cuenta_id);
			$response = array("status" => "error", "alerta" => array("mensaje" => $db->get_error(), "tipo" => "danger"));
		}
	}else{
		$response = array("status" => "error", "alerta" => array("mensaje" => $db->get_error(), "tipo" => "danger"));
	}

	$app->response->setStatus(200);
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($response);
});
<?php
if(!defined("PANDORA")) die("Acceso denegado");

$app->options("/auth/login", function() use($db){
	$app = \Slim\Slim::getInstance();

	$response = array();

	$auth = new Auth($db);

	$body = $app->request->getBody();
	$post = json_decode($body);

	//Selecciono  un usuario con los valores del formulario
	$usuario = $auth->login($post->usuario, md5($post->pwd));
	if($usuario){

		if($usuario->access_token == null){
			$token = sha1($usuario->id.time().$usuario->username);
	        $refresh = sha1($usuario->id.(time() + 15223).$usuario->username);
	        $expira = time() + 14400; //Expira dentro de 4 horas

	        $data = array(
	            'usuario_id' => $usuario->id,
	            'access_token' => $token,
	            'refresh_token' => $refresh,
	            'expira' => $expira,
	            'creado' => date("Y-m-d H:i:s")
	        );
	        $token_query = $auth->put_session($data);
	        if($token_query){
	        	$token_data = $auth->get_session($token_query);
	        	$usuario->access_token = $token_data->access_token;
	        	$usuario->refresh_token = $token_data->refresh_token;
	        	$usuario->expira = $token_data->expira;
	        	$usuario->expira_date = date("Y-m-d H:i:s", $token_data->expira);
	        	$response = array("status" => "ok", "user" => $usuario);
	        }else{
	        	$response = array("status" => "error", "alerta" => array("mensaje" => $db->get_error(), "tipo" => "danger"), 'user' => array());
	        }
		}else{

	        $usuario->expira_date = date("Y-m-d H:i:s", $usuario->expira);
			$response = array("status" => "ok", "user" => $usuario);
		}
        
		
	}else{
		$response = array("status" => "error", "alerta" => array("mensaje" => "Compruebe los datos de acceso", "tipo" => "danger"), 'user' => array());
	}


	$app->response->setStatus(200);
	echo json_encode($response);
});

$app->post("/auth/check-access-token/", function() use($db){
	$app = \Slim\Slim::getInstance();
	$response = array();

	$auth = new Auth($db);

	$body = $app->request->getBody();
	$post = json_decode($body);

	$data = $auth->check_token($post->access_token);

	$app->response->setStatus(200);
	echo json_encode($data);
});
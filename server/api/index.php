<?php

//$meli = new Meli("203632486532173", "tvSa46xfjYYaW27GEjaj6D6wd5ZUytjy");

/* Instanciando la Libreria de ReadBean*/
//require LIBS.'rb.php';
//R::setup( 'mysql:host=localhost;dbname=ieasrl_produccion', 'ieasrl_pdrappo', 'Eva.4468' );
//R::setup( 'mysql:host=localhost;dbname=iea_produccion', 'root', 'pancho' );

define("PANDORA", true);
define("ROOT", dirname(__FILE__));
define("ROUTESPATH", ROOT.'/routes/');
define("MODELSPATH", ROOT.'/models/');
define("MIDDLEWAREPATH", ROOT.'/middleware/');
define("HELPERSPATH", ROOT.'/helpers/');

require '../vendor/Slim-2.6.2/Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

//Helpers
require HELPERSPATH.'Database.php';
$db = new MyDB("rpmobrasyservicios.com.ar", "rpmoys_master", "caRP1900", "rpmoys_sga");

//Rutas
require 'routes/auth.php';

//Modelos
require 'models/auth.php';


/* Autentificacion */
$authAdmin = function  ( $role = 'member') {

    return function () use ( $role ) {

    	$app = \Slim\Slim::getInstance();
    	$app->redirect('login');
    	/*
        $app = \Slim\Slim::getInstance();

        // Check for password in the cookie
        if($app->getEncryptedCookie('my_cookie',false) != 'YOUR_PASSWORD'){

            $app->redirect('/login');
        }*/
    };
};
$app->response->headers->set('Content-Type', 'application/json'); 
$app->response->headers->set('Access-Control-Allow-Headers', 'Content-Type'); 
$app->response->headers->set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
$app->response->headers->set('Access-Control-Allow-Origin','*');

$app->run();
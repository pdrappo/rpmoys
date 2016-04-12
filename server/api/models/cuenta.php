<?php

class Cuenta extends Log {

	var $id;
	var $persona_id;
	var $contactos;
	var $calle;
	var $numero;
	var $piso;
	var $depto;
	var $localidad;
	var $localidad_nombre;
	var $zipcode;
	var $observaciones;
	var $entrega;
	var $creado;

	public function __construct($db)
    {
    	parent::__construct($db);
    }

    public function seleccionar_por_persona($persona){
    	$cuentas = array();
    	$result = $this->db->result("SELECT id FROM cuentas WHERE persona_id = " . $persona);
    	foreach ($result as $key => $row) {
    		$cuenta = $this->seleccionar($row->id);
    		if($cuenta)
    			array_push($cuentas, $cuenta);
    	}

    	return $cuentas;

    }

    /* CRUD */
    public function seleccionar($id){
    	$cuenta = $this->db->row("
				SELECT
				cuentas.id,
				cuentas.persona_id,
				calle,
				numero,
				piso,
				depto,
				cuentas.observaciones,
				cuentas.localidad,
				localidades.nombre AS localidad_nombre,
				localidades.cp AS zipcode,
				provincias.id AS provincia_id,
				cuentas.creado

				FROM 
				cuentas 
				INNER JOIN localidades ON localidades.id = cuentas.localidad
				INNER JOIN provincias ON provincias.id = localidades.provincia_id
				WHERE cuentas.id = " . $id);


    	$this->id 					= $cuenta->id;
		$this->persona_id 			= $cuenta->persona_id;
		$this->calle 				= $cuenta->calle;
		$this->numero 				= $cuenta->numero;
		$this->piso 				= $cuenta->piso;
		$this->depto 				= $cuenta->depto;
		$this->localidad 			= $cuenta->localidad;
		$this->localidad_nombre 	= $cuenta->localidad_nombre;
		$this->zipcode 				= $cuenta->zipcode;
		$this->observaciones 		= $cuenta->observaciones ;
		$this->creado 				= $cuenta->creado;

		/* Selecciono todos los modos de entrega ordenados por el orden */
		$entrega = $this->db->result("
			SELECT 
			transportes.id,
			transportes.nombre,
			transportes.direccion,
			transportes.localidad,
			localidades.nombre AS localidad_nombre,
			localidades.cp AS zipcode,
			transportes.telefono
			FROM 
			transportes 
			INNER JOIN forma_entrega ON forma_entrega.transporte_id = transportes.id
			INNER JOIN localidades ON localidades.id = transportes.localidad
			WHERE
			forma_entrega.cuenta_id = ". $id . " ORDER BY forma_entrega.orden");
		$this->entrega = $entrega;
		$cuenta->entrega = $entrega;

		//Selecciono los contacto que tiene la cuenta.
		$contactos = $this->db->result("SELECT id, propiedad, valor FROM cuentas_data WHERE propiedad = 39 AND parent_id IS NULL AND cuenta_id = ".$id);
		$this->contactos = $contactos;
		$cuenta->contactos = $contactos;

		return $cuenta;
    }

    public function cargar(){

    	$cuenta = array(
		'persona_id' 				=> $this->persona_id,
		'calle' 					=> $this->calle,
		'numero' 					=> $this->numero,
		'piso' 						=> $this->piso,
		'depto' 					=> $this->depto,
		'localidad' 				=> $this->localidad,
		'observaciones' 			=> $this->observaciones,
		'creado' => date("Y-m-d H:i:s")
		);

		$id = $this->db->insert('cuentas', $cuenta);
    	return $id;

    }

    public function guardar_entrega($cuenta, $transporte, $orden = null){
    	$ord = $orden == null ? 1 : $orden;
    	$data = array(
    		'cuenta_id' 	=> $cuenta,
    		'transporte_id' => $transporte,
    		'orden'			=> $ord
    		);
    	$id = $this->db->insert('forma_entrega', $data);
    	return $id;
    }



    public function guardar_datos($data){

		$id = $this->db->insert('cuentas_data', $data);
    	return $id;

    }

    public function actualizar(){

    	$cuenta = array(
		'persona_id' 				=> $this->persona_id,
		'calle' 					=> $this->calle,
		'numero' 					=> $this->numero,
		'piso' 						=> $this->piso,
		'depto' 					=> $this->depto,
		'localidad' 				=> $this->localidad,
		'creado' => date("Y-m-d H:i:s")
		);

		$id = $db->update('cuentas', $this->persona_id, $cuenta);
    	return $id;
    	
    }

    public function eliminar($id){
    	$db->delete("forma_entrega", "cuenta_id = " . $id);
    	return $db->delete("cuentas", "id = " . $id);
    }

}
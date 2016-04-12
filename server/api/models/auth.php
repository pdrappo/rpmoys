<?php

class Auth {
	protected $db;

	public function __construct($db)
    {
    	$this->db = $db;
    }

    public function login($usuario, $password){
    	return $this->db->row("SELECT usuarios.id, nombre, username, access_token, refresh_token, expira FROM usuarios LEFT JOIN sesiones ON sesiones.usuario_id = usuarios.id WHERE username = '".$usuario."' AND password = '".$password."'");
    }

    public function get_session($id){
    	$session = $this->db->row("SELECT access_token, refresh_token, expira FROM sesiones WHERE id = ".$id);
    	return $session;
    }

    public function put_session($data){
    	$id = $this->db->insert('sesiones', $data);
    	return $id;
    }

    public function check_token($token){
        $session = $this->db->row("
            SELECT 
            usuarios.id, 
            nombre, 
            username,
            access_token
            FROM usuarios 
            INNER JOIN sesiones ON sesiones.usuario_id = usuarios.id 
            WHERE access_token = '".$token."'");
        return $session;
    }
}
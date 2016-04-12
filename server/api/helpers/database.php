<?php

class MyDb{

    protected $conn;
    protected $last_query;
    protected $error;

	public function __construct($dbhost, $dbuser, $dbpass, $dbname)
    {
        try {

            $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
            $this->conn = new PDO($mysql_conn_string, $dbuser, $dbpass); 
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
     
        } catch(PDOException $e) {
            echo 'ERROR: ' . $e->getMessage();
        }

    }

    public function last_query(){

        return $this->last_query;
        
    }

    public function query($str){
        try {

            $this->last_query = $str;
            $sth = $this->conn->prepare($str);
            return $sth->execute();
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }
    }

    public function row($str){

        try {
            $this->last_query = $str;
            $sth = $this->conn->prepare($str);
            //$sth->bindParam(':id', $id, PDO::PARAM_INT);
            //$connection->lastInsertId();
            $sth->execute();
            return $sth->fetchObject();
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }

    }

    public function result($str){

        try {

            $this->last_query = $str;
            $sth = $this->conn->prepare($str);
            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_CLASS);
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }

    	
    }

    public function last_id(){

        try {

            $this->last_query = $str;
            $sth = $this->conn->prepare($str);
            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_CLASS);
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }

    }

    public function insert($table, $array) {

        try {

            $fields = array_keys($array);
            $values = array_values($array);
            $fieldlist = implode(',', $fields); 
            $qs = str_repeat("?,",count($fields)-1);

            $sql = "INSERT INTO `".$table."` (".$fieldlist.") VALUES (${qs}?)";
            $this->last_query = $sql;

            $sth = $this->conn->prepare($sql);
            $sth->execute($values);
            return $this->conn->lastInsertId();
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        } 
	}

  	public function update($table, $where, $array) {

        try {

            $fields = array_keys($array);
            $values = array_values($array);
            $fieldlist = implode(',', $fields); 
            $qs = str_repeat("?,",count($fields)-1);
            $firstfield = true;

            $sql = "UPDATE `".$table."` SET";
            for ($i = 0; $i < count($fields); $i++) {
                if(!$firstfield) {
                $sql .= ", ";   
                }
                $sql .= " ".$fields[$i]."=?";
                $firstfield = false;
            }
            //$sql .= " WHERE `id` =?";
            $sql .= " ".$where;
            $sth = $this->conn->prepare($sql);
            //$values[] = $id;

            $this->last_query = $sql;
            return $sth->execute($values);
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }

	}

    public function delete($table, $where = null){

        try {

            if($where == null)
            {
                $delete = 'DELETE '.$table; 
            }
            else
            {
                $delete = 'DELETE FROM '.$table.' WHERE '.$where; 
            }

            $this->last_query = $delete;
            $sth = $this->conn->prepare($delete);
            $del = $sth->execute();
 
            if($del)
            {
                return true; 
            }
            else
            {
               return false; 
            }
     
        } catch(PDOException $e) {
            $this->error =  $e;
            return false;
        }

        
    }

    public function get_error(){
        return $this->error->getMessage();
    }

    
}
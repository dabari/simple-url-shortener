<?php
require_once("SimpleRest.php");

class UserRestHandler extends SimpleRest {

    public function add() {	
        $jsonPayload = $this->getJsonPayload();
        
		if(!empty($jsonPayload) && (isset($jsonPayload->username) && isset($jsonPayload->password))){    
            $htpasswd = $this->getHtpasswd();
            if($htpasswd->addUser($jsonPayload->username, $jsonPayload->password)){
                $this ->encodeResponse(new stdclass(), 200);    
            }else {    
                $this ->encodeResponse(array('error' => 'User ' . $jsonPayload->username . ' already exists!'), 302);    
            }
		}else {
			$this ->encodeResponse(array('error' => 'User data not valid!'), 400);	
		}
	}

}

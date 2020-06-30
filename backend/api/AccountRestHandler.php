<?php
require_once("SimpleRest.php");

class AccountRestHandler extends SimpleRest {

    public function authenticate(){
		$jsonPayload = $this->getJsonPayload();

		if(!empty($jsonPayload)){
			if(isset($jsonPayload->username) && isset($jsonPayload->password)) {
				$htpasswdHandler = $this->getHtpasswd();
				if ($htpasswdHandler->userValid($jsonPayload->username, $jsonPayload->password)){
					return true;
				}
			}
		}
		$this ->encodeResponse(array('error' => 'Unauthorized access'), 401);	
		return false;
    }
    
    public function checkPermission(){
		if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])){
			$username = $_SERVER['PHP_AUTH_USER'];
			$password = $_SERVER['PHP_AUTH_PW'];
			$htpasswdHandler = $this->getHtpasswd();
            if ($htpasswdHandler->userValid($username, $password)){
                return true;
            }
		}
		$this ->encodeResponse(array('error' => 'Unauthorized access'), 401);	
		return false;
	}

}

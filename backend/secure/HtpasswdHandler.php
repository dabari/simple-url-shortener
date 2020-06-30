<?php
require_once("Htpasswd.php");

class HtpasswdHandler extends Htpasswd
{

    function __construct()
    {
        parent::__construct(__DIR__ . "/.htpasswd");
    }

    public function addUser($username, $password, $encType = self::ENCTYPE_APR_MD5)
    {
        return parent::addUser($username, $password, $encType);
    }


    public function updateUser($username, $password, $encType = self::ENCTYPE_APR_MD5)
    {
        return parent::updateUser($username, $password, $encType);
    }

    public function userValid($username, $password)
    {
        if ($this->userExists($username)) {
            $users = $this->getUsers();
            $savedPassword = $users[$username];
            return $this->matches($password, $savedPassword);
        }
        return false;
    }


    private function matches($password, $filePasswd)
    {
        if (strpos($filePasswd, '$apr1') === 0) {
            // MD5
            $passParts = explode('$', $filePasswd);
            $salt = $passParts[2];
            $hashed = $this->_cryptApr1Md5($password, $salt);
            return $hashed == $filePasswd;
        } elseif (strpos($filePasswd, '{SHA}') === 0) {
            // SHA1
            $hashed = "{SHA}" . base64_encode(sha1($password, TRUE));
            return $hashed == $filePasswd;
        } elseif (strpos($filePasswd, '$2y$') === 0) {
            // Bcrypt
            return password_verify($password, $filePasswd);
        } else {
            // Crypt
            $salt = substr($filePasswd, 0, 2);
            $hashed = crypt($password, $salt);
            return $hashed == $filePasswd;
        }
        return false;
    }
}

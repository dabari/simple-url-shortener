<?php
require_once("SimpleRest.php");

class ErrorRestHandler extends SimpleRest
{

    public function pathNotFound($path)
    {
        $this->encodeResponse(array('error' => 'The requested path "' . $path . '" was not found!'), 404);
    }

    public function methodNotNotFound($path, $method)
    {
        $this->encodeResponse(array('error' => 'The requested path "' . $path . '" exists. But the request method "' . $method . '" is not allowed on this path!'), 405);
    }
}

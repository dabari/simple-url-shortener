<?php

require_once("Route.php");
require_once("ErrorRestHandler.php");
require_once("AccountRestHandler.php");
require_once("UserRestHandler.php");
require_once("LinkMappingRestHandler.php");

// Use this namespace
use Steampixel\Route;

if (!isset($_GET["path"])) {
	die("<h2>Access Denied!</h2> This file is protected and not available to public.");
}

/*
	A very simple authentication is implemented here.
	The client asks under these endpoints whether the credentials it sends are correct. 
	If so, the client with must send these credentials as "basic authentication" header each time the API below is called.
*/
// check for authentification
Route::add('/authenticate', function () {
	$accountRestHandler = new AccountRestHandler();
	$accountRestHandler->authenticate();
}, ['POST']);

// get all mappings
Route::add('/mapping', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$linkMappingRestHandler = new LinkMappingRestHandler();
		$linkMappingRestHandler->getAll();
	}
}, 'GET');

// add new mapping
Route::add('/mapping', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$linkMappingRestHandler = new LinkMappingRestHandler();
		$linkMappingRestHandler->add();
	}
}, 'POST');

// update mapping
Route::add('/mapping', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$linkMappingRestHandler = new LinkMappingRestHandler();
		$linkMappingRestHandler->update();
	}
}, 'PUT');

// delete mapping
Route::add('/mapping', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$linkMappingRestHandler = new LinkMappingRestHandler();
		$linkMappingRestHandler->delete($_GET["id"]);
	}
}, 'DELETE');

// add multiple mappings
Route::add('/mapping-all', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$linkMappingRestHandler = new LinkMappingRestHandler();
		$linkMappingRestHandler->addAll();
	}
}, 'POST');

// add new user 
Route::add('/user', function () {
	$accountRestHandler = new AccountRestHandler();
	if ($accountRestHandler->checkPermission()) {
		$userRestHandler = new UserRestHandler();
		$userRestHandler->add();
	}
}, 'POST');

// 404 route not found 
Route::pathNotFound(function ($path) {
	$errorRestHandler = new ErrorRestHandler();
	$errorRestHandler->pathNotFound($path);
});

// 405 method not allowed for route  
Route::methodNotAllowed(function ($path, $method) {
	if ($method != 'OPTIONS') {
		$errorRestHandler = new ErrorRestHandler();
		$errorRestHandler->methodNotNotFound($path, $method);
	}
});

// set CORS-origin policy for development at localhost (angular-server)
// please comment\delete this line in the production !!!
header("Access-Control-Allow-Origin: http://localhost:4200");

// Run the Router
Route::run();

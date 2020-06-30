<?php

// mapping file
define("MAPPING_FILE", __DIR__ . "/data/mapping.json");

/* A simple service class for persistence handling */
class PersistenceService {

	public function getAllData(){
		$arr = json_decode(file_get_contents(MAPPING_FILE), true);
		return $arr;
	}
	
	public function saveToFile($arr){
		file_put_contents(MAPPING_FILE, json_encode($arr));
	}
	
	public function getData($id){
		if(!empty($id)){
			$arr = $this->getAllData();
			if (array_key_exists($id, $arr)) {
				return $arr[$id];
			}
		}
	}	
}

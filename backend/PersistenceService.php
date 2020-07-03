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

	public function getById($mappingData, $id){
		return $this->find($mappingData, "id", $id);
	}

	public function updateIds($mappingData){
		$id = 0;
		foreach($mappingData as $arr)
		{
			$arr->id = ++$id;
		}
	}

	/**
	 * Gets the next id from mapping data
	 */
	public function getNextId($mappingData){
		$keyToSearch = "id";
		$currentMax = NULL;
		foreach($mappingData as $arr)
		{		
			foreach($arr as $key => $value)
			{
				if ($key == $keyToSearch && ($value >= $currentMax))
				{
					$currentMax = $value;
				}
			}
		}
		return $currentMax + 1;
	}

	public function existsShortLink($mappingData, $searchValue){
		$found = $this->find($mappingData, "shortLink", $searchValue);
		return !empty($found);
	}

	private function find($data, $searchField, $searchValue){
		$found = array_filter($data, function($v,$k) use ($searchField, $searchValue) {
			return $v[$searchField] == $searchValue;  
		}, ARRAY_FILTER_USE_BOTH);
		return $found;
	}

}

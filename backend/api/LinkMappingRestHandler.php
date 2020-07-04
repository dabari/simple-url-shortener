<?php
require_once("SimpleRest.php");
require_once("../PersistenceService.php");

class LinkMappingRestHandler extends SimpleRest
{
	public function getAll()
	{
		$persistenceService = new PersistenceService();
		$rawData = $persistenceService->getAllData();
		$this->encodeResponse($rawData, 200);
	}

	public function add()
	{
		$persistenceService = new PersistenceService();

		$jsonPayload = $this->getJsonPayload();

		if (!empty($jsonPayload)) {
			if (isset($jsonPayload->shortLink) && isset($jsonPayload->targetUrl)) {
				$existingData = $persistenceService->getAllData();
				if ($persistenceService->existsShortLink($existingData, $jsonPayload->shortLink)) {
					$this->encodeResponse(array('error' => 'Link ' . $jsonPayload->shortLink . ' already exists!'), 302);
				} else {
					$jsonPayload->id = $persistenceService->getNextId($existingData);
					array_push($existingData, $jsonPayload);
					$persistenceService->saveToFile($existingData);
					$this->encodeResponse($persistenceService->getAllData(), 200);
				}
			}
		} else {
			$this->encodeResponse(array('error' => 'Data not valid!'), 204);
		}
	}

	public function update()
	{
		$persistenceService = new PersistenceService();

		$jsonPayload = $this->getJsonPayload();

		if (!empty($jsonPayload)) {
			if (isset($jsonPayload->id) && isset($jsonPayload->shortLink) && isset($jsonPayload->targetUrl)) {
				$existingData = $persistenceService->getAllData();
				foreach($existingData as $key => $item)
				{
					if ($item["id"] == $jsonPayload->id) {
						$existingData[$key]["shortLink"] = $jsonPayload->shortLink;
						$existingData[$key]["targetUrl"] = $jsonPayload->targetUrl;
						$persistenceService->saveToFile($existingData);
						$this->encodeResponse($persistenceService->getAllData(), 200);
						return;
					}
				}
				$this->encodeResponse(array('error' => 'Id ' . $jsonPayload->id . ' not found!'), 404);		
			}
		} else {
			$this->encodeResponse(array('error' => 'Data not valid!'), 204);
		}
	}

	public function addAll()
	{
		$persistenceService = new PersistenceService();
		$jsonPayload = $this->getJsonPayload();
		if (!empty($jsonPayload)) {
			$this->checkPayloadData($jsonPayload);
			$persistenceService->updateIds($jsonPayload);
			$persistenceService->saveToFile($jsonPayload);
		} else {
			$this->encodeResponse(array('error' => 'JSON data not exists'), 400);
		}
	}

	private function checkPayloadData($mappingData){
		$shortLinks = array();
		foreach($mappingData as $arr)
		{
			if (isset($arr->shortLink) && isset($arr->targetUrl) ) {
				array_push($shortLinks, $arr->shortLink);
			}else {
				
			}
		}
		if (count($mappingData) != count(array_unique($shortLinks))) {
			$this->encodeResponse(array('error' => 'Multiple identical shortlinks found!'), 400);
		}
	}

	public function delete($id)
	{
		$persistenceService = new PersistenceService();
		if (isset($id)) {
			$existingData = $persistenceService->getAllData();
			$found = $persistenceService->getById($existingData, $id);
			if (!empty($found)) {
				$key = key($found);
				array_splice($existingData, $key, 1);
				$persistenceService->saveToFile($existingData);
				$this->encodeResponse($persistenceService->getAllData(), 200);
			} else {
				$this->encodeResponse(array('error' => 'Link with ' . $id . ' not found!'), 404);
			}
		} else {
			$this->encodeResponse(array('error' => 'Data not valid!'), 204);
		}
	}
}

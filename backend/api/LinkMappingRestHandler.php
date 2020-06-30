<?php
require_once("SimpleRest.php");
require_once("../PersistenceService.php");

class LinkMappingRestHandler extends SimpleRest
{
	public function getAll()
	{
		$persistenceService = new PersistenceService();
		$rawData = $persistenceService->getAllData();

		$statusCode = 200;
		if (empty($rawData)) {
			$rawData = new stdclass();
		} 
		$this->encodeResponse($rawData, $statusCode);
	}

	public function add()
	{
		$persistenceService = new PersistenceService();

		$jsonPayload = $this->getJsonPayload();

		if (!empty($jsonPayload)) {
			if (isset($jsonPayload->shortLink) && isset($jsonPayload->targetUrl)) {
				$existingData = $persistenceService->getAllData();
				if (!array_key_exists($jsonPayload->shortLink, $existingData)) {
					$existingData[$jsonPayload->shortLink] = $jsonPayload->targetUrl;
					$persistenceService->saveToFile($existingData);
					$this->encodeResponse($persistenceService->getAllData(), 200);
				} else {
					$this->encodeResponse(array('error' => 'Link ' . $jsonPayload->shortLink . ' already exists!'), 302);
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
			if (isset($jsonPayload->shortLink) && isset($jsonPayload->targetUrl)) {
				$existingData = $persistenceService->getAllData();
				if (array_key_exists($jsonPayload->shortLink, $existingData)) {
					$existingData[$jsonPayload->shortLink] = $jsonPayload->targetUrl;
					$persistenceService->saveToFile($existingData);
					$this->encodeResponse($persistenceService->getAllData(), 200);
				} else {
					$this->encodeResponse(array('error' => 'Link ' . $jsonPayload->shortLink . ' not found!'), 404);
				}
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
			$persistenceService->saveToFile($jsonPayload);
			$this->encodeResponse($persistenceService->getAllData(), 200);
		} else {
			$this->encodeResponse(array('error' => 'JSON data not exists'), 400);
		}
	}

	public function delete($id)
	{
		$persistenceService = new PersistenceService();
		if (isset($id)) {
			$existingData = $persistenceService->getAllData();
			if (array_key_exists($id, $existingData)) {
				unset($existingData[$id]);
				$persistenceService->saveToFile($existingData);
				$this->encodeResponse($persistenceService->getAllData(), 200);
			} else {
				$this->encodeResponse(array('error' => 'Link ' . $id . ' not found!'), 404);
			}
		} else {
			$this->encodeResponse(array('error' => 'Data not valid!'), 204);
		}
	}
}

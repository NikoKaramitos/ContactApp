
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("contactz.xyz", "TheBeast", "Group31POOS", "COP4331");

	if (invalidApplication($inData))
	{
		returnWithError("Some of the required JSON fields: ['firstName', 'lastName', 'login', 'password'] are missing");
	}
	else if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{


		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);

		$firstName = $inData["firstName"];
		$lastName = $inData["lastName"];

		if (0)
		{

		}
		else if($stmt->execute()) // Returns true if the execution was successful
		{
			returnWithInfo("Successful");
		}
		else
		{
			returnWithError("Failed");
		}

		$stmt->close();
		$conn->close();
	}

	function invalidApplication($inData)
	{
		return !isset($inData['firstName'])
			|| !isset($inData['lastName'])
			|| !isset($inData['login'])
			|| !isset($inData['password']);
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-Type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"id": 0, "firstName": "", "lastName": "", "error": "' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($firstName, $lastName, $id)
	{
		$retValue = '{"id": ' . $id . ',"firstName": "' . $firstName . '","lastName": "' . $lastName . '", "error": ""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

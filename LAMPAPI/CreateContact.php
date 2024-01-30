
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("contactz.xyz", "TheBeast", "Group31POOS", "COP4331");

	if (invalidApplication($inData))
	{
		returnWithError("Some of the required application JSON fields: ['firstName', 'lastName', 'login', 'password', 'userID'] are missing");	
	}
	else if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ss", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userID"]);
		
		if ($stmt->execute())
		{
			returnWithInfo(
				returnCreatedUser($row)
			);
		}
		else
		{
			returnWithError("Contact Creation Failed: ['" . $stmt->error . "']");
		}
		
		$stmt->close();
		$conn->close();
	}

	function invalidApplication($inData)
	{
		return !isset($inData['firstName'])
			|| !isset($inData['lastName'])
			|| !isset($inData['login'])
			|| !isset($inData['password'])
			|| !isset($inData['userID']);
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
		$retValue = '{"results": [], "error": "' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnCreatedUser($row)
	{
		return '{"id": ' . $row['ID'] . 
			', "firstName": "' . $row['FirstName'] . 
			'", "lastName": "' . $row['LastName'] . 
			'", "phone": "' . $row['Phone'] . 
			'", "email": "' . $row['Email'] .
		'"}';
	}

	function returnWithInfo($searchResults)
	{
		$retValue = '{"results": [' . $searchResults . '], "error": ""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
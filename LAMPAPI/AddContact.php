
<?php
	header('Access-Control-Allow-Origin: http://127.0.0.1:54471');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");


	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userID"]);
		
		if ($stmt->execute())
		{
			returnWithInfo(
				returnCreatedContact($row)
			);
		}
		else
		{
			returnWithError("Contact Creation Failed: ['" . $stmt->error . "']");
		}
		
		$stmt->close();
		$conn->close();
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

	function returnCreatedContact($row)
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
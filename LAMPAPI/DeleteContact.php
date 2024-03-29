
<?php
	/*
	header('Access-Control-Allow-Origin: http://127.0.0.1:54471');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
	*/
	$inData = getRequestInfo();
	// let tmp = { firstName: delFirst, lastName: delLast, email: delEmail, phone: delPhone, contactID, deleteContactID, userID: userId };
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (!isset($inData['contactID']) || !isset($inData['userID']))
	{
		returnWithError("Some of the required application JSON fields: ['contactID', 'userID'] are missing");
	}
	else if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ss", $inData['contactID'], $inData['userID']);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

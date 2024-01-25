
<?php

	$inData = getRequestInfo();
	

	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];

	$conn = new mysqli("contactz.xyz", "TheBeast", "Group31POOS", "COP4331"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$check = $conn->prepare("SELECT * FROM Contacts WHERE FirstName = ? AND
		LastName = ? AND Phone = ? AND Email = ?");
		$check->bind_param("ssss", $FirstName, $LastName, $Phone, $Email);
		$check->execute();
		$check->store_result();

		if($check->num_rows > 0)
		{
			returnWithError("Contact already exists");
		}

		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email)
		VALUES(?,?,?,?)");
		$stmt->bind_param("ss", $FirstName, $LastName, $Phone, $Email);
		$stmt->execute();
		$stmt->store_result();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}
	$check->close();

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
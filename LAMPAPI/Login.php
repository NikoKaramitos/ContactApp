
<?php

	$request = getRequestInfo();

	$ID = 0;
	$FirstName = "";
	$LastName = "";

	$connection = new mysqli("contactz.xyz", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if($connection->connect_error)
	{
		returnWithError($connection->connect_error);
	}
	else
	{
		$statement = $connection->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
		$statement->bind_param("ss", $request["Login"], $request["Password"]);
		$statement->execute();
		$result = $statement->get_result();

		if($row = $result->fetch_assoc())
		{
			returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
		}
		else
		{
			returnWithError("NO RECORDS FOUND");
		}

		$statement->close();
		$connection->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($object)
	{
		header('Content-type: application/json');
		echo $object;
	}

	function returnWithError($error)
	{
		$value = '{"ID" : 0, "FirstName" : "", "LastName" : "", "Error" : ' . $error . '}';
		sendResultInfoAsJson($value);
	}

	function returnWithInfo($FirstName, $LastName, $ID)
	{
		$value = '{"ID" : ' . $ID . ', "FirstName" : ' . $FirstName . ', "LastName" : ' . $LastName . ', "Error" : ""}';
		sendResultInfoAsJson($value);
	}

?>

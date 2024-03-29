
<?php
	/*
	header('Access-Control-Allow-Origin: http://127.0.0.1:54471');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
	*/
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (invalidApplication($inData))
	{
		returnWithError("Some of the required application JSON fields: ['firstName', 'lastName', 'login', 'password'] are missing");
	}
	else if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else if (usernameTaken($conn, $inData))
	{
		returnWithError("The username: ['" . $inData["login"] . "'] is already taken");
	}
	else // Create the user
	{
		$date = date("Y-m-d H:i:s");
		$stmt = $conn->prepare("INSERT INTO Users (DateCreated, FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $date, $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);

		if($stmt->execute()) // Returns true if the execution was successful
		{
			$id = getRegisteredId($conn, $inData);
			returnWithInfo($id, $inData["firstName"], $inData["lastName"]);
		}
		else
		{
			returnWithError("Registration Failed: ['" . $stmt->error . "']");
		}

		// Done
		$stmt->close();
		$conn->close();
	}

	function getRegisteredId($conn, $inData)
	{
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ? AND Password = ?");
		$stmt->bind_param("ss", $inData['login'], $inData['password']);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		$stmt->close();

		return $row['ID'];
	}

	function usernameTaken($conn, $inData)
	{
		$stmt = $conn->prepare("SELECT 1 FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $inData['login']);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_row();
		$stmt->close();

		// If the return value is non-null then its truthy, the username already exists
		return $row;
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
		sendResultInfoAsJson($retValue);
	}
	
	// Allows for automatically logging in after registering
	function returnWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"id": ' . $id . ',"firstName": "' . $firstName . '","lastName": "' . $lastName . '", "error": ""}';
		sendResultInfoAsJson($retValue);
	}
	
?>

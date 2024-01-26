
<?php

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	$inData = getRequestInfo();

	$connection = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (invalidApplication($inData))
	{
		returnWithError("Some of the required application JSON fields: ['login', 'password'] are missing");
	}
	else if($connection->connect_error)
	{
		returnWithError($connection->connect_error);
	}
	else
	{
		$statement = $connection->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login = ? AND Password = ?");
		$statement->bind_param("ss", $inData['login'], $inData['password']);
		$statement->execute();

		$result = $statement->get_result();
		if($row = $result->fetch_assoc())
		{
			returnWithInfo($row['ID'], $row['FirstName'], $row['LastName']);
		}
		else
		{
			returnWithError("User Not Found: ['" . $statement->error . "']");
		}

		$statement->close();

		if ($row)
		{
			date_default_timezone_set("America/New_York");
			$date = date("Y-m-d H:i:s");
			$statement = $connection->prepare("UPDATE Users SET DateLastLoggedIn = ? WHERE Login = ? AND Password = ?");
			$statement->bind_param("sss", $date, $inData['login'], $inData['password']);
			$statement->execute();
			$statement->close();
		}

		$connection->close();
	}

	function invalidApplication($inData)
	{
		return !isset($inData['login']) || !isset($inData['password']);
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($object)
	{
		header('Content-Type: application/json');
		echo $object;
	}

	function returnWithError($error)
	{
		$value = '{"id": 0, "firstName": "", "lastName": "", "error": "' . $error . '"}';
		sendResultInfoAsJson($value);
	}

	function returnWithInfo($id, $firstName, $lastName)
	{
		$value = '{"id": ' . $id . ', "firstName": "' . $firstName . '", "lastName": "' . $lastName . '", "error": ""}';
		sendResultInfoAsJson($value);
	}
?>

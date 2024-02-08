
<?php
	header('Access-Control-Allow-Origin: http://127.0.0.1:54417/login.html');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
	/* TODO -
	 * Password hashing was mentioned at the bottom of the word document
	 * 
	*/

	// Is this needed? Refer to group and test it...
	// header("Access-Control-Allow-Origin: *");

	/* Receives the JSON data sent from the browser
	 * 
	 * The following JSON fields MUST be defined:
	 * "login" : "string"
	 * "password" : "string"
	 * 
	 * Column matches and JSON fields are case sensitive
	 * Fields are stored as an array in inData and are accessed by isset() and bind_param()
	*/
	$inData = getRequestInfo();

	// If either one of the fields are not present then return an error
	$connection = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	// Error checking
	if (invalidApplication($inData))
	{
		returnWithError("Some of the required application JSON fields: ['login', 'password'] are missing");
	}
	else if($connection->connect_error)
	{
		returnWithError($connection->connect_error);
	}
	else // Database operations
	{
		// Prepared statement for the database
		// Then, bind the ? placeholders with the strings from application/json
		// Finally, send to the database to execute it
		$statement = $connection->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login = ? AND Password = ?");
		$statement->bind_param("ss", $inData['login'], $inData['password']);
		$statement->execute();

		// ID, FirstName, LastName are the extracted columns for rows matching Login = ? AND Password = ?
		// Only one row should match, else something is very wrong
		// If no rows are matched, falsy evaluation goes to the else block
		$result = $statement->get_result();
		if($row = $result->fetch_assoc())
		{
			// Send the needed data back to the client
			returnWithInfo($row['ID'], $row['FirstName'], $row['LastName']);
		}
		else
		{
			returnWithError("User Not Found: ['" . $statement->error . "']");
		}

		// Close previous prepared statement
		$statement->close();

		// Also update the DateLastLoggedIn column, executes iff the previous if branch did
		if ($row)
		{
			date_default_timezone_set("America/New_York");
			$date = date("Y-m-d H:i:s");
			$statement = $connection->prepare("UPDATE Users SET DateLastLoggedIn = ? WHERE Login = ? AND Password = ?");
			$statement->bind_param("sss", $date, $inData['login'], $inData['password']);
			$statement->execute();
			$statement->close();
		}

		// Done
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

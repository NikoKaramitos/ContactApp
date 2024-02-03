
<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (noQueries($inData))
	{
		returnWithError("The application JSON must contain fields ['userID', 'search']");
	}
	else if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$constructed = constructCommand($inData);
		$statement = $conn->prepare($constructed['c']);

		// Bind dynamically generated prepared statment
		$statement->bind_param($constructed['t'], ...$constructed['b']);
		$statement->execute();
		$result = $statement->get_result();
		$count = 0;
		$search = ""; // String concatenation my inefficient beloved

		if($result->num_rows > 0)
		{
			while ($row = $result->fetch_assoc())
			{
				$count++;
				$search .= '{"id": ' . $row['ID'] . 
					', "firstName": "' . $row['FirstName'] . 
					'", "lastName": "' . $row['LastName'] . 
					'", "phone": "' . $row['Phone'] . 
					'", "email": "' . $row['Email'] . 
				'"}';

				// Don't append a comma on the last entry
				if ($count != $result->num_rows)
				{
					$search .= ",";
				}
			}

			returnWithInfo($search);
		}
		else
		{
			returnWithError("No Contacts Found");
		}

		$statement->close();
		$conn->close();
	}

	function constructCommand($inData): array
	{
		// Global
		$base = "SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ?";
		$types = "s";
		$binding = array();
		array_push($binding, $inData["userID"]);
		
		// Dynamic
		if (true)
		{
			$types .= "s";
			array_push($binding, '%' . $inData['search'] . '%');
			$base .= ' OR FirstName LIKE ?';
		}

		if (true)
		{
			$types .= "s";
			array_push($binding, '%' . $inData['search'] . '%');
			$base .= ' OR LastName LIKE ?';
		}

		if (true)
		{
			$types .= "s";
			array_push($binding, '%' . $inData['search'] . '%');
			$base .= ' OR Phone LIKE ?';
		}

		if (true)
		{
			$types .= "s";
			array_push($binding, '%' . $inData['search'] . '%');
			$base .= ' OR Email LIKE ?';
		}

		return array('c' => $base, 't' => $types, 'b' => $binding);
	}

    function noQueries($inData)
    {
        return !isset($inData['userID']) || !isset($inData['search']);
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
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($searchResults)
	{
		$retValue = '{"results": [' . $searchResults . '], "error": ""}';
		sendResultInfoAsJson($retValue);
	}

?>
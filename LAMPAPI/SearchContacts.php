
<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (noQueries($inData))
	{
		returnWithError("The application JSON must contain at minimum the fields 'userID' and one query: ['firstName', 'lastName', 'phone', 'email']");
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
		array_push($binding, $inData['userID']);
		
		if(isset($inData['search']))
		{
			$search = '%' . $inData['search'] .'%';
			$base .= ' AND (FirstName LIKE? OR LastName LIKE ? OR Phone LIKE ? OR EMAIL LIKE?)';
		}

		$types .= 'ssss';
		array_push($binding, $search, $search, $search, $search, $search);
		/*
		// Dynamic
		if (isset($inData['firstName']))
		{
			$types .= "s";
			array_push($binding, '%' . $inData['firstName'] . '%');
			$base .= ' AND FirstName LIKE ?';
		}

		if (isset($inData['lastName']))
		{
			$types .= "s";
			array_push($binding, '%' . $inData['lastName'] . '%');
			$base .= ' AND LastName LIKE ?';
		}

		if (isset($inData['phone']))
		{
			$types .= "s";
			array_push($binding, '%' . $inData['phone'] . '%');
			$base .= ' AND Phone LIKE ?';
		}

		if (isset($inData['email']))
		{
			$types .= "s";
			array_push($binding, '%' . $inData['email'] . '%');
			$base .= ' AND Email LIKE ?';
		}
		*/
		return array('c' => $base, 't' => $types, 'b' => $binding);
	}

    function noQueries($inData)
    {
		// NO 'userID' OR NO ONE OF ['firstName', 'lastName', 'phone', 'email']
        return !isset($inData['userID']) || (
			!isset($inData['firstName'])
			&& !isset($inData['lastName'])
			&& !isset($inData['phone'])
			&& !isset($inData['email'])
		) && false;
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
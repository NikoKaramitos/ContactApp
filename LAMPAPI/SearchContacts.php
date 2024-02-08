
<?php
	header('Access-Control-Allow-Origin: http://127.0.0.1:54471');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$searches = "";
	$count = 0;
	$page = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if (!isset($inData['userID']) || !isset($inData['search']) || !isset($inData['page']))
	{
		returnWithError("The application JSON must contain fields ['userID', 'search', 'page']");
	}
	else if (($page = validPage($inData)) == 0)
	{
		returnWithError("The field 'page' must be only numeric and greater than 0");
	}
	else if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$min = 10 * ($page - 1) + 1;
		$max = 10 * $page;

		$command = "SELECT ID, FirstName, LastName, Phone, Email FROM (
			SELECT *, ROW_NUMBER() OVER (ORDER BY LastName) AS row_num FROM Contacts
			WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
		) AS query WHERE row_num BETWEEN ? AND ?";

		$stmt = $conn->prepare($command);
		$query = "%" . $inData["search"] . "%";
		$stmt->bind_param("issssii", $inData["userID"], $query, $query, $query, $query, $min, $max);
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if($count > 0)
			{
				$searches .= ",";
			}

			$count++;
			$searches .= json_encode($row);
		}
		
		if($count == 0)
		{
			returnWithError("No Contacts Found");
		}
		else
		{
			returnWithInfo($searches);
		}
		
		$stmt->close();
		$conn->close();
	}

	function validPage($inData): int
	{
		try
		{
			return intval($inData['page']);
		}
		catch (ValueError $e)
		{
			return 0;
		}
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
		$value = '{"results": [], "error": "' . $error . '"}';
		sendResultInfoAsJson($value);
	}
	
	function returnWithInfo($search)
	{
		$value = '{"results": [' . $search . '], "error": ""}';
		sendResultInfoAsJson($value);
	}

?>

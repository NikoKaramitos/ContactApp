
<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	$page = 0;

	if (!isset($inData['userID']) || !isset($inData['page']))
	{
		returnWithError("The required application JSON fields ['userID', 'page'] is missing");
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
		$man = 10 * $page;

		$command = "SELECT * FROM (
			SELECT *, ROW_NUMBER() OVER (ORDER BY UserID) AS row_num FROM Contacts WHERE UserID = ?
		) AS query WHERE row_num BETWEEN ? AND ?";

		$stmt = $conn->prepare($command);
		$stmt->bind_param("iii", $inData["userID"], $min, $max);
		$stmt->execute();
		$result = $stmt->get_result();
		$count = 0;
		$search = "";

		if ($result->num_rows > 0)
		{
			foreach ($result->fetch_assoc() as $row)
			{
				$count++;
				$search .= json_encode($row);

				// Don't append a comma on the last entry
				if ($count != $result->num_rows)
				{
					$search .= ", ";
				}
			}

			returnWithInfo($search);
		}
		else
		{
			returnWithError("No Contacts Found");
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

	function returnWithInfo($searchResults)
	{
		$retValue = '{"results": [' . $searchResults . '], "error": ""}';
		sendResultInfoAsJson($retValue);
	}

?>
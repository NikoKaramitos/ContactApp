<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error)
    {
        returnWithError ("". $conn->connect_error);
    }

    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE
    FirstName = ? AND LastName = ? AND Phone = ? AND Email = ? AND UserID = ?");

    $stmt->bind_param("sssssssss", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"]
    , $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userID"]);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            returnWithInfo("Contact updated successfully.");
        } else {
            returnWithError("No contact found or data is the same.");
        }
    } else {
        returnWithError($stmt->error);
    }

    $stmt->close();
    $conn->close();

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
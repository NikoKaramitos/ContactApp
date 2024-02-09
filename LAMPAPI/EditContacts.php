<?php
    $inData = getRequestInfo();
    header('Access-Control-Allow-Origin: http://127.0.0.1:54471');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error)
    {
        returnWithError ("". $conn->connect_error);
    }
    
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("sssssi", $inData["newFirstName"], $inData["newLastName"], $inData["newPhone"], $inData["newEmail"], $inData["contactID"], $inData["userID"]);
    

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
		echo($retValue);
		sendResultInfoAsJson($retValue);
	}

	function imTesting($test)
	{
		sendResultInfoAsJson('{"results":"' . $test .'"}');
	}

?>
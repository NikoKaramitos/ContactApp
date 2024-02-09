// takes the new variables after the finished edit button is clicked
let contactID = -1;

function setContactID()
{
    let e = window.event;
    contactID = e.target.id;
    let oldFirstName = document.getElementById(`first${contactID}`).textContent;
    let oldLastName = document.getElementById(`last${contactID}`).textContent;
    let oldPhone = document.getElementById(`phone${contactID}`).textContent;
    let oldEmail = document.getElementById(`email${contactID}`).textContent;

    document.getElementById("editFirstName").value = oldFirstName;
	document.getElementById("editLastName").value = oldLastName;
	document.getElementById("editEmail").value = oldEmail;
	document.getElementById("editPhone").value = oldPhone;

    const contact = [oldFirstName, oldLastName, oldPhone, oldEmail];
    //console.log(contact);
    //alert(contactID);
}

function edit(id) {

	let newFirstName = document.getElementById("editFirstName").value;
	let newLastName = document.getElementById("editLastName").value;
	let newEmail = document.getElementById("editEmail").value;
	let newPhone = document.getElementById("editPhone").value;
    const userID = userId;


	let tmp = {
		newFirstName: newFirstName,
		newLastName: newLastName,
		newPhone: newPhone,
		newEmail: newEmail,
		userID: userID,
        contactID: contactID
	};

    console.log(tmp);
	let jsonPayload = JSON.stringify(tmp);
    //console.log(jsonPayload);

	let url = urlBase + '/EditContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
                console.log(xhr.responseText);
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					document.getElementById("editResult").innerHTML = jsonObject.error;
				} else {
					document.getElementById("editResult").innerHTML = "Edit successful.";
					window.location.href = "../login.html";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("editError").innerHTML = err.message;
	}
}
// this file contains all functions related to search

let page = 1;
let searchErr = "";
const searchResults = document.getElementById("searchResults");

let editFirstName = "";
let editLastName = "";
let editPhoneNumber = "";
let editEmail = "";
let tempString = "";
let deleteContactID = "";

function pageUp() {
	if (searchErr.length == 0) {
		page++;
		searchContact();
	}
	document.getElementById("pageNum").innerHTML = page;
}
function pageDown() {
	if (page - 1 > 0) {
		page--;
		searchContact();
		searchErr = "";
	}
	document.getElementById("pageNum").innerHTML = page;
}

function addElement(contact, num) {
	const newContact = document.createElement("div");
	newContact.classList.add("contact");

	let count = document.createElement("p");
	count.classList.add("my-0", "col-1");
	count.textContent = num + 10 * (page - 1);
	newContact.append(count);

	let nameRow = document.createElement("div");
	nameRow.classList.add("my-0", "col");
	nameRow.style.display = "flex";
	nameRow.style.justifyContent = "center";

	let temp = document.createElement("p");
	temp.classList.add("px-1");
	temp.textContent = contact.FirstName;
	temp.id = `first${contact.ID}`;
	nameRow.append(temp);

	temp = document.createElement("p");
	temp.textContent = contact.LastName;
	temp.id = `last${contact.ID}`;
	nameRow.append(temp);
	newContact.append(nameRow);

	temp = document.createElement("p");
	temp.classList.add("my-0", "col-12", "col-lg");
	// DELETE (?) temp.classList.add("col-md");
	temp.id = `phone${contact.ID}`;
	temp.textContent = contact.Phone;
	newContact.append(temp);

	temp = document.createElement("p");
	temp.classList.add("my-0", "col-12", "col-lg");
	if (contact.Email.length > 30) {
		temp.classList.add("fs-6");
	}
	temp.id = `email${contact.ID}`;
	// DELETE (?) temp.classList.add("col-md");
	temp.textContent = contact.Email;
	newContact.append(temp);

	const buttRow = document.createElement("div");
	buttRow.classList.add(
		"my-0",
		"edit-del-row",
		"justify-content-md-end",
		"justify-content-center"
	);

	// EDIT BUTTON HERE:
	let editButt = document.createElement("Button");
	editButt.classList.add("btn", "mx-1");
	editButt.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>`;
	// editButt.textContent = "Edit";
	editButt.id = contact.ID;
	editButt.setAttribute("data-bs-toggle", "modal");
	editButt.setAttribute("data-bs-target", "#editModal");
	editButt.setAttribute("onclick", "setContactID()");

	buttRow.append(editButt);

	// Delete BUTTON HERE:
	let delButt = document.createElement("Button");
	delButt.classList.add("btn", "mx-1");
	// delButt.textContent = "Delete";
	delButt.id = contact.ID;
	delButt.setAttribute("data-bs-toggle", "modal");
	delButt.setAttribute("data-bs-target", "#deleteModal");
	delButt.onclick = function () {
		saveDelete(contact.ID, contact.userID);
	};

	delButt.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>`;

	buttRow.append(delButt);

	newContact.append(buttRow);
	searchResults.append(newContact);
}

function searchContact() {
	const searchDiv = document.getElementById("searchResults");
	searchDiv.innerHTML = "";

	const searchText = document.getElementById("searchText").value;
	//document.getElementById("searchText").value = "";

	readCookie();

	let tmp = { search: searchText, userID: userId, page: page };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let response = xhr.responseText;
				let jsonObject = JSON.parse(response);
				let results = jsonObject.results;

				for (let i = 0; i < results.length; i++) {
					addElement(results[i], i + 1);
				}
				if (jsonObject.error) {
					searchDiv.innerHTML = jsonObject.error;
					searchErr = jsonObject.error;
				} else {
					searchErr = "";
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("SearchResults").innerHTML = err.message;
	}
}

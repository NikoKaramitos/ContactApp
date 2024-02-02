const testMode = false;
const urlBase = 'http://contactz.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let carouselMode = "";
let phone = "";
let email = "";
let login = "";
let password = "";

function loadContacts() {
	let url = 'http://contactz.xyz/LAMPAPI/RequestContacts.php';
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onload = function () {
			if (this.status == 200) {
				let jsonResponse = JSON.parse(xhr.responseText);
				let contacts = jsonResponse.contacts;
				const searchContainer = document.getElementById("searchResults");
				searchContainer.innerHTML = "";

				searchContact.forEach(function (contacts) {
					const a = document.createElement("div");
					a.className = "contact";
					// populate the following line with carlos' js code for adding boxes orw/e idk
					a.innerHTML = `<h3>${searchContact.firstName}</h3>
					<p>${searchContact.phone}</p>`;
					searchContainer.appendChild(a);
				});
			}
		};
	}
	catch (err) {
		document.getElementById("searchResult").innerHTML = err.message;
	}

	xhr.send(jsonPayload);
}

function validateLogin(login, password) {
	let empty = true;

	if (login.value.trim() == "") {
		login.style.borderCcolor = "red";
		empty = false;
	}
	else {
		login.style.borderColor = "";
		empty = true;
	}

	if (password.value.trim() == "") {
		password.style.borderColor = "red";
		empty = false;
	}
	else {
		password.style.borderColor = "";
		empty = true;
	}

	return empty;
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	if (testMode) {
		document.cookie = "mode=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
		firstName = "Tester";
		lastName = "Man"
		saveCookie();
		window.location.href = "../dashboard.html";
		return;
	}

	let loginID = document.getElementById("loginName")
	let passwordID = document.getElementById("loginPassword")

	if (!validateLogin(loginID, passwordID)) {
		document.getElementById("registerResult").innerHTML = err.message;
		return;

	}

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	let url = 'http://contactz.xyz/LAMPAPI/Login.php';
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				document.cookie = "mode=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "../dashboard.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}


function doRegister() {

	// Capture user input
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginUser").value;
	let password = document.getElementById("password").value;

	// var hash = md5(password);

	document.getElementById("registerResult").innerHTML = "";

	let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					document.getElementById("registerResult").innerHTML = jsonObject.error;
				} else {
					document.getElementById("registerResult").innerHTML = "Registration successful";
					window.location.href = "../login.html";
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}


function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	if (firstName && lastName) {
		document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	}
}

function registerMode() {
	document.cookie = "mode=register";
}
function loginMode() {
	document.cookie = "mode=login";
}
function setMode() {
	carouselMode = document.cookie.substring(5);
	//document.cookie = "mode= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = firstName + " " + lastName + "'s";
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {
	let firstName = document.getElementById("addFirstName").value;
	let lastName = document.getElementById("addLastName").value;
	let email = document.getElementById("addEmail").value;
	let phone = document.getElementById("addPhone").value;

	if(!isValidName(firstName)) 
	{
		document.getElementById("addErrors").innerHTML = "Invalid first name.";
		return;
	}
	if(!isValidName(lastName)) 
	{
		document.getElementById("addErrors").innerHTML = "Invalid last name.";
		return;
	}
	if(!isValidNumber(phone)) 
	{
		document.getElementById("addErrors").innerHTML = "Invalid Phone Number";
		return;
	}
	if(!isValidName(email)) 
	{
		document.getElementById("addErrors").innerHTML = "Invalid email.";
		return;
	}
	
	document.getElementById("addErrors").innerHTML = "";


	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addEmail").value ="";
	document.getElementById("addPhone").value ="";

	//document.getElementById("addResult").innerHTML = "";

	let tmp = { firstName: firstName, lastName: lastName, email: email, phone: phone, userID: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//document.getElementById("addContactResult").innerHTML = "Contact added.";
				console.log("Contact added!")
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("addResult").innerHTML = err.message;

	}

}

function searchContact() {
	const searchDiv = document.getElementById("searchResults");
	searchDiv.innerHTML = "";

	// store the search type
	const searchType = document.getElementById("searchType").value;

	const searchText = document.getElementById("searchText").value;
	document.getElementById("searchText").value = "";

	let tmp = { [searchType] : searchText, userID : userId };

	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//document.getElementById("searchResults").innerHTML = "Contact(s) has been retrieved";
				let response = xhr.responseText;
				console.log(response);
				let jsonObject = JSON.parse(response);
				let results = jsonObject.results;
				console.log(results);
				for (let i = 0; i < results.length; i++)
				{
					addElement(results[i], i + 1);
				}
				if (jsonObject.error) {
					searchDiv.innerHTML = jsonObject.error;
				}
				//jsonObject.forEach(contact => (console.log(contact)));

				// else {
				// 	let contactList;
				// 	for (let i = 0; i < jsonObject.results.length; i++) {
				// 		contactList += jsonObject.results[i];
				// 		if (i < jsonObject.results.length - 1) {
				// 			contactList += "<br />\r\n";
				// 		}
				// 	}
				// 	console.log(contactList);
				// }
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("SearchResults").innerHTML = err.message;
	}

}

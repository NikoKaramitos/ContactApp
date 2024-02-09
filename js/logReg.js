//this file contains global variables and all login/logout/register functions


/*------------------------------*/const testMode = false;/*---------------------------------------*/


const urlBase = 'http://contactz.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let carouselMode = "";
let oldFirstName = "";
let oldLastName = "";
let oldEmail = "";
let oldPhone = "";

function registerMode() {
	document.cookie = "mode=register";
}
function loginMode() {
	document.cookie = "mode=login";
}
function setMode() {
	carouselMode = document.cookie.substring(5);
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	if (firstName && lastName) {
		document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	}
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

function validateLogin(login, password) {
	return login.value.length > 0 && password.value.length > 0;
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
	let firstNameReg = document.getElementById("firstName").value;
	let lastNameReg = document.getElementById("lastName").value;
	let loginReg = document.getElementById("loginUser").value;
	let passwordReg = document.getElementById("password").value;
	// var hash = md5(password);

	if (testMode) {
		document.cookie = "mode=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
		firstName = "Tester";
		lastName = "Man"
		saveCookie();
		window.location.href = "../dashboard.html";
		return;
	}

	document.getElementById("registerResult").innerHTML = "";

	let tmp = { firstName: firstNameReg, lastName: lastNameReg, login: loginReg, password: passwordReg };
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

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
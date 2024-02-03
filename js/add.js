// This file contains all functions related to adding


// checks that a name does not have a quote in it;
function isValidName(name) {
    if (name.length == 0) return false;
    for (let i = 0; i < name.length; i++) {
        if ((/"/).test(name[i])) return false;
    }
    return true;
}
function isValidMail(mail) {
    let atFlag = 0;
    let dotFlag = 0;
    if (mail.length == 0) {
        console.log("mail too short")
        return false;
    }
    for (let i = 0; i < mail.length; i++) {
        if ((/"/).test(mail[i])) {
            console.log("Found a quote")
            return false;
        }
        if (mail[i] == '.') dotFlag++;
        if ((/@/).test(mail[i])) atFlag++;
    }
    return (atFlag == 1) && (dotFlag >= 1);
}
function isValidNumber(number) {
    if (number.length != 12) return false;
    for (let i = 0; i < number.length; i++) {
        if (!(/[0-9]/).test(number[i]) && !(/-/).test(number[i])) return false;
    }
    return true;
}

function addContact() {
    let firstName = document.getElementById("addFirstName").value;
    let lastName = document.getElementById("addLastName").value;
    let email = document.getElementById("addEmail").value;
    let phone = document.getElementById("addPhone").value;

    if (!isValidName(firstName)) {
        document.getElementById("addErrors").innerHTML = "Invalid first name.";
        return;
    }
    if (!isValidName(lastName)) {
        document.getElementById("addErrors").innerHTML = "Invalid last name.";
        return;
    }
    if (!isValidNumber(phone)) {
        document.getElementById("addErrors").innerHTML = "Invalid phone number.";
        return;
    }
    if (!isValidMail(email)) {
        document.getElementById("addErrors").innerHTML = "Invalid email.";
        return;
    }

    document.getElementById("addErrors").innerHTML = "";
    document.getElementById("addFirstName").value = "";
    document.getElementById("addLastName").value = "";
    document.getElementById("addEmail").value = "";
    document.getElementById("addPhone").value = "";

    let tmp = { firstName: firstName, lastName: lastName, email: email, phone: phone, userID: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("addErrors").innerHTML = "Contact added.";
                console.log("Contact added!")
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("addErrors").innerHTML = err.message;
    }
}
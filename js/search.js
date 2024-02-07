// this file contains all functions related to search

let page = 1;
let searchErr = "";
const searchResults = document.getElementById("searchResults");

let editFirstName = "";
let editLastName = "";
let editPhoneNumber = "";
let editEmail = "";
let tempString = "";

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
    }
    document.getElementById("pageNum").innerHTML = page;
}

function addElement(contact, num) {
    // const newContact = document.createElement("div");
    // newContact.classList.add("contact");
    // newContact.id = `contact-${contact.ID}`; 

    // let count = document.createElement("p");
    // count.classList.add("my-0", "col-1");
    // count.id = `count-${contact.ID}`; 
    // count.textContent = num + (10 * (page - 1));
    // newContact.appendChild(count);

    // let name = document.createElement("p");
    // name.classList.add("my-0", "col");
    // name.id = `name-${contact.ID}`;
    // name.textContent = `${contact.FirstName} ${contact.LastName}`;
    // newContact.appendChild(name);

    // let phone = document.createElement("p");
    // phone.classList.add("my-0", "col-12", "col-md");
    // phone.id = `phone-${contact.ID}`; 
    // phone.textContent = contact.Phone;
    // newContact.appendChild(phone);

    // let email = document.createElement("p");
    // email.classList.add("my-0", "col-12", "col-md");
    // email.id = `email-${contact.ID}`; 
    // email.textContent = contact.Email;
    // newContact.appendChild(email);

    const newContact = document.createElement("div");
    newContact.classList.add("contact");
    newContact.id = contact.ID;

    let count = document.createElement("p");
    count.classList.add("my-0", "col-1");
    count.textContent = num + (10 * (page - 1));
    newContact.append(count);

    let temp = document.createElement("p");
    temp.classList.add("my-0", "col");
    temp.textContent = contact.FirstName + " " + contact.LastName;
    newContact.append(temp);

    temp = document.createElement("p");
    temp.classList.add("my-0", "col-12", "col-md");
    // DELETE (?) temp.classList.add("col-md");
    temp.textContent = contact.Phone;
    newContact.append(temp);

    temp = document.createElement("p");
    temp.classList.add("my-0", "col-12", "col-md");
    // DELETE (?) temp.classList.add("col-md");
    temp.textContent = contact.Email;
    newContact.append(temp);

    const buttRow = document.createElement("div");
    buttRow.classList.add("my-0", "col")

    // EDIT BUTTON HERE:
    let editButt = document.createElement("Button");
    editButt.classList.add("btn", "btn-primary");
    editButt.textContent = "Edit";
    buttRow.append(editButt);

    // Delete BUTTON HERE:
    let delButt = document.createElement("Button");
    delButt.classList.add("btn", "btn-primary");
    delButt.textContent = "DEL";
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

    let url = urlBase + '/SearchContacts.' + extension;

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
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("SearchResults").innerHTML = err.message;
    }
}

/* LEGACY CODE - GONE BUT NEVER FORGOTTEN
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
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("searchResult").innerHTML = err.message;
    }

}
*/
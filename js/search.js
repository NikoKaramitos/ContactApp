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
    count.textContent = num + (10 * (page - 1));
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
        temp.classList.add("fs-6")
    }
    temp.id = `email${contact.ID}`;
    // DELETE (?) temp.classList.add("col-md");
    temp.textContent = contact.Email;
    newContact.append(temp);
    
    const buttRow = document.createElement("div");
    buttRow.classList.add("my-0", "edit-del-row", "justify-content-md-end", "justify-content-center");
    
    // EDIT BUTTON HERE:
    let editButt = document.createElement("Button");
    editButt.classList.add("btn", "btn-altpurple", "mx-1");
    editButt.textContent = "Edit";
    editButt.id = contact.ID;
    editButt.setAttribute("data-bs-toggle", "modal");
    editButt.setAttribute("data-bs-target", "#editModal");
    editButt.setAttribute("onclick", "setContactID()");
    buttRow.append(editButt);

    // Delete BUTTON HERE:
    let delButt = document.createElement("Button");
    delButt.classList.add("btn", "btn-danger", "mx-1");
    delButt.textContent = "Delete";
    delButt.id = contact.ID;
    delButt.setAttribute("data-bs-toggle", "modal");
    delButt.setAttribute("data-bs-target", "#deleteModal");
    delButt.onclick = function() {
        saveDelete(contact.ID, contact.userID);
    };

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
                } else {
                    searchErr = "";
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("SearchResults").innerHTML = err.message;
    }
}
// this file contains all functions related to search

let page = 1;
const searchResults = document.getElementById("searchResults");

function pageUp() {
    page++;
    searchContact();
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
    console.log(contact);
    const newContact = document.createElement("div");
    newContact.classList.add("contact");
    newContact.id = contact.ID;

    let count = document.createElement("p.my-0");
    count.classList.add("col-1");
    count.textContent = num + (10 * (page - 1));
    newContact.append(count);

    let temp = document.createElement("p.my-0");
    temp.classList.add("col");
    temp.textContent = contact.FirstName + " " + contact.LastName;
    newContact.append(temp);

    temp = document.createElement("p.my-0");
    temp.classList.add("col-12");
    temp.classList.add("col-md");
    temp.textContent = contact.Phone;
    newContact.append(temp);

    temp = document.createElement("p.my-0");
    temp.classList.add("col-12");
    temp.classList.add("col-md");
    temp.textContent = contact.Email;
    newContact.append(temp);

    searchResults.append(newContact);
}

function searchContact() {
    const searchDiv = document.getElementById("searchResults");
    searchDiv.innerHTML = "";

    const searchText = document.getElementById("searchText").value;
    document.getElementById("searchText").value = "";

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
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("SearchResults").innerHTML = err.message;
    }
}

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
const searchResults = document.getElementById("searchResults");
let numContacts = 1;

function addElement(name, number, mail) {
    const newContact = document.createElement("div");

    newContact.classList.add("container");
    newContact.classList.add("bg-white");
    newContact.classList.add("d-flex");
    newContact.classList.add("justify-content-around");

    newContact.append(document.createTextNode(numContacts));

    let temp = document.createElement("p");
    temp.textContent = name;
    newContact.append(temp);

    temp = document.createElement("p");
    temp.textContent = number;
    newContact.append(temp);

    temp = document.createElement("p");
    temp.textContent = mail;
    newContact.append(temp);

    //newContact.textContent = numContacts + " " + name + " " + number + " " + mail;
    numContacts++;
    searchResults.append(newContact);
    // console.log(newContact);
}


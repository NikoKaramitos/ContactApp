const searchResults = document.getElementById("searchResults");
let numContacts = 1;

function addElement(contact) {
    const newContact = document.createElement("div");

    //newContact.classList.add("container");
    newContact.classList.add("contact");
    let count = document.createElement("p.my-0");
    count.classList.add("col-1");
    count.textContent = numContacts;
    newContact.append(count);

    let temp = document.createElement("p.my-0");
    temp.classList.add("col");
    temp.textContent = contact.firstName + " " + contact.lastName;
    newContact.append(temp);

    // temp = document.createElement("p.my-0");
    // temp.classList.add("col-5");
    // temp.textContent = contact.lastName;
    // newContact.append(temp);

    temp = document.createElement("p.my-0");
    temp.classList.add("col-12");
    temp.classList.add("col-md");
    temp.textContent = contact.phone;
    newContact.append(temp);

    temp = document.createElement("p.my-0");
    temp.classList.add("col-12");
    temp.classList.add("col-md");
    temp.textContent = contact.email;
    newContact.append(temp);

    //newContact.textContent = numContacts + " " + name + " " + number + " " + mail;
    numContacts++;
    searchResults.append(newContact);
    // console.log(newContact);
}

let practiceContacts = [
    {
        "firstName": "john",
        "lastName": "pork",
        "email": "johnathanpork@porkmail.com",
        "phone": "123-456-5555",
        "ID": 0
    },
    {
        "firstName": "mayo",
        "lastName": "naise",
        "email": "somemail@gmail.com",
        "phone": "123-456-5555",
        "ID": 1
    },
    {
        "firstName": "Parchtic",
        "lastName": "Star",
        "email": "pattyflipper@mail.com",
        "phone": "123-456-5555",
        "ID": 2
    },
    {
        "firstName": "Rick",
        "lastName": "Leinecker",
        "email": "theRickster@gmail.com",
        "phone": "123-456-5555",
        "ID": 3
    }
];

let practiceContact =
{
    "firstName": "johnny",
    "lastName": "test",
    "email": "dookielover@gmail.com",
    "phone": "123-456-5555",
    "ID": 4
};

practiceContacts.push(practiceContact);
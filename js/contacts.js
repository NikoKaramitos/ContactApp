const searchResults = document.getElementById("searchResults");

function addElement(contact, num) {
    const newContact = document.createElement("div");

    //newContact.classList.add("container");
    newContact.classList.add("contact");
    newContact.id = contact.id;
    let count = document.createElement("p.my-0");
    count.classList.add("col-1");
    count.textContent = num;
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
    searchResults.append(newContact);
    // console.log(newContact);
}


// checks that a name does not have a quote in it;
function isValidName(name)
{
    if (name.length == 0) return false;
    for (let i = 0; i < name.length; i++)
    {
        if((/"/).test(name[i])) return false;
    }
    return true;
}
function isValidMail(mail)
{
    let atFlag = 0;
    let dotFlag = 0;
    if (mail.length == 0)
    { 
        console.log("mail to short")
        return false;
    }
    for (let i = 0; i < mail.length; i++)
    {
        if((/"/).test(mail[i]))
        { 
            console.log("Found a quote")
            return false;
        }
        if(mail[i] == '.') dotFlag++;
        if((/@/).test(mail[i])) atFlag++;
    }
    console.log("at count: "+atFlag +" dot count: "+dotFlag);
    return (atFlag == 1) && (dotFlag >= 1);
}


function isValidNumber(number)
{
    if (number.length != 12) return false;
    for (let i = 0; i < number.length; i++)
    {
        if (!(/[0-9]/).test(number[i]) && !(/-/).test(number[i])) return false;
    }
    return true;
}
    // let practiceContacts = [
    //     {
    //         "firstName": "john",
    //         "lastName": "pork",
    //         "email": "johnathanpork@porkmail.com",
    //         "phone": "123-456-5555",
    //         "ID": 0
    //     },
    //     {
    //         "firstName": "mayo",
    //         "lastName": "naise",
    //         "email": "somemail@gmail.com",
    //         "phone": "123-456-5555",
    //         "ID": 1
    //     },
    //     {
    //         "firstName": "Parchtic",
    //         "lastName": "Star",
    //         "email": "pattyflipper@mail.com",
    //         "phone": "123-456-5555",
    //         "ID": 2
    //     },
    //     {
    //         "firstName": "Rick",
    //         "lastName": "Leinecker",
    //         "email": "theRickster@gmail.com",
    //         "phone": "123-456-5555",
    //         "ID": 3
    //     }
    // ];
    
    // let practiceContact =
    // {
    //     "firstName": "johnny",
    //     "lastName": "test",
    //     "email": "dookielover@gmail.com",
    //     "phone": "123-456-5555",
    //     "ID": 4
    // };
    
    // practiceContacts.push(practiceContact);
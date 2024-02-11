function saveDelete(zID, dID) {
    deleteContactID = zID;
    /*
    let delFirst = document.getElementById("editFirstName").value;
    let delLast = document.getElementById("editLastName").value;
    let delPhone = document.getElementById("editPhone").value;
    let delEmail = document.getElementById("editEmail").value;
    */
}

function deleteContact() {
    // let tmp = { firstName: delFirst, lastName: delLast, email: delEmail, phone: delPhone, contactID, deleteContactID, userID: userId };
    let tmp = {contactID: deleteContactID, userID: userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("deleteError").innerHTML = "Contact deleted.";
                var deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                deleteModal.hide();
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("deleteError").innerHTML = err.message;
    }
}
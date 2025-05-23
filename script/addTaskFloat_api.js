let contacts =[];

async function getAllContacts ( path ) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}

async function pushToContactsArray() {
    let contact = await getAllContacts ("/contacts");
    let contactsArray = contact? Object.keys(contact) : [];

    for (let index = 0; index < contactsArray.length; index++) {
        let contactData = contact[contactsArray[index]];
        contacts.push({
            id:contactsArray[index],
           colorClass: contactData.avatarColorClass,
           email: contactData.email,
           name: contactData.name,
           phone: contactData.phone
        });
    }
}
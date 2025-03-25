// contacts.js

// Globale Deklarationen
const DETAIL_ELEM = document.getElementById( 'detail' );
const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

// Aktualisiert das Detail-Panel mit den Daten des ausgewählten Kontakts
function updateDetailPanel ( contactId ) {
    const selectedContact = contacts.find( contact => contact.id === contactId );
    if ( !selectedContact ) return;
    DETAIL_ELEM.innerHTML = contactDetailTemplate( selectedContact );
    // Delete-Button-Listener hinzufügen
    const deleteBtn = DETAIL_ELEM.querySelector( '.delete-btn' );
    if ( deleteBtn ) {
        deleteBtn.addEventListener( 'click', function () {
            deleteContact( contactId );
        } );
    }
}

// Schaltet das Detail-Panel um
function toggleDetailPanel () {
    if ( DETAIL_ELEM.classList.contains( 'open' ) ) {
        DETAIL_ELEM.classList.remove( 'open', 'slide_in' );
    } else {
        DETAIL_ELEM.classList.add( 'open', 'slide_in' );
    }
}

function handleContactClick () {
    if ( this.classList.contains( 'selected' ) ) {
        this.classList.remove( 'selected' );
        if ( DETAIL_ELEM.classList.contains( 'open' ) ) toggleDetailPanel();
    } else {
        document.querySelectorAll( '.contact' ).forEach( c => c.classList.remove( 'selected' ) );
        this.classList.add( 'selected' );
        updateDetailPanel( this.id );
        if ( !DETAIL_ELEM.classList.contains( 'open' ) ) toggleDetailPanel();
    }
}

function attachContactListeners () {
    document.querySelectorAll( '.contact' ).forEach( contact =>
        contact.addEventListener( 'click', handleContactClick )
    );
}

// Overlay-Funktion für "Add Contact" – Animation von rechts nach links
function showaddContactOverlay () {
    let overlay = document.getElementById( 'overlay' );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = addContactOverlay();
    overlay.classList.add( 'slide_in' );
}

// Overlay-Funktion für "Edit Contact" – identisches Layout wie Add, aber Animation von links nach rechts
function showEditContactOverlay ( contactId ) {
    let overlay = document.getElementById( 'overlay' );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const selectedContact = contacts.find( contact => contact.id === contactId );
    if ( !selectedContact ) return;
    overlay.innerHTML = editContactOverlay( selectedContact );
    overlay.classList.add( 'slide_in_left' );
}

function closeOverlay ( event ) {
    let overlay = document.getElementById( 'overlay' );
    if ( !event || event.target === overlay ) {
        overlay.classList.remove( 'show', 'slide_in', 'slide_in_left' );
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function getContactData () {
    let name = document.getElementById( "name" ).value;
    let email = document.getElementById( "email" ).value;
    let phone = document.getElementById( "phone" ).value;
    postContactData( "/contacts", { "name": name, "email": email, "phone": phone } );
}

async function postContactData ( path = "", data = {} ) {
    await fetch( BASE_URL + path + ".json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( data )
    } );
    pushToContactsArray();
}

async function pushToContactsArray () {
    let response = await getAllContacts( "/contacts" );
    let contactKeysArray = Object.keys( response || {} );
    contacts = [];
    for ( let index = 0; index < contactKeysArray.length; index++ ) {
        contacts.push( {
            id: contactKeysArray[ index ],
            contactData: response[ contactKeysArray[ index ] ]
        } );
    }
    renderContacts();
}

async function getAllContacts ( path ) {
    let response = await fetch( BASE_URL + path + ".json" );
    return await response.json();
}

function clearContactsList () {
    const contactsListElement = document.querySelector( '.contacts_list' );
    contactsListElement.innerHTML = "";
    return contactsListElement;
}

function sortContacts ( contactArray ) {
    return contactArray.sort( ( contactA, contactB ) =>
        contactA.contactData.name.localeCompare( contactB.contactData.name )
    );
}

function groupContacts ( contactArray ) {
    const groups = {};
    for ( const contact of contactArray ) {
        const firstLetter = contact.contactData.name.charAt( 0 ).toUpperCase();
        if ( !groups[ firstLetter ] ) {
            groups[ firstLetter ] = [];
        }
        groups[ firstLetter ].push( contact );
    }
    return groups;
}

function renderGroup ( letter, contactsInGroup ) {
    const groupElement = document.createElement( 'div' );
    groupElement.classList.add( 'contact_list_group' );
    groupElement.innerHTML = headerTemplate( letter ) +
        contactsInGroup.map( contact => contactTemplate( contact ) ).join( '' );
    return groupElement;
}

function renderContacts () {
    const contactsListElement = clearContactsList();
    const sortedContacts = sortContacts( contacts );
    const groupedContacts = groupContacts( sortedContacts );
    Object.keys( groupedContacts ).sort().forEach( letter => {
        contactsListElement.appendChild( renderGroup( letter, groupedContacts[ letter ] ) );
    } );
    attachContactListeners();
}

function getAvatarFromName ( name ) {
    return name.split( " " ).map( word => word.charAt( 0 ).toUpperCase() ).join( "" );
}

// Funktion zum Aktualisieren eines Kontakts (Update)
async function updateContact ( contactId ) {
    const updatedName = document.getElementById( "edit_name" ).value;
    const updatedEmail = document.getElementById( "edit_email" ).value;
    const updatedPhone = document.getElementById( "edit_phone" ).value;
    try {
        await fetch( BASE_URL + "/contacts/" + contactId + ".json", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( {
                name: updatedName,
                email: updatedEmail,
                phone: updatedPhone
            } )
        } );
        await pushToContactsArray();
        closeOverlay();
        // Aktualisiere Detailpanel, falls dieser gerade angezeigt wird
        updateDetailPanel( contactId );
    } catch ( error ) {
        console.error( "Error updating contact:", error );
    }
}

// Löscht einen Kontakt via DELETE-Request
async function deleteContact ( contactId ) {
    await fetch( BASE_URL + "/contacts/" + contactId + ".json", {
        method: "DELETE"
    } );
    pushToContactsArray();
    DETAIL_ELEM.innerHTML = "";
}

function getRandomColor () {
    const colors = [ '#f57c00', '#8e24aa', '#5c6bc0', '#f48fb1', '#ffb300', '#26a69a' ];
    return colors[ Math.floor( Math.random() * colors.length ) ];
}


pushToContactsArray();

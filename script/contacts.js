const DETAIL_ELEM = document.getElementById( 'detail' );
const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

// Updates the detail panel with the data of the selected contact
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

// Toggle function for the detail panel
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

function showaddContactOverlay () {
    let overlay = document.getElementById( 'overlay' );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = addContactOverlay();
    overlay.classList.add( 'slide_in' );
}

function closeOverlay ( event ) {
    let overlay = document.getElementById( 'overlay' );
    if ( !event || event.target === overlay ) {
        overlay.classList.remove( 'show', 'slide_in' );
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
    attachContactListeners(); // Bindet Klick-Listener an alle neu gerenderten .contact-Elemente
}

function getAvatarFromName ( name ) {
    return name.split( " " ).map( word => word.charAt( 0 ).toUpperCase() ).join( "" );
}

pushToContactsArray();

// Deletes a contact via a DELETE request
async function deleteContact ( contactId ) {
    await fetch( BASE_URL + "/contacts/" + contactId + ".json", {
        method: "DELETE"
    } );
    pushToContactsArray();
    DETAIL_ELEM.innerHTML = ""; // Optional: Detail-Panel leeren
}
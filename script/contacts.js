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
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = 'flex';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = addContactOverlay();
    overlay.classList.add( 'slide_in' );
}

function showEditContactOverlay ( contactId ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = 'flex';
    const editOverlay = document.getElementById( "editOverlay" );
    const selectedContact = contacts.find( contact => contact.id === contactId );
    if ( !selectedContact ) return;
    // Fülle das Overlay mit dem HTML-Inhalt, der über deine editContactOverlay-Funktion erzeugt wird
    editOverlay.innerHTML = editContactOverlay( selectedContact );
    // Verhindere, dass der Body scrollt, solange das Overlay sichtbar ist
    document.body.style.overflow = "hidden";
    // Füge die Klasse "active" hinzu, damit das Overlay von links hereinschiebt
    editOverlay.classList.add( "active" );
}

function closeEditOverlay ( event ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = '';
    const editOverlay = document.getElementById( "editOverlay" );
    // Schließe, wenn der Klick auf den Hintergrund oder ein Element mit der Klasse close-btn erfolgt
    if ( !event || event.target === editOverlay || event.target.closest( ".close-btn" ) ) {
        editOverlay.classList.remove( "active" );
        document.body.style.overflow = "auto";
        // Optional: Nach Übergangsende den Inhalt löschen
        setTimeout( () => {
            editOverlay.innerHTML = "";
        }, 300 );
    }
}



function closeOverlay ( event ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = '';
    let overlay = document.getElementById( 'overlay' );
    if ( !event || event.target === overlay || event.target.closest( ".close-btn" ) ) {
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
    toggleMessage();

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
    closeOverlay();
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

function getColorForContact ( name ) {
    const colors = [ '#f57c00', '#8e24aa', '#5c6bc0', '#f48fb1', '#ffb300', '#26a69a' ];
    // Hier wird der erste Buchstabe herangezogen – so wie in alten, guten Zeiten
    let firstLetter = name.charAt( 0 ).toUpperCase();
    let index = firstLetter.charCodeAt( 0 ) % colors.length;
    return colors[ index ];
}

function showMessage () {
    let messageElem = document.getElementById( "contact-successfully-created" );
    messageElem?.classList.add( "overly-move-up" );
}

function hideMessage () {
    let messageElem = document.getElementById( "contact-successfully-created" );
    messageElem?.classList.remove( "overly-move-up" );
}

function toggleMessage () {
    showMessage();
    setTimeout( hideMessage, 800 );
}

function closeAll () {
    closeOverlay();
    closeEditOverlay();
}

pushToContactsArray();

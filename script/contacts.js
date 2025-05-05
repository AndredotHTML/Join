// Globale Deklarationen
const DETAIL_ELEM = document.getElementById( "detail" );
const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];


/**
 * checks whether user is logged in or not and redirects to login
 */
function authLogIn () {
    if ( localStorage.getItem( "isLoggedIn" ) !== "true" ) {
        redirectToLogin();
    }
}


/**
 * redirects user to login
 */
function redirectToLogin () {
    location.href = "index.html";
}


function findContactById ( contactId ) {
    return contacts.find( contact => contact.id === contactId );
}

function renderDetailPanel ( selectedContact ) {
    DETAIL_ELEM.innerHTML = contactDetailTemplate( selectedContact );
}

function addDeleteListener ( contactId ) {
    const btn = DETAIL_ELEM.querySelector( '#btn-delete' );
    if ( btn ) btn.addEventListener( 'click', () => deleteContact( contactId ) );
}

// Aktualisiert das Detail-Panel mit den Daten des ausgewählten Kontakts
function updateDetailPanel ( contactId ) {
    const selectedContact = findContactById( contactId );
    if ( !selectedContact ) return;
    renderDetailPanel( selectedContact );
    addDeleteListener( selectedContact.id );
}

function toggleDetailPanel () {
    DETAIL_ELEM.classList.toggle( 'open' );
    DETAIL_ELEM.classList.toggle( 'slide_in' );
}

function isContactSelected ( elem ) {
    return elem.classList.contains( 'selected' );
}

function selectContact ( elem ) {
    elem.classList.add( 'selected' );
}

function deselectContact ( elem ) {
    elem.classList.remove( 'selected' );
}

function deselectAllContacts () {
    document.querySelectorAll( '.contact' ).forEach( deselectContact );
}

function ensureDetailPanelOpen () {
    if ( !DETAIL_ELEM.classList.contains( 'open' ) ) toggleDetailPanel();
}
function ensureDetailPanelClosed () {
    if ( DETAIL_ELEM.classList.contains( 'open' ) ) toggleDetailPanel();
}


function handleContactClick ( event ) {
    const elem = event.currentTarget;
    if ( isContactSelected( elem ) ) {
        deselectContact( elem );
        ensureDetailPanelClosed();
    } else {
        deselectAllContacts();
        selectContact( elem );
        updateDetailPanel( elem.id );
        ensureDetailPanelOpen();
    }
}

function getOverlay ( id ) {
    return document.getElementById( id );
}

function showEditContactOverlay ( contactId ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = 'flex';
    const editOverlay = document.getElementById( "editOverlay" );
    const selectedContact = contacts.find( contact => contact.id === contactId );
    if ( !selectedContact ) return;
    editOverlay.innerHTML = createEditContactTemplate( selectedContact );
    editOverlay.classList.add( "active" );
}

function showOverlay ( elem, html ) {
    elem.innerHTML = html;
    elem.style.display = 'flex';
    elem.classList.add( 'slide_in' );
}
function hideOverlay ( elem, resetId = false ) {
    elem.style.display = '';
    elem.classList.remove( 'slide_in', 'show', 'slide_in_left' );
    if ( resetId ) elem.innerHTML = '';
}

function showAddContactOverlay () {
    showOverlay( getOverlay( 'overlay-bg' ), '' );
    showOverlay( getOverlay( 'overlay-add-contact' ), createAddContactTemplate() );
}

function closeEditOverlay ( event ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = '';
    const editOverlay = document.getElementById( "editOverlay" );
    if ( !event || event.target === editOverlay || event.target.closest( ".btn-close" ) ) {
        editOverlay.classList.remove( "active" );
        setTimeout( () => {
            editOverlay.innerHTML = "";
        }, 300 );
    }
}


function closeOverlay ( event ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.style.display = '';
    let overlay = document.getElementById( 'overlay-add-contact' );
    if ( !event || event.target === overlay || event.target.closest( ".close-btn" ) ) {
        overlay.classList.remove( 'show', 'slide_in', 'slide_in_left' );
        overlay.style.display = 'none';
    }
}


/**
 * Liest das Formular aus, validiert nativ und legt den Kontakt an.
 * @param {Event} event
 * @returns {boolean} false verhindert Reload
 */
/**
 * Erfasst und validiert das Add-Form, weist eine zufällige Farbe zu und speichert den Kontakt.
 * @param {SubmitEvent} event
 * @returns {boolean} false verhindert Reload
 */
function getContactData ( event ) {
    // 1. Standard-Submit unterbinden
    event.preventDefault();

    // 2. Native HTML5-Validation
    const form = document.getElementById( 'add_contact_form' );
    if ( !form.checkValidity() ) {
        form.reportValidity();
        return false;  // Abbruch: Formular ungültig
    }

    // 3. Felddaten auslesen
    const { name, email, phone } = getContactFormData();

    // 4. Zufällige Farb-Klasse ermitteln
    const avatarColorClass = getRandomColorClass();

    // 5. POST in Firebase (inkl. avatarColorClass)
    postContactData( '/contacts', {
        name,
        email,
        phone,
        avatarColorClass
    } );

    // 6. Kurze Erfolgsmeldung anzeigen
    toggleMessage();

    // 7. Kein Reload
    return false;
}

/**
 * Liest Namen, E-Mail und Telefon vom Add-Form aus und gibt ein Objekt zurück.
 * @returns {{name: string, email: string, phone: string}}
 */
function getContactFormData () {
    const name = document.getElementById( 'name' ).value.trim();
    const email = document.getElementById( 'email' ).value.trim();
    const phone = document.getElementById( 'phone' ).value.trim();
    return { name, email, phone };
}


/**
 * Fügt einen neuen Eintrag unter dem angegebenen Pfad hinzu
 * und lädt anschließend die Kontaktliste neu.
 *
 * @param {string} path - Der Endpunkt in deiner Realtime-DB (z.B. "/contacts")
 * @param {object} data - Ein Objekt mit name, email, phone und avatarColorClass
 */
async function postContactData ( path = "", data = {} ) {
    try {
        await fetch( BASE_URL + path + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( data )
        } );
        // Nach dem Schreiben direkt die lokale Liste updaten
        await pushToContactsArray();
    } catch ( err ) {
        console.error( "Fehler beim Speichern des Kontakts:", err );
    }
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
    // const colors = [ '#f57c00', '#8e24aa', '#5c6bc0', '#f48fb1', '#ffb300', '#26a69a' ];
    const colors = [ '#6E52FF', '#FFA35E', '#FFE62B', '#00BEE8', '#FF5EB3', '#FFBB2B', '#FF745E', '#C3FF2B', '#FF7A00', '#1FD7C1', '#0038FF', '#FFC701', '#9327FF', '#FC71FF', '#FF4646' ];
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

function getRandomColorClass () {
    // Math.random() liefert 0 ≤ x < 1
    // Multipliziert mit 15 → 0 ≤ x < 15
    // floor + 1 → Ganzzahl 1…15
    const number = Math.floor( Math.random() * 15 ) + 1;
    return `avatar-color-${ number }`;
}


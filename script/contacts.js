// Globale Deklarationen
const DETAIL_ELEM = document.getElementById( "detail" );
let contacts = [];


/**
 * searches for contact in the contact array using the Id
 * @param {string} contactId
 * @return {object|undefined} 
 */
function findContactById ( contactId ) {
    let contact = contacts.find( contact => contact.id === contactId );
    return contact;
}


/**
 * shows details of the selected contact
 * @param {object} selectedContact
 */
function renderDetailPanel ( selectedContact ) {
    DETAIL_ELEM.innerHTML = contactDetailTemplate( selectedContact );
}

/**
 * Adds an event to the delete button
 * @param {string} contactId
 */
function addDeleteListener ( contactId ) {
    const DELETE_BTN = document.getElementById( "btn-delete" );
    DELETE_BTN.addEventListener( 'click', () => deleteContact( contactId ) );
}


/**
 * Updates the detail panel with the data of the selected contact
 * @param {string} contactId
 */
function updateDetailPanel ( contactId ) {
    const selectedContact = findContactById( contactId );
    renderDetailPanel( selectedContact );
    addDeleteListener( selectedContact.id );
}


/**
 * shows or hides detail panel
 */
function toggleDetailPanel () {
    DETAIL_ELEM.classList.toggle( "slide-in" );
}


/**
 * Checks whether contact is selected
 * @param {HTMLElement} contact
 * @return {boolean} 
 */
function isContactSelected ( contact ) {
    return contact.classList.contains( "selected" );
}


/**
 * Adds the highlighting to the selected contact
 * @param {HTMLElement} contact
 */
function selectContact ( contact ) {
    contact.classList.add( "selected" );
}

/**
 * Removes highlighting on the selected contact
 * @param {HTMLElement} contact
 */
function deselectContact ( contact ) {
    contact.classList.remove( "selected" );
}


/**
 * Removes the selected class from all contacts
 */
function deselectAllContacts () {
    let concatList = document.querySelectorAll( ".contact" );
    concatList.forEach( deselectContact );
}


/**
 * fades in detail panel
 */
function ensureDetailPanelOpen () {
    if ( !DETAIL_ELEM.classList.contains( "slide-in" ) ) {
        toggleDetailPanel();
    }
}


/**
 * fades out detail panel
 */
function ensureDetailPanelClosed () {
    if ( DETAIL_ELEM.classList.contains( "slide-in" ) ) {
        toggleDetailPanel();
    }
}


/**
 * intercepts the click event and opens or closes the detail panel
 * @param {Event} event
 */
function handleContactClick ( event ) {
    const contactElem = event.currentTarget;
    if ( isContactSelected( contactElem ) ) {
        closeDetailPanel( contactElem );
    } else {
        deselectAllContacts();
        openDetailPanel( contactElem );
    }
}


/**
 * closes detail panel
 * @param {HTMLElement} contactElem
 */
function closeDetailPanel ( contactElem ) {
    deselectContact( contactElem );
    ensureDetailPanelClosed();
}


/**
 * opens detail panel
 * @param {HTMLElement} contactElem
 */
function openDetailPanel ( contactElem ) {
    selectContact( contactElem );
    updateDetailPanel( contactElem.id );
    ensureDetailPanelOpen();
}


function getOverlay ( id ) {
    return document.getElementById( id );
}

function showEditContactOverlay ( contactId ) {
    const SELECTED_CONTACT = contacts.find( contact => contact.id === contactId );
    const EDIT_OVERLAY = document.getElementById( "editOverlay" );
    const OVERLAY_BG = document.getElementById( "overlay-bg" );
    OVERLAY_BG.classList.add( "d-flex" );
    EDIT_OVERLAY.innerHTML = createEditContactTemplate( SELECTED_CONTACT );
    EDIT_OVERLAY.classList.add( "slide-in" );
}

function hideOverlay ( elem, resetId = false ) {
    elem.style.display = '';
    elem.classList.remove( 'slide-in', 'show', 'slide_in_left' );
    if ( resetId ) elem.innerHTML = '';
}

function showAddContactOverlay () {
    const EDIT_OVERLAY = document.getElementById( "overlay-add-contact" );
    const OVERLAY_BG = document.getElementById( "overlay-bg" );
    OVERLAY_BG.classList.add( "d-flex" );
    EDIT_OVERLAY.innerHTML = createAddContactTemplate();
    EDIT_OVERLAY.classList.add( "slide-in" );
}


function closeEditOverlay ( event ) {
    const editOverlay = document.getElementById( "editOverlay" );
    let overlayBackground = document.getElementById( "overlay-bg" );
    overlayBackground.classList.remove( "d-flex" );
    if ( event.target.closest( ".btn-close" ) ) {
        editOverlay.classList.remove( "slide-in" );
    }
}


function closeOverlay ( event ) {
    let overlayBackground = document.getElementById( "overlay-bg" );
    let overlay = document.getElementById( 'overlay-add-contact' );
    overlayBackground.classList.remove( "d-flex" );
    if ( !event || event.target === overlay || event.target.closest( ".close-btn" ) ) {
        overlay.classList.remove( 'show', 'slide-in', 'slide_in_left' );
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


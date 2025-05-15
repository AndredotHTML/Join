// Globale Deklarationen
const DETAIL_ELEM = document.getElementById( 'detail' );
let contacts = [];


function findContactById ( contactId ) {
    let contact = contacts.find( contact => contact.id === contactId );
    return contact;
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
 * Checks the add-contact form’s HTML5 validity, reports any validation errors, and returns the result.
 *
 * @returns {boolean} True if the form is valid; otherwise false.
 */
function validateForm () {
    const form = document.getElementById( 'add_contact_form' );
    if ( !form.checkValidity() ) {
        form.reportValidity();
        return false;
    }
    return true;
}


/**
 * Extracts contact form fields and appends a randomly generated avatar color class.
 * @returns {{name: string, email: string, phone: string, avatarColorClass: string}} The contact data with avatar color.
 */
function extractFormData () {
    const { name, email, phone } = getContactFormData();
    return { name, email, phone, avatarColorClass: getRandomColorClass() };
}


/**
 * Delegates sending contact data to postContactData and returns the new contact ID.
 * @async
 * @param {string} url - The endpoint path.
 * @param {Object} data - The contact data to send.
 * @returns {Promise<string>} The ID of the created contact.
 */
async function sendContactData ( url, data ) {
    return await postContactData( url, data );
}


/**
 * Liest Namen, E-Mail und Telefon vom Add-Form aus und gibt ein Objekt zurück.
 * @returns {{name: string, email: string, phone: string}}
 */
function getContactFormData () {
    const NAME = document.getElementById( 'name' ).value.trim();
    const EMAIL = document.getElementById( 'email' ).value.trim();
    const PHONE = document.getElementById( 'phone' ).value.trim();
    return { name: NAME, email: EMAIL, phone: PHONE };
}


/**
 * Sends contact data via POST, refreshes the local contacts array, and returns the new contact ID.
 * @async
 * @param {string} path – The API endpoint path (without the “.json” suffix).
 * @param {Object} data – The contact data to send.
 * @returns {Promise<string>} The newly generated contact ID.
 */
async function postContactData ( path = "", data = {} ) {
    try {
        const RESPONSE = await fetch( BASE_URL + path + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( data )
        } );
        const RESULT = await RESPONSE.json();
        const NEW_ID = RESULT.name;
        await pushToContactsArray();
        return NEW_ID;
    } catch ( err ) { console.error( "Error saving the contact:", err ); }
}


/**
 * Fetches all contacts from the server, rebuilds the local contacts array, and re-renders the contact list.
 * @async
 * @returns {Promise<void>} Resolves once contacts are fetched, the array is updated, and renderContacts() is called.
 */
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


/**
 * Fetches and returns all contacts from the specified API endpoint path.
 * @async
 * @param {string} path – The API endpoint path (without the “.json” suffix).
 * @returns {Promise<Object>} The parsed JSON object of all contacts.
 */
async function getAllContacts ( path ) {
    let response = await fetch( BASE_URL + path + ".json" );
    return await response.json();
}


/**
 * Clears the contacts list container’s inner HTML and returns the element.
 * @returns {HTMLElement} The cleared contacts list element.
 */
function clearContactsList () {
    const contactsListElement = document.querySelector( '.contacts_list' );
    contactsListElement.innerHTML = "";
    return contactsListElement;
}


/**
 * Sorts the contacts array alphabetically by contact name.
 * @param {Array<{contactData: {name: string}}>} contactArray – The array of contacts to sort.
 * @returns {Array<{contactData: {name: string}}>} The sorted contact array.
 */
function sortContacts ( contactArray ) {
    return contactArray.sort( ( contactA, contactB ) =>
        contactA.contactData.name.localeCompare( contactB.contactData.name )
    );
}


/**
 * Groups contacts by the first uppercase letter of their name.
 * @param {Array<{id: string, contactData: {name: string}}>} contactArray – The array of contacts to group.
 * @returns {{ [letter: string]: Array<{id: string, contactData: object}> }} An object mapping each uppercase letter to the array of contacts whose names start with that letter.
 */
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


/**
 * Renders a contact group container with a header for the letter and the provided contacts.
 * @param {string} letter – The uppercase letter for this group.
 * @param {Array<{id: string, contactData: object}>} contactsInGroup – The contacts to include in the group.
 * @returns {HTMLElement} The DOM element representing the contact list group.
 */
function renderGroup ( letter, contactsInGroup ) {
    const groupElement = document.createElement( 'div' );
    groupElement.classList.add( 'contact_list_group' );
    groupElement.innerHTML = headerTemplate( letter ) +
        contactsInGroup.map( contact => contactTemplate( contact ) ).join( '' );
    return groupElement;
}


/**
 * Clears the contacts list, sorts and groups the contacts, and appends each group element to the list container.
 * @returns {void}
 */
function renderContacts () {
    const contactsListElement = clearContactsList();
    const sortedContacts = sortContacts( contacts );
    const groupedContacts = groupContacts( sortedContacts );
    Object.keys( groupedContacts ).sort().forEach( letter => {
        contactsListElement.appendChild( renderGroup( letter, groupedContacts[ letter ] ) );
    } );
}


/**
 * Generates uppercase initials from a full name by taking the first letter of each word.
 * @param {string} name – The full name string.
 * @returns {string} The concatenated uppercase initials (avatar text).
 */
function getAvatarFromName ( name ) {
    return name.split( " " ).map( word => word.charAt( 0 ).toUpperCase() ).join( "" );
}


/**
 * Retrieves the edited contact’s name, email, and phone values from the form.
 * @returns {{name: string, email: string, phone: string}} The values from the edit form fields.
 */
function getEditFormData () {
    return {
        name: document.getElementById( "edit_name" ).value,
        email: document.getElementById( "edit_email" ).value,
        phone: document.getElementById( "edit_phone" ).value
    };
}


/**
 * Sends a PATCH request to update the specified contact’s data on the server.
 * @async
 * @param {string} contactId – The ID of the contact to update.
 * @param {Object} data – An object containing the contact fields to patch.
 * @returns {Promise<void>} Resolves when the update request completes.
 */
async function patchContactData ( contactId, data ) {
    await fetch( `${ BASE_URL }/contacts/${ contactId }.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( data )
    } );
}


/**
 * Deletes a contact by ID via API call, refreshes the contacts list, and clears the detail panel.
 * @async
 * @param {string} contactId – The ID of the contact to delete.
 * @returns {Promise<void>} Resolves once deletion is complete and UI has been updated.
 */
async function deleteContact ( contactId ) {
    await fetch( BASE_URL + "/contacts/" + contactId + ".json", {
        method: "DELETE"
    } );
    pushToContactsArray();
    DETAIL_ELEM.innerHTML = "";
    ensureDetailPanelClosed();
}


/**
 * Determines an avatar color hex code by mapping the first letter of the name to a predefined palette.
 * @param {string} name – The contact’s full name.
 * @returns {string} The hex color code selected for the contact.
 */
function getColorForContact ( name ) {
    const colors = [ '#6E52FF', '#FFA35E', '#FFE62B', '#00BEE8', '#FF5EB3', '#FFBB2B', '#FF745E', '#C3FF2B', '#FF7A00', '#1FD7C1', '#0038FF', '#FFC701', '#9327FF', '#FC71FF', '#FF4646' ];
    let firstLetter = name.charAt( 0 ).toUpperCase();
    let index = firstLetter.charCodeAt( 0 ) % colors.length;
    return colors[ index ];
}


/**
 * Refreshes the contacts list, selects the contact element by ID, updates its detail panel, and opens it.
 * @async
 * @param {string} contactId – The ID of the contact to select.
 * @returns {Promise<void>} Resolves after contacts are refreshed and the contact is selected.
 */
async function refreshAndSelect ( contactId ) {
    await pushToContactsArray();
    const contact = document.getElementById( contactId );
    if ( contact ) {
        contact.classList.add( "selected" );
        updateDetailPanel( contactId );
        ensureDetailPanelOpen();
    }
}


/**
 * Generates a random avatar color class name in the format 'avatar-color-{1–15}'.
 * @returns {string} The randomly selected avatar color CSS class.
 */
function getRandomColorClass () {
    const number = Math.floor( Math.random() * 15 ) + 1;
    return `avatar-color-${ number }`;
}


/**
 * Einfache E-Mail-Prüfung
 * @param {string} email
 * @returns {boolean}
 */
function isEmailValid ( email ) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email );
}


/**
 * Telefon muss + vorne, danach nur Ziffern und Leerzeichen
 * @param {string} phone
 * @returns {boolean}
 */
function isPhoneValid ( phone ) {
    return /^\+[0-9 ]+$/.test( phone );
}


/**
 * Sanitizer: entfernt alles außer +, Ziffern und Leerzeichen,
 * behält ein führendes + nur, wenn der Nutzer es eingegeben hat
 * @param {string} value
 * @returns {string}
 */
function sanitizePhone ( value ) {
    // nur Ziffern, Leerzeichen, + zulassen
    let v = value.replace( /[^0-9+ ]/g, '' );
    // Extrahiere führendes +, falls vorhanden
    const leadingPlus = v.startsWith( '+' ) ? '+' : '';
    // entferne alle weiteren +
    v = v.replace( /\+/g, '' );
    // füge das eine führende + zurück (wenn es exisitiert)
    v = leadingPlus + v;
    // max. Länge 20
    return v.slice( 0, 20 );
}


/**
 * Hängt Live-Filter & Keypress-Blocker ans Inputfeld,
 * erlaubt Plus nur wenn Cursor an Pos 0 und Tastendruck '+'
 * @param {string} inputId
 */
function attachPhoneFilter ( inputId ) {
    const input = document.getElementById( inputId );
    if ( !input ) return;
    input.addEventListener( "input", () => {
        input.setCustomValidity( "" );
        input.value = sanitizePhone( input.value );
    } );
    input.addEventListener( "keypress", ( event ) => {
        const key = event.key, value = input.value, pos = input.selectionStart;
        if ( key === "+" ) {
            if ( pos !== 0 || value.startsWith( "+" ) ) event.preventDefault(); return;
        } if ( !( /[0-9 ]/.test( key ) ) ) event.preventDefault();
    } );
}


pushToContactsArray();

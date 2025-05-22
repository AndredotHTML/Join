/**
 * Validates the add-contact form fields for non-empty, correct email, and phone format.
 * @returns {boolean} True if form is valid, false otherwise.
 */
function validateAddForm () {
    const { name, email, phone } = getContactFormData();
    const nameResult = isNameValid( name );
    const emailResult = isEmailValid( email );
    const phoneResult = isPhoneValid( phone );
    return nameResult && emailResult && phoneResult;
}


/**
 * Einfache E-Mail-Prüfung
 * @param {string} email
 * @returns {boolean}
 */
function isEmailValid ( email ) {
    if ( /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test( email ) === false ) {
        document.getElementById( 'email-error-add' ).classList.remove( 'd-none' );
        return false;
    } else {
        document.getElementById( 'email-error-add' ).classList.add( 'd-none' );
        return true;
    }
}


/**
 * Telefon muss + vorne, danach nur Ziffern und Leerzeichen
 * @param {string} phone
 * @returns {boolean}
 */
function isPhoneValid ( phone ) {
    if ( /^\+[0-9 ]+$/.test( phone ) === false ) {
        document.getElementById( 'phone-error-add' ).classList.remove( 'd-none' );
        return false;
    }
    else {
        document.getElementById( 'phone-error-add' ).classList.add( 'd-none' );
        return true;
    }
}


/**
 * Validates that the given name is non-empty, toggles the name error display, and returns the validation result.
 * @param {string} name - The name string to validate.
 * @returns {boolean} True if non-empty; otherwise false.
 */
function isNameValid ( name ) {
    if ( name.length > 0 === false ) {
        document.getElementById( 'name-error-add' ).classList.remove( 'd-none' );
        return false;
    } else {
        document.getElementById( 'name-error-add' ).classList.add( 'd-none' );
        return true;
    }
}


/**
 * Handles the add-contact form submission by validating, sending data, and processing success or error.
 * @param {Event} event - The form submission event.
 * @returns {Promise<boolean>} Always returns false to prevent default form submission.
 */
async function getContactData ( event ) {
    event.preventDefault();
    if ( !validateAddForm() ) return false;
    try {
        const data = extractFormData();
        const newId = await sendContactData( '/contacts', data );
        handleSuccess( newId, event );
    } catch ( error ) {
        handleError( error );
    }
    return false;
}


/**
 * Validates the edit-contact form fields for non-empty, correct email, and phone format.
 * @returns {boolean} True if form is valid, false otherwise.
 */
function validateEditForm () {
    const { name, email, phone } = getEditFormData();
    const nameOK = isNameValidEdit( name );
    const emailOK = isEmailValidEdit( email );
    const phoneOK = isPhoneValidEdit( phone );
    return nameOK && emailOK && phoneOK;
}


/**
 * Validates that the edited name is non-empty, toggles the edit name error display, and returns the validation result.
 * @param {string} name - The name string to validate.
 * @returns {boolean} True if the trimmed name is non-empty; otherwise false.
 */
function isNameValidEdit ( name ) {
    const el = document.getElementById( 'name-error-edit' );
    if ( !name.trim() ) {
        el.classList.remove( 'd-none' );
        return false;
    }
    el.classList.add( 'd-none' );
    return true;
}

/** 
 * Validates that the edited email matches the required pattern, toggles the edit email error display, and returns the validation result.
 * @param { string; } email - The email string to validate.
 * @returns { boolean; } True if the email is valid; otherwise false.
 */
function isEmailValidEdit ( email ) {
    const el = document.getElementById( 'email-error-edit' );
    const ok = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test( email );
    if ( !ok ) {
        el.classList.remove( 'd-none' );
        return false;
    }
    el.classList.add( 'd-none' );
    return true;
}


/**
 * Validates that the edited phone number starts with '+' followed by digits or spaces, toggles the edit phone error display, and returns the validation result.
 * @param {string} phone - The phone number string to validate.
 * @returns {boolean} True if the phone number is valid; otherwise false.
 */
function isPhoneValidEdit ( phone ) {
    const el = document.getElementById( 'phone-error-edit' );
    const ok = /^\+[0-9 ]+$/.test( phone );
    if ( !ok ) {
        el.classList.remove( 'd-none' );
        return false;
    }
    el.classList.add( 'd-none' );
    return true;
}


/**
 * Handles the edit-contact form submission by validating, patching data, and refreshing the UI.
 * @param {string} contactId – The ID of the contact to update.
 * @param {Event} event – The form submission event.
 */
async function updateContact ( contactId, event ) {
    event.preventDefault();
    if ( !validateEditForm() ) return;
    try {
        const { name, email, phone } = getEditFormData();
        await patchContactData( contactId, { name, email, phone } );
        await refreshAndSelect( contactId );
    } catch ( error ) {
        console.error( "Error updating contact:", error );
    }
    closeEditOverlay( event );
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
 * Löscht einen Kontakt und schließt das Edit-Overlay
 * @param {string} contactId 
 * @param {Event} event 
 */
async function handleDeleteContact ( contactId, event ) {
    event.preventDefault();
    try {
        await deleteContact( contactId );
    } catch ( err ) {
        console.error( "Error deleting contact:", err );
    }
    closeEditOverlay( event );
}


/**
 * Logs a contact creation error to the console.
 * @param {Error} err – The error thrown during contact creation.
 */
function handleError ( err ) {
    console.error( 'Contact could not be created:', err );
}


/**
 * Closes the overlay, shows a success message, clears selections, and highlights the new contact.
 * @param {string} newId - The ID of the newly created contact.
 * @param {Event} event - The event that triggered the success handler.
 */
function handleSuccess ( newId, event ) {
    closeOverlay( event );
    toggleMessage();
    deselectAllContacts();
    const contact = document.getElementById( newId );
    if ( contact ) selectAndShowDetail( contact, newId );
}
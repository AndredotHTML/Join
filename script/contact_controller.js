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
    const form = document.getElementById( 'edit_form' ),
        emailInput = document.getElementById( 'edit_email' ),
        phoneInput = document.getElementById( 'edit_phone' );
    emailInput.setCustomValidity( '' ); phoneInput.setCustomValidity( '' );
    if ( !form.checkValidity() ) return form.reportValidity(), false;
    const { email, phone } = getEditFormData();
    if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) )
        return emailInput.setCustomValidity( 'Invalid email address.' ), form.reportValidity(), false;
    if ( !/^\+[0-9 ]+$/.test( phone ) )
        return phoneInput.setCustomValidity( 'Must start with + and contain only digits and spaces.' ), form.reportValidity(), false;
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
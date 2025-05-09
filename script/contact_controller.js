/**
 * Prevents default form submission, validates input, sends contact data, and handles the result.
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<boolean>} Always returns false to block default submission.
 */
async function getContactData ( event ) {
    event.preventDefault();
    if ( !validateForm() ) return false;
    const contactData = extractFormData();
    try {
        const newId = await sendContactData( '/contacts', contactData );
        handleSuccess( newId, event );
    } catch ( err ) {
        handleError( err );
    }
    return false;
}


/**
 * Prevents default submission, updates the contact via PATCH, refreshes and selects it, handles errors, and closes the edit overlay.
 * @async
 * @param {string} contactId – The ID of the contact to update.
 * @param {Event} event – The form submission event triggering the update.
 * @returns {Promise<void>} Resolves once the update and UI actions complete.
 */
async function updateContact ( contactId, event ) {
    event.preventDefault();
    try {
        await patchContactData( contactId, getEditFormData() );
        await refreshAndSelect( contactId );
    } catch ( err ) {
        console.error( "Error updating contact:", err );
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
/**
 * Prevents default form submission, validates input, sends contact data, and handles the result.
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<boolean>} Always returns false to block default submission.
 */
async function getContactData ( event ) {
    event.preventDefault();
    const form = document.getElementById( 'add_contact_form' );

    // Setze custom validity zurück
    const phoneInput = document.getElementById( 'phone' );
    const emailInput = document.getElementById( 'email' );
    phoneInput.setCustomValidity( '' );
    emailInput.setCustomValidity( '' );

    // HTML5-Basics
    if ( !form.checkValidity() ) {
        form.reportValidity();
        return false;
    }

    // Zusätzliche Prüfungen
    const { name, email, phone } = getContactFormData();
    if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) ) {
        emailInput.setCustomValidity( 'Ungültige E-Mail-Adresse.' );
        form.reportValidity();
        return false;
    }
    if ( !/^\+[0-9 ]+$/.test( phone ) ) {
        phoneInput.setCustomValidity( 'Muss mit + beginnen, danach nur Ziffern und Leerzeichen.' );
        form.reportValidity();
        return false;
    }

    // Alles ok → senden
    try {
        const data = extractFormData();
        const newId = await sendContactData( '/contacts', data );
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
    const form = document.getElementById( 'edit_form' );

    // Reset Validity
    const phoneInput = document.getElementById( 'edit_phone' );
    const emailInput = document.getElementById( 'edit_email' );
    phoneInput.setCustomValidity( '' );
    emailInput.setCustomValidity( '' );

    // HTML5-Basics
    if ( !form.checkValidity() ) {
        form.reportValidity();
        return;
    }

    // Zusätzliche Prüfungen
    const { name, email, phone } = getEditFormData();
    if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) ) {
        emailInput.setCustomValidity( 'Ungültige E-Mail-Adresse.' );
        form.reportValidity();
        return;
    }
    if ( !/^\+[0-9 ]+$/.test( phone ) ) {
        phoneInput.setCustomValidity( 'Muss mit + beginnen, danach nur Ziffern und Leerzeichen.' );
        form.reportValidity();
        return;
    }

    // Alles ok → patchen
    try {
        await patchContactData( contactId, { name, email, phone } );
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
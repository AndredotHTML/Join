let overlayBackground = document.getElementById( "overlay-bg" );



/**
 * Displays the edit overlay populated with the specified contact’s data and slides it into view.
 * @param {string} contactId – The ID of the contact to edit.
 */
function showEditContactOverlay ( contactId ) {
    const sel = findContactById( contactId );
    const editO = document.getElementById( "editOverlay" );
    overlayBackground.classList.add( "d-flex" );
    editO.innerHTML = createEditContactTemplate( sel );
    editO.classList.add( "slide-in" );
    attachPhoneFilter( 'edit_phone' );
}


/**
 * Closes the edit overlay by hiding the background and removing the slide-in animation.
 * @param {Event} event – The event that triggered the overlay close.
 */
function closeEditOverlay ( event ) {
    const editOverlay = document.getElementById( "editOverlay" );
    overlayBackground.classList.remove( "d-flex" );
    let btn = event.target;
    if ( btn ) {
        editOverlay.classList.remove( "slide-in" );
    }
}


/**
 * Displays the add-contact overlay by showing the background, injecting the add form template, and sliding it into view.
 */
function showAddContactOverlay () {
    const addO = document.getElementById( "overlay-add-contact" );
    overlayBackground.classList.add( "d-flex" );
    addO.innerHTML = createAddContactTemplate();
    addO.classList.add( "slide-in" );
    attachPhoneFilter( 'phone' );
}


/**
 * Hides the add-contact overlay by removing the background display and slide-in class.
 * @param {Event} event – The event that triggered the overlay close.
 */
function closeOverlay ( event ) {
    let overlay = document.getElementById( 'overlay-add-contact' );
    overlayBackground.classList.remove( "d-flex" );
    let btn = event.target;
    if ( btn ) {
        overlay.classList.remove( 'slide-in' );
    }
}


/**
 * Closes all overlay panels by hiding the background and removing any slide-in classes.
 */
function closeAll () {
    let editOverlay = document.getElementById( "editOverlay" );
    let overlay = document.getElementById( 'overlay-add-contact' );
    overlayBackground.classList.remove( "d-flex" );
    overlay.classList.remove( 'slide-in' );
    editOverlay.classList.remove( "slide-in" );
}


/**
 * Displays the success notification by adding the 'overly-move-up' class.
 */
function showMessage () {
    let messageElem = document.getElementById( "contact-successfully-created" );
    messageElem?.classList.add( "overly-move-up" );
}


/**
 * Hides the success notification by removing the 'overly-move-up' class.
 */
function hideMessage () {
    let messageElem = document.getElementById( "contact-successfully-created" );
    messageElem?.classList.remove( "overly-move-up" );
}


/**
 * Shows the success notification and hides it after 800 ms.
 */
function toggleMessage () {
    showMessage();
    setTimeout( hideMessage, 800 );
}
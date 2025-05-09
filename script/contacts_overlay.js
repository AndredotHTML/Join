/**
 * Displays the edit overlay populated with the specified contact’s data and slides it into view.
 * @param {string} contactId – The ID of the contact to edit.
 */
function showEditContactOverlay ( contactId ) {
    const SELECTED_CONTACT = contacts.find( contact => contact.id === contactId );
    const EDIT_OVERLAY = document.getElementById( "editOverlay" );
    const OVERLAY_BG = document.getElementById( "overlay-bg" );
    OVERLAY_BG.classList.add( "d-flex" );
    EDIT_OVERLAY.innerHTML = createEditContactTemplate( SELECTED_CONTACT );
    EDIT_OVERLAY.classList.add( "slide-in" );
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
    const EDIT_OVERLAY = document.getElementById( "overlay-add-contact" );
    const OVERLAY_BG = document.getElementById( "overlay-bg" );
    OVERLAY_BG.classList.add( "d-flex" );
    EDIT_OVERLAY.innerHTML = createAddContactTemplate();
    EDIT_OVERLAY.classList.add( "slide-in" );
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
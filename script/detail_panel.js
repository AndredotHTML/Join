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
 * shows details of the selected contact
 * @param {object} selectedContact
 */
function renderDetailPanel ( selectedContact ) {
    DETAIL_ELEM.innerHTML = contactDetailTemplate( selectedContact );
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
 * opens detail panel
 * @param {HTMLElement} contactElem
 */
function openDetailPanel ( contactElem ) {
    selectContact( contactElem );
    updateDetailPanel( contactElem.id );
    ensureDetailPanelOpen();
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
 * Selects the contact element, updates its detail panel with the given ID, and opens the panel.
 * @param {HTMLElement} contact – The contact element to select.
 * @param {string} id – The ID of the contact whose details to display.
 */
function selectAndShowDetail ( contact, id ) {
    selectContact( contact );
    updateDetailPanel( id );
    ensureDetailPanelOpen();
}


function CloseDetailPanel () {
    deselectAllContacts();
    ensureDetailPanelClosed();
}


function showActionsOverlay () {
    const OOVERLAY = document.getElementById( "contact-actions" );
    const ACTION_BTN = document.getElementById( "detail-actions" );
    OOVERLAY.classList.add( "actions-show" );
    ACTION_BTN.classList.add( "d-none" );
}


function hideActionsOverlay ( event ) {
    console.log( event.target.id );

    if ( event.target.id === "detail" ) {
        const OOVERLAY = document.getElementById( "contact-actions" );
        const ACTION_BTN = document.getElementById( "detail-actions" );
        OOVERLAY.classList.remove( "actions-show" );
        ACTION_BTN.classList.remove( "d-none" );
    }
}
/**
 * Generates the contact detail HTML for the provided contact object.
 * @param {{id: string, contactData: object}} selectedContact – The contact to display details for.
 * @returns {string} The HTML template string for the contact detail view.
 */
function contactDetailTemplate ( selectedContact ) {
  const initials = getAvatarFromName( selectedContact.contactData.name );
  const cls = selectedContact.contactData.avatarColorClass; // z.B. "avatar-color-7"

  return `
    <div class="contact-header">
      <div class="circle-wrapper">
        <div class="outer-circle"></div>
        <div class="inner-circle ${ cls }">
          ${ initials }
        </div>
      </div>
      <div class="contact-main-info">
        <h2 class="contact-name">${ selectedContact.contactData.name }</h2>
        <div class="contact-actions" id="contact-actions">
          <button class="contact-action" onclick="showEditContactOverlay('${ selectedContact.id }')">
            <span class="btn-edit">Edit</span>
          </button>
          <button class="contact-action" id="btn-delete">
            <span class="btn-delete">Delete</span>
          </button>
        </div>
      </div>
    </div>
      <div class="contact-title-row">
        <h3>Contact Information</h3>
        <a href="#" onclick="CloseDetailPanel()" class="arrow-left"></a>
      </div>
    <div class="contact-detail-section">
      <div class="contact-field">
        <p class="label">Email</p>
        <a href="mailto:${ selectedContact.contactData.email }" class="email-link">${ selectedContact.contactData.email }</a>
      </div>
      <div class="contact-field">
        <p class="label">Phone</p>
        <p>${ selectedContact.contactData.phone }</p>
      </div>
    </div>
    <button id="detail-actions" class="btn btn-primary btn-detail-actions" onclick="showActionsOverlay()">
      <img src="../assets/icons/options_dot_white.svg" alt="""> 
    </button
    `;
}

/**
 * Returns the HTML template string for the add-contact overlay panel.
 */
function createAddContactTemplate () {
  return ( /*html*/ `
<div class="overlay-header overlay-add-contact-header">
  <button class="btn-close" onclick="closeOverlay(event)"></button>
  <div class="overlay-header-row overlay-header-row-center header-logo">
    <img class="overlay-header-logo" src="../assets/icons/logo.svg" alt="Logo">
  </div>
  <div class="overlay-header-row overlay-header-row-center direction-column">
    <h1 class="overlay-header-headline">Add contact</h1>
    <span class="sub-headline">Tasks are better with a team!</span>
  </div>
</div>
<div class="overlay-content">
  <div class="overlay-profile-sec">
    <div class="circle-wrapper">
        <div class="outer-circle"></div>
        <div class="inner-circle circle-add-contact">
           <img src="../assets/icons/person-white.svg" alt="person">
        </div>
      </div>
  </div>
  <form id="add_contact_form" onsubmit="return getContactData(event)" novalidate>
    <div class="input_container">
      <input required id="name" type="text" placeholder="Name" class="input-person" maxlength="50">
      <div id="name-error-add" class="error-message d-none">Field must not be empty.</div>
    </div>
    <div class="input_container">
      <input required id="email" type="email" placeholder="Email" class="input-email" maxlength="255" title="Please enter a valid e-mail address (e.g. name@domain.tld).">
      <div id="email-error-add" class="error-message d-none">Missing or incorrect e-mail address.</div>
    </div>
    <div class="input_container">
      <input required id="phone" type="tel" placeholder="Phone" class="input-call" maxlength="20">
      <div id="phone-error-add" class="error-message d-none">The field is empty or does not begin with a "+".</div>
    </div>
    <div class="overlay-footer">
      <button type="button" class="btn btn-secondary btn-cancel" onclick="closeOverlay(event)">
        <span>Cancel</span>
      </button>
      <button id="add-contact-save-btn" class="btn btn-primary btn-check" type="submit">
        <span>Create contact</span>
      </button>
    </div>
  </form
>
</div>`
  );
}


/**
 * Returns the HTML template for the edit-contact overlay populated with the given contact’s data.
 * @param {{id: string, contactData: object}} selectedContact – The contact to edit.
 * @returns {string} The HTML template string for the edit overlay.
 */
function createEditContactTemplate ( selectedContact ) {
  const initials = getAvatarFromName( selectedContact.contactData.name );
  const cls = selectedContact.contactData.avatarColorClass; // z.B. "avatar-color-7"
  return /*html*/ `
<div class="overlay-header">
  <button class="btn-close" onclick="closeEditOverlay(event)"></button>
  <div class="overlay-header-row overlay-header-row-center header-logo">
    <img class="overlay-header-logo" src="../assets/icons/logo.svg" alt="Logo">
  </div>
  <div class="overlay-header-row overlay-header-row-center">
    <h1 class="overlay-header-headline">Edit contact</h1>
  </div>
</div>
<div class="overlay-content">
  <div class="overlay-profile-sec">
    <!-- Hier wird jetzt die Farb-Klasse angewendet -->
    <div class="contact-circle ${ cls }">
      ${ initials }
    </div>
  </div>
  <form id="edit_form" onsubmit="updateContact('${ selectedContact.id }'); return false">
    <div class="input_container">
      <input required id="edit_name" type="text" placeholder="Name"
             value="${ selectedContact.contactData.name }"
             class="input-person" maxlength="50">
    </div>
    <div class="input_container">
      <input required id="edit_email" type="email" placeholder="Email"
             value="${ selectedContact.contactData.email }"
             class="input-email" maxlength="255" title="Please enter a valid e-mail address (e.g. name@domain.tld)." pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$">
    </div>
    <div class="input_container">
      <input required id="edit_phone" type="tel" placeholder="Phone"
             value="${ selectedContact.contactData.phone }"
             class="input-call" maxlength="20">
    </div>
    <div class="overlay-footer">
      <button type="button" class="btn btn-secondary btn-delete"
              onclick="handleDeleteContact ( '${ selectedContact.id }', event )">
        <span>Delete</span>
      </button>
      <button type="button" class="btn btn-primary btn-check"
              onclick="updateContact('${ selectedContact.id }',event)">
        <span>Save</span>
      </button>
    </div>
  </form>
</div>`;
}


/**
 * Generates the HTML for a contact list header with the specified letter.
 *
 * @param {string} letter – The letter to display in the header.
 */
function headerTemplate ( letter ) {
  return `<div class="contact_list_header"><div class="letter-header">${ letter }</div><div class="border_container"><hr class="seperator"></div></div>`;
}


/**
 * Generates the HTML for a contact list item.
 * @param {{id: string, contactData: {name: string, email: string, avatarColorClass: string}}} c – The contact object.
 * @returns {string} The HTML template string for the contact element.
 */
function contactTemplate ( c ) {
  const initials = c.contactData.name
    .split( ' ' )
    .map( w => w.charAt( 0 ).toUpperCase() )
    .join( '' );
  const cls = c.contactData.avatarColorClass; // z.B. "avatar-color-7"

  return `
    <div class="contact" id="${ c.id }" onclick="handleContactClick(event)">
      <div class="avatar ${ cls }">
        ${ initials }
      </div>
      <div class="contact-info">
        <div class="contact-name">${ c.contactData.name }</div>
        <span class="contact-email">${ c.contactData.email }</span>
      </div>
    </div>`;
}


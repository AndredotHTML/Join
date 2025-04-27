function contactDetailTemplate ( selectedContact ) {
  // const avatarColor = getColorForContact( selectedContact.contactData.name );
  return `
    <div class="contact-header">
        <div class="circle-wrapper">
  <div class="outer-circle"></div>
  <div class="inner-circle">
       ${ getAvatarFromName( selectedContact.contactData.name ) }
  </div>
  </div>
      <div class="contact-main-info">
        <h2 class="contact-name">${ selectedContact.contactData.name }</h2>
        <div class="contact-actions">
          <button class="contact-action" onclick="showEditContactOverlay('${ selectedContact.id }')">
            <span class="btn-edit">Edit</span>
          </button>
          <button class="contact-action" id="btn-delete">
            <span class="btn-delete">Delete</span>
          </button>
        </div>
      </div>
    </div>
    <div class="contact-detail-section">
      <h3>Contact Information</h3>
      <div class="contact-field">
        <p class="label">Email</p>
        <a href="mailto:${ selectedContact.contactData.email }" class="email-link">${ selectedContact.contactData.email }</a>
      </div>
      <div class="contact-field">
        <p class="label">Phone</p>
        <p>${ selectedContact.contactData.phone }</p>
      </div>
    </div>
  `;
}

function createAddContactTemplate () {
  return ( /*html*/ `
<div class="overlay-header overlay-add-contact-header">
  <button class="btn-close" onclick="closeOverlay()"></button>
  <div class="overlay-header-row overlay-header-row-center">
    <img class="overlay-header-logo" src="../assets/icons/logo.svg" alt="Logo">
  </div>
  <div class="overlay-header-row overlay-header-row-center direction-column">
    <h1 class="overlay-header-headline">Add contact</h1>
    <span class="sub-headline">Tasks are better with a team!</span>
  </div>
</div>
<div class="overlay-content">
  <div class="overlay-profile-sec">
    <div class="contact-circle" style="display: flex; align-items: center; justify-content: center; color: white;">
      <img src="../assets/icons/person-white.svg" alt="person">
    </div>
  </div>
  <form id="add_contact_form" onsubmit="return getContactData(event)">
    <div class="input_container">
      <input required id="name" type="text" placeholder="Name" class="input-person" maxlength="50">
    </div>
    <div class="input_container">
      <input required id="email" type="email" placeholder="Email" class="input-email" maxlength="255">
    </div>
    <div class="input_container">
      <input required id="phone" type="tel" placeholder="Phone" class="input-call" maxlength="20">
    </div>
    <div class="overlay-footer">
      <button type="button" class="btn btn-secondary btn-cancel" onclick="closeOverlay()">
        <span>Cancel</span>
      </button>
      <button id="edit-task-save-btn" class="btn btn-primary btn-check" type="submit">
        <span>Create contact</span>
      </button>
    </div>
  </form
>
</div>`
  );
}


function createEditContactTemplate ( selectedContact ) {
  // const avatarColor = getColorForContact( selectedContact.contactData.name );
  return ( /*html*/`
<div class="overlay-header">
  <button class="btn-close" onclick="closeEditOverlay(event)"></button>
  <div class="overlay-header-row overlay-header-row-center">
    <img class="overlay-header-logo" src="../assets/icons/logo.svg" alt="Logo">
  </div>
  <div class="overlay-header-row overlay-header-row-center">
    <h1 class="overlay-header-headline">Edit contact</h1>
  </div>
</div>
<div class="overlay-content">
  <div class="overlay-profile-sec">
    <div class="contact-circle">
      ${ getAvatarFromName( selectedContact.contactData.name ) }
    </div>
  </div>
  <form id="edit_form" action="" onsubmit="updateContact(); return false">
    <div class="input_container">
      <input required id="edit_name" type="text" placeholder="Name" value="${ selectedContact.contactData.name }" class="input-person" maxlength="50">
    </div>
    <div class="input_container">
      <input required id="edit_email" type="email" placeholder="Email" value="${ selectedContact.contactData.email }" class="input-email" maxlength="255">
    </div>
    <div class="input_container">
      <input required id="edit_phone" type="tel" placeholder="Phone" value="${ selectedContact.contactData.phone }" class="input-call" maxlength="20">
    </div>
    <div class="overlay-footer">
      <button type="button" class="btn btn-secondary btn-delete" onclick="closeEditOverlay(event)">
        <span>Delete</span>
      </button>
      <button id="edit-task-save-btn" class="btn btn-primary btn-check" type="button" onclick="updateContact('${ selectedContact.id }')">
        <span>Save</span>
      </button>
    </div>
  </form>
</div>`
  );
}

function headerTemplate ( letter ) {
  return `<div class="contact_list_header"><div class="letter-header">${ letter }</div><div class="border_container"><hr class="seperator"></div></div>`;
}

function contactTemplate ( c ) {
  // const avatarColor = getColorForContact( c.contactData.name );
  return `<div class="contact" id="${ c.id }" onclick="handleContactClick(event)">
      <div class="avatar" style="background-color: ${ c.contactData.avatarColor };">
          ${ c.contactData.name.split( ' ' ).map( w => w.charAt( 0 ).toUpperCase() ).join( '' ) }
      </div>
      <div class="contact-info">
          <div class="contact-name">${ c.contactData.name }</div>
          <span class="contact-email">${ c.contactData.email }</span>
      </div>
  </div>`;
}

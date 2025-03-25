// contactsTemplates.js

function contactDetailTemplate ( selectedContact ) {
  const avatarColor = getColorForContact( selectedContact.contactData.name );
  return `
    <div class="contact-header">
      <div class="contact-circle-detail" style="background-color: ${ avatarColor };">
        ${ getAvatarFromName( selectedContact.contactData.name ) }
      </div>
      <div class="contact-main-info">
        <h2 class="contact-name">${ selectedContact.contactData.name }</h2>
        <div class="contact-actions">
          <button class="edit-btn" onclick="showEditContactOverlay('${ selectedContact.id }')">
            <img src="../assets/icons/edit.png" alt="Edit">
            Edit
          </button>
          <button class="delete-btn">
            <img src="../assets/icons/delete.png" alt="Delete">
            Delete
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


function addContactOverlay () {
  return `
    <div class="add_task_overlay">
      <div class="addTask_header_overlay">
        <div class="header_x" onclick="closeOverlay()">
          <img src="../assets/icons/close-white.svg" alt="Close">
        </div>
        <picture class="header-logo-container">
          <img src="../assets/icons/logo.png" alt="Logo">
        </picture>
        <div class="header_headline">
          <h1>Add contact</h1>
          <span>Tasks are better with a team!</span>
        </div>
      </div>
      <div class="addTask_content">
        <div class="contact-overlay-profile-sec">
          <picture class="contact-circle">
            <img src="../assets/icons/person-white.svg" alt="person">
          </picture>
        </div>
        <form id="login_form" action="" onsubmit="login(); return false">
          <div class="input_container">
            <input required id="name" type="text" placeholder="Name">
            <img class="input_icon_email" src="../assets/icons/person.png">
          </div>
          <div class="input_container">
            <input required id="email" type="email" placeholder="Email">
            <img class="input_icon_email" src="../assets/icons/mail.png">
          </div>
          <div class="input_container">
            <input required id="phone" type="tel" placeholder="Phone">
            <img class="input_icon_password" src="../assets/icons/call.svg">
            <p id="error_msg">Check your email and password. Please try again.</p>
          </div>
          <div class="add-task-btns">
            <button class="btn clear-form-btn" onclick="closeOverlay()">
              <span class="btn-title">Cancel</span>
              <span class="btn-icon-shell">
                <img src="../assets/icons/close.png" alt="close">
              </span>
            </button>
            <button id="add-task-create-btn" class="btn add-task-create-btn" type="button" onclick="getContactData()">
              <span class="btn-title">Save</span>
              <span class="btn-icon-shell">
                <img src="../assets/icons/check.svg" alt="">
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function editContactOverlay ( selectedContact ) {
  const avatarColor = getColorForContact( selectedContact.contactData.name );
  return `
    <div class="add_task_overlay">
      <div class="addTask_header_overlay">
        <div class="header_x" onclick="closeOverlay()">
          <img src="../assets/icons/close-white.svg" alt="Close">
        </div>
        <picture class="header-logo-container">
          <img src="../assets/icons/logo.png" alt="Logo">
        </picture>
        <div class="header_headline">
          <h1>Edit contact</h1>
          <span>Update contact details</span>
        </div>
      </div>
      <div class="addTask_content">
        <div class="contact-overlay-profile-sec">
          <div class="contact-circle" style="background-color: ${ avatarColor }; display: flex; align-items: center; justify-content: center; color: white;">
            ${ getAvatarFromName( selectedContact.contactData.name ) }
          </div>
        </div>
        <form id="edit_form" action="" onsubmit="updateContact(); return false">
          <div class="input_container">
            <input required id="edit_name" type="text" placeholder="Name" value="${ selectedContact.contactData.name }">
            <img class="input_icon_email" src="../assets/icons/person.png">
          </div>
          <div class="input_container">
            <input required id="edit_email" type="email" placeholder="Email" value="${ selectedContact.contactData.email }">
            <img class="input_icon_email" src="../assets/icons/mail.png">
          </div>
          <div class="input_container">
            <input required id="edit_phone" type="tel" placeholder="Phone" value="${ selectedContact.contactData.phone }">
            <img class="input_icon_password" src="../assets/icons/call.svg">
            <p id="error_msg">Check your email and password. Please try again.</p>
          </div>
          <div class="add-task-btns">
            <button class="btn clear-form-btn" onclick="closeOverlay()">
              <span class="btn-title">Cancel</span>
              <span class="btn-icon-shell">
                <img src="../assets/icons/close.png" alt="close">
              </span>
            </button>
            <button id="edit-task-save-btn" class="btn add-task-create-btn" type="button" onclick="updateContact('${ selectedContact.id }')">
              <span class="btn-title">Save</span>
              <span class="btn-icon-shell">
                <img src="../assets/icons/check.svg" alt="">
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}



function headerTemplate ( letter ) {
  return `<div class="contact_list_header"><div class="letter-header">${ letter }</div><div class="border_container"><hr class="seperator"></div></div>`;
}

function contactTemplate ( c ) {
  const avatarColor = getColorForContact( c.contactData.name );
  return `<div class="contact" id="${ c.id }">
      <div class="avatar" style="background-color: ${ avatarColor };">
          ${ c.contactData.name.split( ' ' ).map( w => w.charAt( 0 ).toUpperCase() ).join( '' ) }
      </div>
      <div class="contact-info">
          <div class="contact-name">${ c.contactData.name }</div>
          <a href="mailto:${ c.contactData.email }" class="contact-email">${ c.contactData.email }</a>
      </div>
  </div>`;
}



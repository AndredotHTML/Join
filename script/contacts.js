const ALL_cONTACTS_ELEM = document.querySelectorAll( '.contact' );
const DETAIL_ELEM = document.getElementById( 'detail' );
let contacts = [];
const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 *
 * changes selection or highlighting
 * @param {HTMLElement} contact - contact from this
 */
function toggleContactSelection ( contact ) {
    if ( contact.classList.contains( 'selected' ) ) {
        contact.classList.remove( 'selected' );
    } else {
        ALL_cONTACTS_ELEM.forEach( contact => contact.classList.remove( 'selected' ) );
        contact.classList.add( 'selected' );
    }
}

/**
 *  fades detail view in and out
 */
function toggleDetailPanel () {
    if ( DETAIL_ELEM.classList.contains( 'open' ) ) {
        DETAIL_ELEM.classList.remove( 'open', 'slide_in' );
    } else {
        DETAIL_ELEM.classList.add( 'open' );
        DETAIL_ELEM.classList.add( 'slide_in' );
    }
}

ALL_cONTACTS_ELEM.forEach( contact => {
    contact.addEventListener( 'click', function () {
        if ( this.classList.contains( 'selected' ) ) {
            toggleContactSelection( this );
            toggleDetailPanel();
        } else {
            toggleContactSelection( this );
            if ( !DETAIL_ELEM.classList.contains( 'open' ) )
                toggleDetailPanel();
        }
    } );
} );


function showAddTaskOverlay () {
    let overlay = document.getElementById( 'overlay' );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = addTaskOverlay();
    overlay.classList.add( 'slide_in' );
}

function addTaskOverlay () {
    return /*html*/`
            <div  class="add_task_overlay">
                <div class="addTask_header_overlay">
                    <div class="header_x"  onclick="closeOverlay()">
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
                            <img class="input_icon_email" src="/assets/icons/person.png">
                        </div>
                        <div class="input_container">
                            <input required id="email" type="email" placeholder="Email">
                            <img class="input_icon_email" src="/assets/icons/mail.png">
                        </div>
                        <div class="input_container">
                            <input required id="phone" type="tel" placeholder="Phone">
                            <img class="input_icon_password"
                                src="/assets/icons/call.svg">
                            <p id="error_msg">Check your email and password. Please try again.</p>
                        </div>
                        <div class="add-task-btns">
                            <button class="btn clear-form-btn" onclick="closeOverlay()">
                                <span class="btn-title">Cancel</span>
                                <span class="btn-icon-shell">
                                    <img src="../assets/icons/close.png" alt="close">
                                </span>
                            </button>
                            <button id="add-task-create-btn" class="btn add-task-create-btn" form="form-add-task" onclick="setContactData ()"
                            type="button">
                                <span class="btn-title">Save</span>
                                <span class="btn-icon-shell">
                                    <img src="../assets/icons/check.svg" alt="">
                                 </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div> `;
}

function closeOverlay ( event ) {
    let overlay = document.getElementById( 'overlay' );
    if ( !event || event.target === overlay ) {
        overlay.classList.remove( 'show' );
        overlay.classList.remove( 'slide_in' );
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * gets the data from the input values 
 */
function setContactData () {
    let name = document.getElementById( "name" ).value;
    let email = document.getElementById( "email" ).value;
    let phone = document.getElementById( "phone" ).value;
    postContactData( "/contacts", { "name": name, "email": email, "phone": phone } );
}

/**
 * posts the userdata into the Storage API 
 * @param {*} path - is the path where the data will be safed
 * @param {*} data - is the userdata input by the user
 */
async function postContactData ( path = "", data = {} ) {
    await fetch( BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( data )
    } );
    pushToContactsArray();
}

/**
 * pushes the users from the Storage API into a local array [users]
 */
async function pushToContactsArray () {
    let userResponse = await getAllUsers( "/contacts" );
    let userKeysArray = Object.keys( userResponse );
    for ( let index = 0; index < userKeysArray.length; index++ ) {
        contacts.push(
            {
                id: userKeysArray[ index ],
                userData: userResponse[ userKeysArray[ index ] ],
            }
        );
    }
}

/**
 * fetches the userData from the storage API
    * @param {*} path - is the path from where it fetches the data
        */;
async function getAllUsers ( path ) {
    let response = await fetch( BASE_URL + path + ".json" );
    return responseToJson = await response.json();
}
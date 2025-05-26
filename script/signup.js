// signup.js

let users = [];

/**
 * init runs all function which are aquired to run onload of the html
 */
function signupInit () {
    pushToUsersArray();
    toggleSignupButton( "signup_button_activate" );
}

/**
 * toggles the visibility for the password input
 * @param {string} id - id of the password input
 * @param {string} icon - id of the toggle icon
 */
function togglePassword ( id, icon ) {
    const passwordInput = document.getElementById( id );
    const passwordIcon = document.getElementById( icon );
    if ( passwordInput.type === "password" ) {
        passwordInput.type = "text";
        passwordIcon.src = "/assets/icons/visibility.png";
    } else {
        passwordInput.type = "password";
        passwordIcon.src = "/assets/icons/visibility_off.png";
    }
}

/**
 * checks if the password and the confirmed password are equal
 */
function checkPasswords () {
    const password = document.getElementById( "password" );
    const confirmPassword = document.getElementById( "confirm_password" );
    const errorMsg = document.getElementById( "error_msg_password" );

    if ( password.value === confirmPassword.value &&
        password.value !== "" &&
        confirmPassword.value !== "" ) {
        errorMsg.style.display = "none";
        confirmPassword.classList.remove( "error" );
        password.classList.remove( "error" );
        checkEmail();
    } else {
        confirmPassword.classList.add( "error" );
        password.classList.add( "error" );
        errorMsg.style.display = "block";
    }
}

/**
 * enable or disables the button to signup dependig on if the user accepted the privacy policy
 * @param {string} id - id of the button
 */
function toggleSignupButton ( id ) {
    const checkbox = document.getElementById( "signup_checkbox" );
    const btn = document.getElementById( id );
    if ( checkbox.checked ) {
        btn.disabled = false;
        btn.style.pointerEvents = "auto";
    } else {
        btn.disabled = true;
        btn.style.pointerEvents = "none";
    }
}

/**
 * validates the input for name and email and displays error if the input is wrong
 */
function validateForm () {
    const name = document.getElementById( "name" );
    const email = document.getElementById( "email" );
    const errorMsg = document.getElementById( "error_msg" );

    if ( !email.validity.valid || !name.validity.valid ) {
        email.classList.add( "error" );
        name.classList.add( "error" );
        errorMsg.style.display = "block";
    } else {
        email.classList.remove( "error" );
        name.classList.remove( "error" );
        errorMsg.style.display = "none";
    }
}

/**
 * checks if e-mail already exists
 */
async function checkEmail () {
    const emailValue = document.getElementById( "email" ).value;
    const emailElem = document.getElementById( "email" );
    const errorMsg = document.getElementById( "error_msg_email" );

    if (!emailValue.includes(".")) {
    emailElem.classList.add("error");
    errorMsg.textContent = "Please enter a valid email address.";
    errorMsg.style.display = "block";
    return;
    }

    if ( await checkEmailExists( emailValue ) ) {
        emailElem.classList.add( "error" );
        errorMsg.style.display = "block";
    } else {
        emailElem.classList.remove( "error" );
        errorMsg.style.display = "none";
        toggleOverlay();
        getUserData();
        signupRedirectToLogin();
    }
}

/**
 * checks the user array if the email already exists
 */
async function checkEmailExists ( inputMail ) {
    return users.some( u => u.userData.email === inputMail );
}

/**
 * shows the overlay for a succesfull signup for 3 seconds
 */
function toggleOverlay () {
    const overlay = document.getElementById( "signup_overlay" );
    const div = document.getElementById( "signup_msg" );
    overlay.classList.remove( "d_none" );
    fadeInDiv( div );
    setTimeout( () => {
        overlay.classList.add( "d_none" );
        div.classList.remove( "show" );
    }, 3000 );
}

/**
 * animation for the Overlay
 */
function fadeInDiv ( div ) {
    div.classList.add( "show" );
}

/**
 * gets the data from the user inputs in the sigup form
 */
function getUserData () {
    const name = document.getElementById( "name" ).value;
    const email = document.getElementById( "email" ).value;
    const password = document.getElementById( "password" ).value;
    postUserData( "/users", { name, email, password } );
}

/**
 * saves new users in the API and merges them with the contacts after
 */
async function postUserData ( path = "", data = {} ) {
    await fetch( BASE_URL + path + ".json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( data )
    } );
    await pushToUsersArray();
    await mergeUsersToContacts();
}

/**
 * gets all users from the API
 */
async function getAllUsers ( path ) {
    const res = await fetch( BASE_URL + path + ".json" );
    return ( await res.json() ) || {};
}

/**
 * pushes all users to the local user-array
 */
async function pushToUsersArray () {
    const userResponse = await getAllUsers( "/users" );
    users = [];
    for ( const key of Object.keys( userResponse ) ) {
        users.push( {
            id: key,
            userData: userResponse[ key ]
        } );
    }
}

/**
 * gets all current Contacts
 */
async function getAllContacts () {
    const res = await fetch( BASE_URL + "/contacts.json" );
    return ( await res.json() ) || {};
}

/**
 * adds all users to contacts
 */
async function mergeUsersToContacts () {
    const contactsObj = await getAllContacts();
    const existingEmails = new Set(
        Object.values( contactsObj ).map( c => c.email )
    );

    for ( const { userData } of users ) {
        const { name, email } = userData;
        if ( !existingEmails.has( email ) ) {
            const avatarColorClass = getRandomColorClass();
            await fetch( BASE_URL + "/contacts.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( {
                    name,
                    email,
                    phone: "",  // beim Signup kein Telefon vorhanden
                    avatarColorClass
                } )
            } );
        }
    }
}

/**
 * redirects after sucessfull signup back to login
 */
function signupRedirectToLogin () {
    setTimeout( () => {
        location.href = "../index.html";
    }, 3000 );
}

/**
 * generates a random  number between 1 and 15 and adds a css class
 */
function getRandomColorClass () {
    const idx = Math.floor( Math.random() * 15 ) + 1;
    return `avatar-color-${ idx }`;
}

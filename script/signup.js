// signup.js

let users = [];
const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initialisierung beim Laden der Signup-Seite
 */
function signupInit () {
    pushToUsersArray();
    toggleSignupButton( "signup_button_activate" );
}

/**
 * toggles the visibility for the password input
 * @param {string} id - ID des Password-Felds
 * @param {string} icon - ID des Toggle-Icons
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
 * vergleicht Passwort und Confirm-Passwort auf Gleichheit
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
        checkEmail();
    } else {
        confirmPassword.classList.add( "error" );
        errorMsg.style.display = "block";
    }
}

/**
 * aktiviert/deaktiviert Signup-Button je nach Checkbox
 * @param {string} id - ID des Buttons
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
 * Validiert Name und E-Mail im Signup-Form
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
 * prüft, ob E-Mail schon registriert ist
 */
async function checkEmail () {
    const emailValue = document.getElementById( "email" ).value;
    const emailElem = document.getElementById( "email" );
    const errorMsg = document.getElementById( "error_msg_email" );

    if ( await checkEmailExists( emailValue ) ) {
        emailElem.classList.add( "error" );
        errorMsg.style.display = "block";
    } else {
        emailElem.classList.remove( "error" );
        errorMsg.style.display = "none";
        toggleOverlay();
        getUserData();
        redirectToLogin();
    }
}

/**
 * durchsucht das lokale users-Array nach E-Mail
 */
async function checkEmailExists ( inputMail ) {
    return users.some( u => u.userData.email === inputMail );
}

/**
 * zeigt Overlay „Erfolgreich registriert“ für 3s
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
 * animiert das Overlay
 */
function fadeInDiv ( div ) {
    div.classList.add( "show" );
}

/**
 * holt Werte aus dem Signup-Form
 */
function getUserData () {
    const name = document.getElementById( "name" ).value;
    const email = document.getElementById( "email" ).value;
    const password = document.getElementById( "password" ).value;
    postUserData( "/users", { name, email, password } );
}

/**
 * speichert neuen User und synchronisiert anschließend mit Contacts
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
 * holt alle User aus Firebase
 */
async function getAllUsers ( path ) {
    const res = await fetch( BASE_URL + path + ".json" );
    return ( await res.json() ) || {};
}

/**
 * füllt das lokale users-Array neu
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
 * holt alle bestehenden Kontakte aus Firebase
 */
async function getAllContacts () {
    const res = await fetch( BASE_URL + "/contacts.json" );
    return ( await res.json() ) || {};
}

/**
 * synchronisiert jeden User, der noch kein Kontakt ist,
 * legt fehlende User als neue Kontakte an
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
 * leitet nach erfolgreichem Signup zum Login weiter
 */
function redirectToLogin () {
    setTimeout( () => {
        window.location.href = "/html/login.html";
    }, 3000 );
}

/**
 * erzeugt eine zufällige Zahl 1–15 und gibt die CSS-Klasse zurück
 */
function getRandomColorClass () {
    const idx = Math.floor( Math.random() * 15 ) + 1;
    return `avatar-color-${ idx }`;
}

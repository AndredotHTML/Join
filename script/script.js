const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * checks whether user is logged in or not and redirects to login
 */
function authLogIn () {
    if ( localStorage.getItem( "isLoggedIn" ) !== "true" ) {
        redirectToLogin();
    }
}


/**
 * redirects user to login
 */
function redirectToLogin () {
    location.href = "index.html";
}
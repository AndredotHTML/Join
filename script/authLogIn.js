/**
 * checks whether user is logged in or not and redirects to login
 */
function authLogIn () {
    let isNotLoggedIn = localStorage.getItem( "isLoggedIn" ) !== "true";
    if ( isNotLoggedIn ) {
        redirectToLogin();
    }
}


/**
 * redirects user to login
 */
function redirectToLogin () {
    location.href = "../index.html";
}
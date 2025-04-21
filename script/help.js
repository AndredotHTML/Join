/**
 * Navigates to the previous page, if available.
 * @returns {boolean} `false` to prevent the default behavior.
 */
function goBack () {
    if ( document.referrer ) {
        location.href = document.referrer;
    }
    else {
        history.back();
    }
    return false;
}
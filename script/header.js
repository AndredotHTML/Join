user = [];

async function getCurrentUser () {
    let userData = JSON.parse( localStorage.getItem( 'user' ) );
    if ( userData ) {
        user.push( userData );
        generateUserIcon();
    } else {
        console.log( "Kein Nutzer gefunden." );
    }
}

function generateUserIcon () {
    let userName = user[ 0 ].name;
    let iconContainer = document.getElementById( 'icon-container' );
    let iconWrapper = document.getElementById( 'icon-wrapper' );
    if ( userName ) {
        let initials = userName.split( ' ' )
            .map( word => word.charAt( 0 ).toUpperCase() )
            .slice( 0, 2 )
            .join( '' );
        iconContainer.textContent = initials;
        iconWrapper.style.display = 'flex';
    }
}

/**
 * Shows or hides the Profiles menu.
 */
function toggleProfileMenu () {
    const profileMenu = document.getElementById( "profile_menu" );
    profileMenu.classList.toggle( "open" );
}

document.addEventListener( "DOMContentLoaded", function () {
    getCurrentUser();
} );
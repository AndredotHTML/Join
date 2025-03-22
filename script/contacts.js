const ALL_cONTACTS_ELEM = document.querySelectorAll( '.contact' );
const DETAIL_ELEM = document.getElementById( 'detail' );

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

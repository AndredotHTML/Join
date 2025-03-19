/**
 * selects element using id
 * @param {string} id - HTML-Element Id
 */
function selectContact ( id ) {
    const selectedElement = document.getElementById( id );
    const alreadySelected = selectedElement.classList.contains( 'selected' );
    document.querySelectorAll( '.contact' ).forEach( el => el.classList.remove( 'selected' ) );

    if ( !alreadySelected ) {
        selectedElement.classList.add( 'selected' );
    }
    showDetail();
}

function showDetail () {
    let detailEle = document.getElementById( "detail" );
    detailEle?.classList.toggle( "open" );
}

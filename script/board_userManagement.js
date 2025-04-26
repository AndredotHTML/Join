async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData);
        generateUserIconHeader() 
    } else {
        console.log("Kein Nutzer gefunden.");
    }
}

function generateUserIconHeader() {
    let userName = user[0].name;
    let iconContainer = document.getElementById('icon-container');
    let iconWrapper = document.getElementById('icon-wrapper');
    if (userName) {
        let initials = userName.split(' ')
                                 .map(word => word.charAt(0).toUpperCase())
                                 .slice(0, 2)
                                 .join('');
        iconContainer.textContent = initials;
        iconWrapper.style.display = 'flex'; 
    }
}

function getUsersInitials(assignedUsers) {
    if (!assignedUsers || assignedUsers.length === 0) return [];
    let usersWithInitials = [];

    for (let index = 0; index < assignedUsers.length; index++) {
        let name = assignedUsers[index];
        let nameParts = name.trim().split(' ');
        let initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : `${nameParts[0][0]}`;

        usersWithInitials.push({
            initials: initials.toUpperCase(),
            name: name
        });
    }
    return usersWithInitials;
}

function generateUserIcons(assignedUsers){
    let usersData = getUsersInitials(assignedUsers);
    if (usersData.length === 0) return ''
    let userIcon = '';
    let overlapDistance = 30;

    for (let i = 0; i < usersData.length; i++) {
        let color = getColorForUser(usersData[i].name); 
        let leftPosition = i * overlapDistance;
        userIcon += generateSingleUserIcon(usersData[i].initials, leftPosition, color);
    }
    return userIcon;
}

function generateSingleUserIcon(initial, leftPosition, color) {
    return `<span class="user_icon" style="background-color: ${color}; left: ${leftPosition}px;">${initial}</span>`;
}

function generateOverlayUserIcons(assignedUsers){
    let usersData = getUsersInitials(assignedUsers);
    let userIcon = '';

    for(let i= 0; i<usersData.length;i++){
        let color = getColorForUser(usersData[i].name); 
        userIcon += generateOverlaySingleUserIcon(usersData[i].initials,usersData[i].name,color)
    }
    return userIcon;
}

function generateOverlaySingleUserIcon(initial,name, color) {
    return `<div class="user_icon_plus_name">
                <span class="user_icon_overlay" style="background-color: ${color}">${initial}</span>
                <span class="user_name_overlay">${name}</span>
            </div>`;
}

function getColorForUser(name) {
    let firstLetter = name.charAt(0).toUpperCase(); 
    let index = firstLetter.charCodeAt(0) % predefinedColors.length; 
    return predefinedColors[index]; 
}

/**
 * Enables horizontal drag-to-scroll functionality on a specified container.
 * 
 * @param {string} containerId - The ID of the container element to apply the drag scroll functionality.
 */
function enableHorizontalDragScroll(containerId) {
    const container = document.getElementById(containerId);
    setupDragEvents(container);
}

/**
 * Sets up mouse event listeners to handle the drag-to-scroll functionality.
 * 
 * @param {HTMLElement} container - The container element to apply the drag events to.
 */
function setupDragEvents(container) {
    container.addEventListener('mousedown', (e) => startDrag(e, container));
    container.addEventListener('mouseleave', () => stopDrag(container));
    container.addEventListener('mouseup', () => stopDrag(container));
    container.addEventListener('mousemove', (e) => dragMove(e, container));
}

let isDown = false;
let startX;
let scrollLeft;

/**
 * Initiates the drag action by tracking the mouse position and starting the scroll.
 * 
 * @param {MouseEvent} e - The mouse event when the user starts dragging.
 * @param {HTMLElement} container - The container element to track the drag action.
 */
function startDrag(e, container) {
    if (e.target.closest('.ticket')) return; // Avoid scroll if dragging a ticket
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
}

/**
 * Stops the drag action and removes the active state from the container.
 * 
 * @param {HTMLElement} container - The container element to stop the drag action on.
 */
function stopDrag(container) {
    isDown = false;
    container.classList.remove('active');
}

/**
 * Handles the mouse movement during a drag action to scroll the container horizontally.
 * 
 * @param {MouseEvent} e - The mouse event during the drag action.
 * @param {HTMLElement} container - The container element being scrolled.
 */
function dragMove(e, container) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    container.scrollLeft = scrollLeft - walk;
}

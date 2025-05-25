/**
 * Retrieves the current user data from localStorage, adds it to the user array,
 * and generates the user icon in the header.
 * @async
 */
async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData);
        generateUserIconHeader() 
    } 
}

/**
 * Generates the user icon for the header using the user's initials.
 */
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

/**
 * Converts an array of assigned user names into an array of objects
 * containing their initials and full names.
 * @param {string[]} assignedUsers - Array of assigned user full names.
 * @returns {Object[]} Array of objects with 'initials' and 'name' properties.
 */
function getUsersInitials(assignedUsers) {
    if (!assignedUsers || assignedUsers.length === 0) return [];
    let usersWithInitials = [];

    for (let index = 0; index < assignedUsers.length; index++) {
        let name = assignedUsers[index];
        let nameParts = name.trim().split(' ');
        let initials = nameParts.length >= 2? `${nameParts[0][0]}${nameParts[1][0]}` : `${nameParts[0][0]}`;
        usersWithInitials.push({
            initials: initials.toUpperCase(),
            name: name
        });
    }
    return usersWithInitials;
}

/**
 * Generates HTML string for user icons of assigned users, including
 * an extra icon if there are more than max icons.
 * @param {string[]} assignedUsers - Array of assigned user full names.
 * @returns {string} HTML string representing user icons.
 */
function generateUserIcons(assignedUsers) {
    let usersData = getUsersInitials(assignedUsers);
    if (usersData.length === 0) return '';
    let overlapDistance = 30;
    let maxIcons = 3;

    let userIcon = createDisplayedUserIcons(usersData, maxIcons, overlapDistance);
    let extraCount = usersData.length - maxIcons;
    if (extraCount > 0) {
        userIcon += createExtraUsersIcon(extraCount, maxIcons * overlapDistance);
    }
    return userIcon;
}

/**
 * Creates HTML for displayed user icons with positioning and color.
 * @param {Object[]} usersData - Array of user data objects with initials and names.
 * @param {number} maxIcons - Maximum number of icons to display.
 * @param {number} overlapDistance - Distance in pixels to overlap icons.
 * @returns {string} HTML string for user icons.
 */
function createDisplayedUserIcons(usersData, maxIcons, overlapDistance) {
    let icons = '';
    let displayedUsers = usersData.slice(0, maxIcons);

    for (let i = 0; i < displayedUsers.length; i++) {
        let color = getColorForUser(displayedUsers[i].name); 
        let leftPosition = i * overlapDistance;
        icons += generateSingleUserIcon(displayedUsers[i].initials, leftPosition, color);
    }

    return icons;
}

/**
 * Generates HTML string for user icons in overlay view.
 * @param {string[]} assignedUsers - Array of assigned user full names.
 * @returns {string} HTML string representing overlay user icons.
 */
function generateOverlayUserIcons(assignedUsers){
    let usersData = getUsersInitials(assignedUsers);
    let userIcon = '';

    for(let i= 0; i<usersData.length;i++){
        let color = getColorForUser(usersData[i].name); 
        userIcon += generateOverlaySingleUserIcon(usersData[i].initials,usersData[i].name,color)
    }
    return userIcon;
}

/**
 * Returns a color string based on the first letter of the user's name.
 * @param {string} name - Full name of the user.
 * @returns {string} Color string from predefinedColors array.
 */
function getColorForUser(name) {
    let firstLetter = name.charAt(0).toUpperCase(); 
    let index = firstLetter.charCodeAt(0) % predefinedColors.length; 
    return predefinedColors[index]; 
}

/** 
 * IDs of the task status sections.
 * @constant {string[]}
 */
const sectionIds = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

/**
 * Handles the search input, filters tasks across all sections,
 * and updates the UI accordingly.
 */
function handleSearch() {
    let searchTerm = document.querySelector('.search_container input').value.toLowerCase();
    hideAllSections();
    let isAnyTaskFound = false;

    if (filterAndDisplayTasks('toDo', searchTerm)) isAnyTaskFound = true;
    if (filterAndDisplayTasks('inProgress', searchTerm)) isAnyTaskFound = true;
    if (filterAndDisplayTasks('awaitFeedback', searchTerm)) isAnyTaskFound = true;
    if (filterAndDisplayTasks('done', searchTerm)) isAnyTaskFound = true;

    if (!isAnyTaskFound) {
        showNoTasksFoundMessage();
    }
}

/**
 * Filters tasks by their status and a search term.
 * @param {string} status - Task status to filter by.
 * @param {string} searchTerm - Search term to match in title or description.
 * @returns {Object[]} Filtered array of tasks.
 */
function filterTasksByStatusAndSearch(status, searchTerm) {
    return tasks.filter(t => 
        t['status'] === status &&
        (t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm))
    );
}

/**
 * Displays filtered tasks inside a container element.
 * @param {HTMLElement} container - Container DOM element to display tasks.
 * @param {Object[]} filteredTasks - Array of tasks to display.
 */
function displayTasks(container, filteredTasks) {
    container.innerHTML = ''; 

    if (filteredTasks.length > 0) {
        for (let i = 0; i < filteredTasks.length; i++) {
            let element = filteredTasks[i];
            container.innerHTML += generateTask(element); 
        }
        container.style.display = 'flex'; 
    } else {
        container.innerHTML = `<div class="no_tasks_found">No task found</div>`; 
        container.style.display = 'flex'; 
    }
}

/**
 * Filters tasks by status and search term, then displays them.
 * @param {string} status - Task status.
 * @param {string} searchTerm - Search term.
 * @returns {boolean} True if any tasks matched and displayed, otherwise false.
 */
function filterAndDisplayTasks(status, searchTerm) {
    let container = document.getElementById(status);
    if (!container) return false;

    let filteredTasks = filterTasksByStatusAndSearch(status, searchTerm);
    displayTasks(container, filteredTasks);
    
    return filteredTasks.length > 0; 
}

/**
 * Sets the display style for all task status sections.
 * @param {string} displayStyle - CSS display style (e.g., 'none', 'flex').
 */
function toggleSections(displayStyle) {
    for (let i = 0; i < sectionIds.length; i++) {
        let section = document.getElementById(sectionIds[i]);
        if (section) {
            section.style.display = displayStyle;
        }
    }
}

/**
 * Hides all task status sections.
 */
function hideAllSections() {
    toggleSections("none");
}

/**
 * Shows all task status sections.
 */
function showAllSections() {
    toggleSections("flex");
}

/**
 * Shows a "No task found" message in all task status sections.
 */
function showNoTasksFoundMessage() {
    for (let i = 0; i < sectionIds.length; i++) {
        let container = document.getElementById(sectionIds[i]);
        if (container) {
            container.innerHTML = `<div class="no_tasks_found">No task found</div>`;
            container.style.display = 'flex';
        }
    }
}

/**
 * Mapping of status IDs to display names.
 * @constant {Object<string,string>}
 */
const statusMap = {
    toDo: 'To Do',
    inProgress: 'In Progress',
    awaitFeedback: 'Await Feedback',
    done: 'Done'
};

/**
 * Shows the mini menu for changing the status of a task at the cursor position.
 * @param {MouseEvent} event - Click event triggering the menu.
 * @param {string} taskId - ID of the task.
 * @param {string} currentStatus - Current status of the task.
 */
function showMiniMenu(event, taskId, currentStatus) {
    event.stopPropagation();
    const menu = document.getElementById("statusMenu");
    const content = generateStatusMenuHTML(taskId, currentStatus);

    prepareStatusMenu(menu, content);
    const { x, y } = calculateMenuPosition(event, menu);

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
}

/**
 * Prepares the status menu with content and hides it off-screen initially.
 * @param {HTMLElement} menu - The status menu element.
 * @param {string} content - HTML content to place inside the menu.
 */
function prepareStatusMenu(menu, content) {
    menu.innerHTML = content;
    menu.style.left = "-9999px";
    menu.style.top = "-9999px";
    menu.classList.remove("hidden");
}

/**
 * Calculates the position for the status menu to ensure it stays within viewport.
 * @param {MouseEvent} event - The event triggering the menu.
 * @param {HTMLElement} menu - The status menu element.
 * @returns {Object} Object with x and y coordinates for the menu position.
 */
function calculateMenuPosition(event, menu) {
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    let x = event.pageX;
    let y = event.pageY;
    if (x + menuWidth > pageWidth) {
        x = pageWidth - menuWidth - 10;
    }
    if (y + menuHeight > pageHeight) {
        y = pageHeight - menuHeight - 10;
    }
    return { x, y };
}

/**
 * Generates the HTML content for the status menu options, excluding the current status.
 * @param {string} taskId - ID of the task.
 * @param {string} currentStatus - Current status of the task.
 * @returns {string} HTML string for the status menu.
 */
function generateStatusMenuHTML(taskId, currentStatus) {
    let statuses = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    let menu = '<strong>Move to:</strong><br>';
    let currentIndex = statuses.indexOf(currentStatus);

    for (let index = 0; index < statuses.length; index++) {
        let status = statuses[index];
        if(status !== currentStatus){
            let direction = index < currentIndex ? '<img src="../assets/icons/arrow_up.png" alt="UpDownArrow" >'  : '<img src="../assets/icons/arrow_down.png" alt="UpDownArrow" >'
            let displayName = `${direction} ${statusMap[status]}`;
            menu += createStatusMenuOption(taskId, status, displayName);
        }
    }
    return menu;
}

/**
 * Creates the HTML for a single status option in the menu.
 * @param {string} taskId - ID of the task.
 * @param {string} status - Status option.
 * @param {string} displayedStatus - Display text/HTML for the status.
 * @returns {string} HTML string for a status option.
 */
function createStatusMenuOption(taskId, status,displayedStatus) {
    return `<div onclick="changeTaskStatus('${taskId}', '${status}')">${displayedStatus}</div>`;
}

/**
 * Closes the status menu by adding the 'hidden' class.
 * @param {Event} event - Click event to determine if the menu should close.
 */
function closeStatusMenu(event) {
    let menu = document.getElementById('statusMenu');
    let clickedInsideMenu = menu.contains(event.target);
    
    if (!clickedInsideMenu) {
        menu.classList.add('hidden');
    }
}

/**
 * Closes the status menu without any event context.
 */
function closeStatusMenu() {
    let menu = document.getElementById('statusMenu');
    if (menu) menu.classList.add('hidden');
}


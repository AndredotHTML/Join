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

const sectionIds = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

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

function filterTasksByStatusAndSearch(status, searchTerm) {
    return tasks.filter(t => 
        t['status'] === status &&
        (t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm))
    );
}

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

function filterAndDisplayTasks(status, searchTerm) {
    let container = document.getElementById(status);
    if (!container) return false;

    let filteredTasks = filterTasksByStatusAndSearch(status, searchTerm);
    displayTasks(container, filteredTasks);
    
    return filteredTasks.length > 0; 
}


function toggleSections(displayStyle) {
    for (let i = 0; i < sectionIds.length; i++) {
        let section = document.getElementById(sectionIds[i]);
        if (section) {
            section.style.display = displayStyle;
        }
    }
}

function hideAllSections() {
    toggleSections("none");
}

function showAllSections() {
    toggleSections("flex");
}

function showNoTasksFoundMessage() {
    for (let i = 0; i < sectionIds.length; i++) {
        let container = document.getElementById(sectionIds[i]);
        if (container) {
            container.innerHTML = `<div class="no_tasks_found">No task found</div>`;
            container.style.display = 'flex';
        }
    }
}
async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData);
        generateUserIconHeader() 
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
        let initials = nameParts.length >= 2? `${nameParts[0][0]}${nameParts[1][0]}` : `${nameParts[0][0]}`;
        usersWithInitials.push({
            initials: initials.toUpperCase(),
            name: name
        });
    }
    return usersWithInitials;
}

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

function createExtraUsersIcon(count, leftPosition) {
    return `<span class="user_icon" style="background-color:gray; left: ${leftPosition}px;">+${count}</span>`;
}

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

const statusMap = {
    toDo: 'To Do',
    inProgress: 'In Progress',
    awaitFeedback: 'Await Feedback',
    done: 'Done'
};

function showMiniMenu(event, taskId, currentStatus) {
    event.stopPropagation();
    const menu = document.getElementById("statusMenu");
    const content = generateStatusMenuHTML(taskId, currentStatus);

    prepareStatusMenu(menu, content);
    const { x, y } = calculateMenuPosition(event, menu);

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
}

function prepareStatusMenu(menu, content) {
    menu.innerHTML = content;
    menu.style.left = "-9999px";
    menu.style.top = "-9999px";
    menu.classList.remove("hidden");
}

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

function createStatusMenuOption(taskId, status,displayedStatus) {
    return `<div onclick="changeTaskStatus('${taskId}', '${status}')">${displayedStatus}</div>`;
}

function closeStatusMenu(event) {
    let menu = document.getElementById('statusMenu');
    let clickedInsideMenu = menu.contains(event.target);
    
    if (!clickedInsideMenu) {
        menu.classList.add('hidden');
    }
}

function closeStatusMenu() {
    let menu = document.getElementById('statusMenu');
    if (menu) menu.classList.add('hidden');
}

async function changeTaskStatus(taskId, newStatus) {
    let task = tasks.find(t => t.id === taskId);
    task.status = newStatus; 
    await updateTaskInFirebase(taskId, { status: newStatus });
    closeStatusMenu();
    updateView();
}
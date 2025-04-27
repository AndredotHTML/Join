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
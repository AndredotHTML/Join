let task = [{
    'id' : 0,
    'title' : 'Kochwelt Page & Recipe Recommender',
    'category' : 'User Story',
    'description' : 'Build start page with recipe recommendataion...',
    'date' : '11.3.2025' ,
    'priority': 'medium',
    'users' : {
        'userId1' : {
            'name' : "Emmanuel Mauer"
        },
        'userId2' : {
            'name' : "Marchel Bauer"
        },
        'userId3' : {
            'name' : "Anton Mayer"
        }
    },
    'subtasks' : {
        'subtaskId1' :{
            'title' : 'Implement Recipe Recommendation',
            'completed' : true
        }, 
        'subtaskId2':{ 
            'title' : 'Start Page Layout',
            'completed' : false
        }
    },
    'status' : 'inProgress'
},{
    'id' : 1,
    'title' : 'CSS Architecture Planning',
    'category' : 'Technical Task',
    'description' : 'Define CSS naming conventions and structure',
    'date' : '11.3.2025' ,
    'priority': 'urgent',
    'users' : {
        'userId1' : {
            'name' : "Benedikt Ziegler"
        },
        'userId2' : {
            'name' : "Sofia Müller"
        }
    },
   'subtasks' : {
        'subtaskId1' :{
            'title' : 'Implement Establish CSS Methodology',
            'completed' : true
        }, 
        'subtaskId2':{ 
            'title' : 'Setup Base Styles',
            'completed' : true
        }
    },
    'status' : 'done'
}];

let currentDraggedElement;
const predefinedColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];

function updateHTML() {
    displayToDo();
    displayInProgress();
    displayAwaitFeedback();
    displayDone();
}

function displayToDo() {
    let toDo = task.filter(t => t['status'] == 'toDo');
    let toDoContainer = document.getElementById('toDo');
    toDoContainer.innerHTML = '';
    
    if(toDo.length === 0) {
        toDoContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < toDo.length ; i++){
            const element = toDo[i];
            toDoContainer.innerHTML += generateTask(element);
        }
    }
}

function displayInProgress(){
    let inProgress = task.filter(t => t['status'] == 'inProgress')
    let inProgressContainer = document.getElementById('inProgress');
    inProgressContainer.innerHTML = '';

    if(inProgress.length === 0) {
        inProgressContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < inProgress.length ; i++) {
            const element = inProgress[i];
            inProgressContainer.innerHTML += generateTask(element);
        }
    }
}

function displayAwaitFeedback(){
    let aFeedback = task.filter(t => t['status'] == 'awaitFeedback');
    let aFeedbackContainer = document.getElementById('awaitFeedback');
    aFeedbackContainer.innerHTML = '' ;

    if(aFeedback.length === 0) {
        aFeedbackContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < aFeedback.length ; i++) {
            const element = aFeedback[i];
            aFeedbackContainer.innerHTML += generateTask(element);
        }
    }
}

function displayDone() {
    let done = task.filter(t => t['status'] == 'done');
    let doneContainer = document.getElementById('done');
    doneContainer.innerHTML = '';

    if(done.length === 0) {
        doneContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < done.length ; i++) {
            const element = done[i];
            doneContainer.innerHTML += generateTask(element);
        }
    }
}

function generateTask(element) {
    let bg_color = toggleCategoryColor(element.category);
    let {completed,total,progress} = calculateSubtaskProgress(element.subtasks);
    let priority_img = togglePriority(element.priority);
    let user_icon =generateUserIcons(element.users);

    return `
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="ticket">
    <div class="ticket_category"><span style="background-color: ${bg_color};" >${element.category}</span></div>
    <div class="ticket_title"><h3>${element.title}</h3></div>
    <div class="ticket_description">${element.description}</div>
    <div class="ticket_subtasks">
    <div class="progress_bar">
          <div class="progress" style="width: ${progress}%;"></div>
    </div>
    <div class="completed"><span>${completed}/${total} Subtasks</span></div>
    </div>
    <div class="ticket_footer">
    <div class="ticket_users">${user_icon}</div>
    <div class="ticket_priority">${priority_img}</div>
    </div>
    </div>`
}

function generateNoTask(){
    return `
        <div class="noTask_msg">
        <span>No task </span>
    </div>
`;
}

function startDragging(id) {
    currentDraggedElement = id ;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(status){
    task[currentDraggedElement]['status'] = status;
    updateHTML();
    removeHighlight(status); 
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');

}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
    
}

function toggleCategoryColor(category) {
    if (category === 'User Story') {
        return "#ff7a00";
    } else {
        return "#0038ff";
    }
}

function togglePriority(priority){
    if(priority === 'urgent') {
        return  `<img src="../assets/icons/urgent.png" alt="urgent">` ;
    }else if(priority === 'medium') {
        return  `<img src="../assets/icons/medium.png" alt="medium">`;
    } else {
        return  `<img src="../assets/icons/low.png" alt="low">`
    }
}

function calculateSubtaskProgress(subtasks) {
    let total = Object.keys(subtasks).length;
    let completed = Object.values(subtasks).filter(st => st.completed).length;
    let progress = (completed / total) * 100 ;
    
    return {
        completed : completed,
        total : total,
        progress : progress
    }
}



function getUsersInitials(users) {
    let allUsers = Object.keys(users);
    let usersWithInitials = [];

    for (let index = 0; index < allUsers.length; index++) {
        let name = users[allUsers[index]].name;
        let initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
        usersWithInitials.push({ 
            'initials' : initials, 
            'name' : name 
        });
    }
    return usersWithInitials;
}

function generateUserIcons(users){
    let usersData = getUsersInitials(users);
    let userIcon = '';
    let overlapDistance = 30;

    for(let i= 0; i<usersData.length;i++){
        let color = getColorForUser(usersData[i].name); 
        let leftPosition = i * overlapDistance;
        userIcon += generateSingleUserIcon(usersData[i].initials,leftPosition,color)
    }
    return userIcon;
}

function generateSingleUserIcon(initial, leftPosition, color) {
    return `<span class="user_icon" style="background-color: ${color}; left: ${leftPosition}px;">${initial}</span>`;
}

/**
 * Determines a color for the user based on the first letter of their name.
 * The color is selected from a predefined set of colors, and the selection 
 * is based on the ASCII code of the first letter, modulo the number of 
 * colors available in the predefined color array.
 * 
 * @param {string} name - The name of the user.
 * @returns {string} The color corresponding to the first letter of the user's name.
 */
function getColorForUser(name) {
    let firstLetter = name.charAt(0).toUpperCase(); 
    let index = firstLetter.charCodeAt(0) % predefinedColors.length; 
    return predefinedColors[index]; 
}




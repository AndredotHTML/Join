let tasks = [];

user = []


async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData);
        generateUserIcon();
    } else {
        console.log("Kein Nutzer gefunden.");
    }
}

function generateUserIcon() {
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

let currentDraggedElement;
const predefinedColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];


async function updateHTML() {
    await pushToUsersArray(); 
    console.log(users);
    await pushToTask();
    await getCurrentUser();
    displayToDo();
    displayInProgress();
    displayAwaitFeedback();
    displayDone(); 
}

function updateView(){
    displayToDo();
    displayInProgress();
    displayAwaitFeedback();
    displayDone(); 
}

async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}


async function pushToTask() {
    let task = await getAllTasks("/tasks"); 
    let tasksArray = Object.keys(task);

    for (let index = 0; index < tasksArray.length; index++) {
        let taskData = task[tasksArray[index]]; 
        tasks.push({
            id: tasksArray[index], 
            category: taskData.category,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            status: taskData.status,
            subtasks: taskData.subtasks,
            assignedUsers: taskData.assignedUsers
        });
    }
    console.log(tasks);
}

function displayToDo() {
    let toDo = tasks.filter(t => t['status'] == 'toDo');
    let toDoContainer = document.getElementById('toDo');
    toDoContainer.innerHTML = '';
    
    if(toDo.length === 0) {
        toDoContainer.innerHTML = generateNoTask('To do ');
    }else {
        for(let i = 0 ; i < toDo.length ; i++){
            const element = toDo[i];
            toDoContainer.innerHTML += generateTask(element);
        }
    }
}

function displayInProgress(){
    let inProgress = tasks.filter(t => t['status'] == 'inProgress')
    let inProgressContainer = document.getElementById('inProgress');
    inProgressContainer.innerHTML = '';

    if(inProgress.length === 0) {
        inProgressContainer.innerHTML = generateNoTask('In progress');
    }else {
        for(let i = 0 ; i < inProgress.length ; i++) {
            const element = inProgress[i];
            inProgressContainer.innerHTML += generateTask(element);
        }
    }
}

function displayAwaitFeedback(){
    let aFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    let aFeedbackContainer = document.getElementById('awaitFeedback');
    aFeedbackContainer.innerHTML = '' ;

    if(aFeedback.length === 0) {
        aFeedbackContainer.innerHTML = generateNoTask('Await Feedback');
    }else {
        for(let i = 0 ; i < aFeedback.length ; i++) {
            const element = aFeedback[i];
            aFeedbackContainer.innerHTML += generateTask(element);
        }
    }
}

 function displayDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    let doneContainer = document.getElementById('done');
    doneContainer.innerHTML = '';

    if(done.length === 0) {
        doneContainer.innerHTML = generateNoTask('Done');
    }else {
        for(let i = 0 ; i < done.length ; i++) {
            const element = done[i];
            doneContainer.innerHTML += generateTask(element);
        }
    }
}

function toggleCategoryColor(category) {
    if (category === 'User Story') {
        return "#ff7a00";
    } else {
        return "#0038ff";
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

function togglePriority(priority){
    let priorityLower = priority.toLowerCase();

    if(priorityLower === 'urgent') {
        return  `<img src="../assets/icons/urgent.png" alt="urgent">` ;
    }else if(priorityLower === 'medium') {
        return  `<img src="../assets/icons/medium.png" alt="medium">`;
    } else {
        return  `<img src="../assets/icons/low.png" alt="low">`
    }
}

function getUsersInitials(assignedUsers) {
    let usersWithInitials = [];

    for (let index = 0; index < assignedUsers.length; index++) {
        let name = assignedUsers[index];
        let initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
        usersWithInitials.push({
            'initials': initials,
            'name': name
        });
    }
    return usersWithInitials;
}

function generateUserIcons(assignedUsers){
    let usersData = getUsersInitials(assignedUsers);
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

function startDragging(id) {
    currentDraggedElement = id ;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(status) {
    let taskIndex = tasks.findIndex(t => t.id === currentDraggedElement); 
    tasks[taskIndex].status = status;

    await updateTaskStatus(currentDraggedElement, status);
    removeHighlight(status);
    displayToDo();
    displayInProgress();
    displayAwaitFeedback();
    displayDone();
}

async function updateTaskStatus(taskId, newStatus) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

    try {
           await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (error) {
        console.error("Firebase update error:", error);
    }
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');

}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
    
}

function showOverlay(id){
    let element = tasks.find(t => t.id === id);
    let overlay = document.getElementById('overlay');
    overlay.style.display ='flex';
    document.body.style.overflow ='hidden';
    overlay.innerHTML = generateTaskOverlay(element);
    overlay.classList.add('show');
}

function closeOverlay(event) {
    let overlay = document.getElementById('overlay');
    if (!event || event.target === overlay) {
        overlay.classList.remove('show'); 
        overlay.classList.remove('slide_in'); 
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }
}

function getSubtasks (subtasks){
    let allSubtasks = Object.keys(subtasks);
    let  subArray =[];

    for (let i = 0; i < allSubtasks.length; i++) {
       let title = subtasks[allSubtasks[i]].title;
       let completed =  subtasks[allSubtasks[i]].completed;
       subArray.push({
        'title' : title,
        'completed' : completed
       })
    }
    return subArray;
}

function generateSubtasks(subtasks,taskId){
    let subtasksData = getSubtasks(subtasks);
    let subtaskHTML ='';

    for (let i = 0; i < subtasksData.length; i++) {
        let checked = subtasksData[i].completed? 'checked' : '';
        subtaskHTML += generateSingleSubtask( subtasksData[i].title,checked,taskId,i);
    }
    return subtaskHTML;
}

function generateSingleSubtask(title, checked, taskId, index) {
    return `
        <div class="subtask_item">
            <input type="checkbox" id="${taskId}-subtask-${index}" ${checked} onchange="toggleSubtask('${taskId}', '${index}')">
            <label for="${taskId}-subtask-${index}">${title}</label>
        </div>
    `;
}

async function toggleSubtask(taskId, subtaskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task) {
        let subtask = task.subtasks[subtaskId];
        if (subtask) { 
            subtask.completed = !subtask.completed;
            
            await updateSubtaskStatus(taskId, subtaskId, subtask.completed);
            updateView();
        }
    }
}

async function updateSubtaskStatus(taskId, subtaskId, newStatus) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/subtasks/${subtaskId}.json`;

    try {
        await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newStatus })
        });
    } catch (error) {
        console.error("Firebase update error:", error);
    }
}

async function deleteTask(taskId) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

    try {
        await fetch(url, {
            method : "DELETE"
        });
        tasks = tasks.filter(task => task.id !== taskId);
        updateView();
        closeOverlay();
    } catch (error) {
        console.error("Firebase delete error:", error);
    }
}

function showAddTaskOverlay(){
    let overlay = document.getElementById('overlay');
    overlay.style.display ='flex';
    document.body.style.overflow ='hidden';
    overlay.innerHTML = addTaskOverlay();
    overlay.classList.add('slide_in');
}


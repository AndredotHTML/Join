let task = [{
    'id' : 0,
    'title' : 'Kochwelt Page & Recipe Recommender',
    'category' : 'User Story',
    'description' : 'Build start page with recipe recommendatation...',
    'date' : '11/3/2025' ,
    'priority': 'Medium',
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
    'date' : '11/3/2025' ,
    'priority': 'Urgent',
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
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="ticket" onclick="showOverlay(${element['id']})">
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

function generateTaskOverlay(element) {
    let bg_color = toggleCategoryColor(element.category);
    let priority_img = togglePriority(element.priority);
    let user_icon_name =generateOverlayUserIcons(element.users);
    let subtask = generateSubtasks(element.subtasks, element.id);

    return `
    <div  class="ticket_overlay">
    <div class="overlay_header">
    <div class="category_overlay"><span style="background-color: ${bg_color};" >${element.category}</span></div>
    <div class="x" onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
    </div>
    <div class="title_overlay"><h1>${element.title}</h1></div>
    <div class="description_overlay">${element.description}</div>
    <div class="date_overlay"><span>Due date : </span>
    <div class="date">${element.date}</div>
    </div>
    <div class="priority_overlay"><span>Priority: </span>
    <div class="priority">${element.priority}  ${priority_img}</div>
    </div>
    <div class="assigned_overlay">
    <table>
    <tr><th>Assigned To:</th> </tr>
    <tr><td>${user_icon_name}</td></tr>
    </table>
    </div>
    <div class="subtasks"><span>Subtasks:</span>
        ${subtask}
    </div>
    <div class="delete_edit">
        <button type="button" class="delete_btn"><img src="../assets/icons/delete.png" alt="delete icon">Delete</button>
        <button type="button" class="edit_btn"><img src="../assets/icons/edit.png" alt="edit icon">Edit</button>
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
    if(priority === 'Urgent') {
        return  `<img src="../assets/icons/urgent.png" alt="urgent">` ;
    }else if(priority === 'Medium') {
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

function generateOverlayUserIcons(users){
    let usersData = getUsersInitials(users);
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

function toggleSubtask(taskId, subtaskId) {
    let tasks = task.find(t => t.id === taskId);
    if (tasks) {
        task.subtasks[subtaskId].completed = !task.subtasks[subtaskId].completed;
    }
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


function showOverlay(id){
    let element = task.find(t => t.id === id);
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

function showAddTaskOverlay(){
    let overlay = document.getElementById('overlay');
    overlay.style.display ='flex';
    document.body.style.overflow ='hidden';
    overlay.innerHTML = addTaskOverlay();
    overlay.classList.add('slide_in');
}

function addTaskOverlay(){
    return `<div  class="add_task_overlay">
            <div class="addTask_header_overlay">
            <div class="header_x"  onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
            <div class="header_headline"><h1> Add Task</h1></div>
            </div>
            <div class="addTask_content">
            <div class="form-header" >
                    <input type="text" id="title-add-task" placeholder="Enter a title">
                    <div class="validation-add-task-form">
                    </div>
                    <label for="description-add-task">Description <span>(optional)</span>
                    </label>
                    <textarea name="description-add-task" class="custom-resize" id="description-add-task"
                        placeholder="Enter a Description"></textarea>
                    <div class="validation-add-task-form">
                    </div>
                    <label for="dateInput-add-task">Due date
                    </label>
                    <input type="date" name="dateInput-add-task" id="dateInput-add-task">
                    <div class="validation-add-task-form">
                    </div>
            </div>
            <div class="shell-radio-area">
                    <legend>Priority</legend>
                    <div class="shell-radio-btn">
                        <label class="radio-btn" id="add-task-urgent" for="urgent-rad">
                            <input type="radio" name="priority" id="urgent-rad" onclick="radioBtnChecked('urgent')">
                                Urgent <img class="unchecked-priority" src="../assets/icons/urgent.svg" alt="">
                                <img class="checked-priority" src="../assets/icons/urgent_white.svg" alt="">
                        </label>
                        <label class="radio-btn" id="add-task-medium" for="medium-rad" >
                            <input type="radio" name="priority" id="medium-rad" onclick="radioBtnChecked('medium')">
                                Medium <img class="unchecked-priority" src="../assets/icons/medium.svg" alt="">
                                <img class="checked-priority" src="../assets/icons/medium_white.svg" alt="">
                        </label>
                        <label class="radio-btn" id="add-task-low" for="low-rad">
                            <input type="radio" name="priority" id="low-rad" onclick="radioBtnChecked('low')" >
                                Low <img class="unchecked-priority" src="../assets/icons/low.svg" alt="">
                                <img class="checked-priority" src="../assets/icons/low_white.svg" alt="">
                        </label>
                    </div>
            </div>
            <div class="assigned">
            <label for="assigned-to">Assigned to<span>(optional)</span></label>
            <select name="assigned-to" id="assigned-to">
                    <option id="placeholder" value="Select task category" selected disabled hidden>Select contacts to
                        assign</option>
            </select>
            </div>
            <div class="category">
            <label for="category">Category</label>
            <select name="category" id="category"> Select task category
                    <option value="Select task category" selected disabled hidden>Select task category</option>
                    <option value="">Technical Task</option>
                    <option value="">User Story</option>
            </select>
            </div>
            <div class="subtask">
                     <label for="subtask">Subtasks <span>(optional)</span></label>
            <div class="subtask-area" id="shell-subtask">
                    <input type="text" id="subtask" placeholder="Add new subtask">
            <div id="subtask-icons">
                    <img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">
            </div>
            </div>
                    <ul id="added-subtasks"></ul>
            </div>
                    </div>
                <div class="button_div">
                <button class="btn add-task-create-btn" id="add-task-create-btn">
                    <div class="btn-title">Create Task </div>
                    <div class="btn-icon-shell">
                        <img src="../assets/icons/check.svg" alt="">
                    </div>
            </button>
             </div>
    </div>`
}

function showSubtaskActions() {
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskIcons.innerHTML = `
        <img id="subtask-check-icon" src="../assets/icons/check.png" alt="Check" onclick="addSubtaskOverlay()">
        <img id="subtask-delete-icon" src="../assets/icons/x.png" alt="Delete" onclick="resetSubtaskIcons()">
    `;
}

function addSubtaskOverlay() {
    let subtaskInput = document.getElementById("subtask");
    let subtaskList = document.getElementById("added-subtasks");

    if (subtaskInput.value.trim() === "") {
        return; 
    }
    subtaskList.innerHTML += subtaskTemplate(subtaskInput.value);
    subtaskInput.value = ""; 
    resetSubtaskIcons(); 
}

function subtaskTemplate( subtaskValue){
    return `<li class="added_subtask">
             <span class="subtask_text">${subtaskValue}</span>
            <div class="subtask_actions">
                <img src="../assets/icons/edit.png" alt="Edit" class="edit-icon">
                <img src="../assets/icons/delete.png" alt="Delete" class="delete-icon">
            </div></li>`
}

function resetSubtaskIcons() {
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskIcons.innerHTML = `<img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">`;
    document.getElementById("subtask").value = "";
}


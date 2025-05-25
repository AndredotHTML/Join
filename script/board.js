let currentDraggedElement;
const predefinedColors = ["#FF4646", "#FC71FF", "#9327FF", "#FFC701", "#0038FF","#1FD7C1","#FF7A00","#FF3D00","#7AE229"];

async function updateHTML() {
    authLogIn()
    await  pushToContactsArray()
    await pushToTask();
    await getCurrentUser();
     displayAllTaskSections();
}

function updateView(){
     displayAllTaskSections();
}

function displayTasks(status) {
    let filteredTasks = tasks.filter(t => t['status'] === status);
    let container = document.getElementById(status);
    let label = getLabelForStatus(status);
    container.innerHTML = '';

    if (filteredTasks.length === 0) {
        container.innerHTML = generateNoTask(label);
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            container.innerHTML += generateTask(filteredTasks[i]);
        }
    }
}

function getLabelForStatus(status) {
    switch (status) {
        case 'toDo':
            return 'To do';
        case 'inProgress':
            return 'In progress';
        case 'awaitFeedback':
            return 'Await Feedback';
        case 'done':
            return 'Done';
        default:
            return '';
    }
}

function displayAllTaskSections() {
    let statuses = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    for (let i = 0; i < statuses.length; i++) {
        displayTasks(statuses[i]);
    }
}

function toggleCategoryColor(category) {
    if (category === 'User Story') {
        return "#ff7a00";
    } else {
        return "#0038ff";
    }
}

function isSubtasksEmpty(subtasks) {
    return !subtasks || Object.keys(subtasks).length === 0;
}

function calculateSubtaskProgress(subtasks) {
    if (isSubtasksEmpty(subtasks)) {
        return { completed: 0, total: 0, progress: 0 };
    }

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

function isDragAndDropEnabled() {
    return window.innerWidth > 820;
}

function startDragging(id) {
    if (!isDragAndDropEnabled()) {
        showDragTooltip();
        return;
    }
    currentDraggedElement = id;
}

function allowDrop(ev) {
    if (!isDragAndDropEnabled()) return;
    ev.preventDefault();
}

async function moveTo(status) {
    if (!isDragAndDropEnabled()) return;
    let taskIndex = tasks.findIndex(t => t.id === currentDraggedElement); 
    tasks[taskIndex].status = status;

    await updateTaskStatus(currentDraggedElement, status);
    removeHighlight(status);
    updateView();
}

function showDragTooltip() {
    const tooltip = document.getElementById('dragTooltip');
    tooltip.classList.remove('hidden');
    setTimeout(() => {
        tooltip.classList.add('hidden');
    }, 3000);
}

function removeHighlight(id) {
    if (!isDragAndDropEnabled()) return;
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function highlight(id) {
    if (!isDragAndDropEnabled()) return;
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
        localStorage.removeItem('selectedUsers');
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

function showAddTaskOverlayByStatus(status) {
    if (window.innerWidth <= 705) {
        window.location.href = 'addTask.html';
        return;
    }

    let overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = getAddTaskOverlayHTML(status);
    overlay.classList.add('slide_in');
    radioBtnChecked('Medium');
}

function getAddTaskOverlayHTML(status) {
    if (status === 'toDo') {
        return addTaskOverlay();
    } else if (status === 'inProgress') {
        return addTaskInProgressOverlay();
    } else if (status === 'awaitFeedback') {
        return addTaskAwaitFeedbackOverlay();
    } else {
        return ''; 
    }
}

function showEditOverlay(id) {
    let task = tasks.find(t => t.id === id);
    let overlay = document.getElementById('overlay');
    assignedContacts = task.assignedUsers || [];
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.innerHTML = generateEditOverlay(task);
    localStorage.setItem('selectedUsers', JSON.stringify(assignedContacts));
    showSelectedUsersFromTask();
    radioBtnChecked(task.priority);
}

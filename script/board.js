let currentDraggedElement;
const predefinedColors = ["#FF4646", "#FC71FF", "#9327FF", "#FFC701", "#0038FF","#1FD7C1","#FF7A00","#FF3D00","#7AE229"];

/**
 * Initializes the app by logging in, loading contacts and tasks, getting the current user,
 * and displaying all task sections.
 */

async function updateHTML() {
    authLogIn()
    await  pushToContactsArray()
    await pushToTask();
    await getCurrentUser();
     displayAllTaskSections();
}

/**
 * Refreshes the view by displaying all task sections.
 */
function updateView(){
     displayAllTaskSections();
}

/**
 * Displays tasks filtered by their status inside the corresponding container.
 * @param {string} status - The status of the tasks to display ('toDo', 'inProgress', 'awaitFeedback', 'done').
 */
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

/**
 * Returns a human-readable label for a given task status.
 * @param {string} status - The task status.
 * @returns {string} The label for the status.
 */
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

/**
 * Displays tasks for all predefined status sections.
 */
function displayAllTaskSections() {
    let statuses = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    for (let i = 0; i < statuses.length; i++) {
        displayTasks(statuses[i]);
    }
}

/**
 * Returns the color code based on task category.
 * @param {string} category - The category of the task.
 * @returns {string} The color code for the category.
 */
function toggleCategoryColor(category) {
    if (category === 'User Story') {
        return "#ff7a00";
    } else {
        return "#0038ff";
    }
}

/**
 * Checks if the subtasks object is empty or undefined.
 * @param {Object} subtasks - The subtasks object.
 * @returns {boolean} True if subtasks is empty or not defined.
 */
function isSubtasksEmpty(subtasks) {
    return !subtasks || Object.keys(subtasks).length === 0;
}

/**
 * Calculates subtask progress including completed, total, and percentage progress.
 * @param {Object} subtasks - The subtasks object.
 * @returns {Object} An object with completed count, total count, and progress percentage.
 */
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

/**
 * Returns the HTML string of the priority icon based on priority level.
 * @param {string} priority - Priority level ('Urgent', 'Medium', 'Low').
 * @returns {string} HTML img tag string representing priority.
 */
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

/**
 * Determines if drag and drop functionality is enabled based on window width.
 * @returns {boolean} True if window width is greater than 820 pixels.
 */
function isDragAndDropEnabled() {
    return window.innerWidth > 820;
}

/**
 * Starts dragging a task by setting the currentDraggedElement id.
 * Shows a tooltip if drag-and-drop is disabled.
 * @param {string} id - The id of the dragged task.
 */
function startDragging(id) {
    if (!isDragAndDropEnabled()) {
        showDragTooltip();
        return;
    }
    currentDraggedElement = id;
}

/**
 * Allows dropping on the target element during drag and drop if enabled.
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
    if (!isDragAndDropEnabled()) return;
    ev.preventDefault();
}

/**
 * Moves a dragged task to a new status and updates Firebase and the view.
 * @param {string} status - The new status to move the task to.
 */
async function moveTo(status) {
    if (!isDragAndDropEnabled()) return;
    let taskIndex = tasks.findIndex(t => t.id === currentDraggedElement); 
    tasks[taskIndex].status = status;

    await updateTaskStatus(currentDraggedElement, status);
    removeHighlight(status);
    updateView();
}

/**
 * Shows a tooltip warning that drag and drop is disabled.
 */
function showDragTooltip() {
    const tooltip = document.getElementById('dragTooltip');
    tooltip.classList.remove('hidden');
    setTimeout(() => {
        tooltip.classList.add('hidden');
    }, 3000);
}

/**
 * Removes the drag highlight class from the specified container.
 * @param {string} id - The id of the container to remove highlight from.
 */
function removeHighlight(id) {
    if (!isDragAndDropEnabled()) return;
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Adds the drag highlight class to the specified container.
 * @param {string} id - The id of the container to highlight.
 */
function highlight(id) {
    if (!isDragAndDropEnabled()) return;
    document.getElementById(id).classList.add('drag-area-highlight');     
}

/**
 * Shows the task detail overlay for a given task id.
 * @param {string} id - The id of the task.
 */
function showOverlay(id){
    let element = tasks.find(t => t.id === id);
    let overlay = document.getElementById('overlay');
    overlay.style.display ='flex';
    document.body.style.overflow ='hidden';
    overlay.innerHTML = generateTaskOverlay(element);
    overlay.classList.add('show');
}

/**
 * Closes the task overlay if clicking outside the overlay or by function call.
 * @param {Event} [event] - The event triggering the close (optional).
 */

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

/**
 * Extracts subtasks from the subtasks object and returns them as an array.
 * @param {Object} subtasks - The subtasks object.
 * @returns {Array} Array of subtask objects with title and completed status.
 */
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

/**
 * Generates HTML for all subtasks of a given task.
 * @param {Object} subtasks - The subtasks object.
 * @param {string} taskId - The id of the parent task.
 * @returns {string} HTML string of subtasks.
 */
function generateSubtasks(subtasks,taskId){
    let subtasksData = getSubtasks(subtasks);
    let subtaskHTML ='';

    for (let i = 0; i < subtasksData.length; i++) {
        let checked = subtasksData[i].completed? 'checked' : '';
        subtaskHTML += generateSingleSubtask( subtasksData[i].title,checked,taskId,i);
    }
    return subtaskHTML;
}

/**
 * Toggles the completion status of a subtask and updates it in Firebase.
 * @param {string} taskId - The id of the parent task.
 * @param {string} subtaskId - The id of the subtask.
 */
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

/**
 * Displays the add task overlay for a given status.
 * On small screens, redirects to addTask.html.
 * @param {string} status - The status for which to add a task.
 */
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

/**
 * Returns the HTML for the add task overlay based on status.
 * @param {string} status - The status of the new task.
 * @returns {string} HTML string for the overlay.
 */
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

/**
 * Shows the edit overlay for a task and initializes selected users and priority radio button.
 * @param {string} id - The id of the task to edit.
 */
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

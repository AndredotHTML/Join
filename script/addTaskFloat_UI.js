/**
 * Initializes and opens the flatpickr calendar on the date input field.
 */
function openCalendar() {
    const dateInput = document.getElementById("dateInput-add-task");
        flatpickr(dateInput, {
            dateFormat: "d/m/Y", 
              minDate: "today"
        }).open();
}

/**
 * Updates the UI and internal state to reflect the selected priority radio button.
 * @param {string} priority - The priority selected (e.g., "Urgent", "Medium", "Low").
 */
function radioBtnChecked(priority) {
    updatedPriority = priority;

    let labelList = document.querySelectorAll(".radio_btn");
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
        toggleIcons(radioBtn, 'hide');
    });
    let labelRef = document.querySelector(`label[for="${priority.toLowerCase()}-rad"]`);
    labelRef.style.backgroundColor = `var(--${priority.toLowerCase()}Color)`;
    labelRef.style.color = `var(--secondaryColor)`;
    toggleIcons(labelRef, 'show');
}

/**
 * Toggles visibility of the checked and unchecked icons within a radio button label.
 * @param {HTMLElement} radioBtn - The radio button label element.
 * @param {string} action - Action to perform: "show" or "hide".
 */
function toggleIcons(radioBtn, action) {
    let checkedIcon = radioBtn.querySelector('.checked_priority');
    let uncheckedIcon = radioBtn.querySelector('.unchecked_priority');
    if (action === 'hide') {
        checkedIcon.style.display = 'none';
        uncheckedIcon.style.display = 'inline-block';
    } else {
        checkedIcon.style.display = 'inline-block';
        uncheckedIcon.style.display = 'none';
    }
}

/**
 * Appends a task element to the "To Do" section in the UI.
 * @param {Object} task - Task object to render.
 */
function updateToDo(task){
    let toDo = document.getElementById('toDo');
    toDo.innerHTML +=generateTask(task);
}

/**
 * Appends a task element to the "In Progress" section in the UI.
 * @param {Object} task - Task object to render.
 */
function updateInProgress(task){
    let inProgress = document.getElementById('inProgress');
    inProgress.innerHTML +=generateTask(task);
}

/**
 * Appends a task element to the "Await Feedback" section in the UI.
 * @param {Object} task - Task object to render.
 */
function updateAwaitFeedback(task){
    let awaitFeedback = document.getElementById('awaitFeedback');
    awaitFeedback.innerHTML +=generateTask(task);
}

/**
 * Sends a POST request to save a new task to the backend Firebase database.
 * @param {string} path - API endpoint path.
 * @param {Object} data - Task data to send.
 * @returns {Promise<string|null>} Returns the new task ID if successful, or null if failed.
 */
async function postTask(path = "", data = {}) {
    try {
           const response= await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result.name;
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}

/**
 * Saves edits made to an existing task by updating it in Firebase.
 * Gathers updated values from the form fields and calls the update function.
 * Shows a success message, reloads the page, and closes the overlay after 1 second.
 * @param {string} taskId - The ID of the task to update.
 */
async function saveEditedTask(taskId) {
    const updatedTask = {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: updatedPriority,
        assignedUsers: assignedContacts,
        category: document.getElementById("category_add_task").innerText, 
        subtasks: getNewSubtasks(),
    }
    await updateTaskInFirebase(taskId,updatedTask);
    showTaskMessage();
    setTimeout(() => {
        location.reload();
    }, 1000);
    setTimeout(closeOverlay, 1000);
}

/**
 * Displays a temporary success message after task creation.
 */
function showTaskMessage() {
    let messageDiv = document.getElementById("task-message");
    messageDiv.style.display = "flex";  
    messageDiv.classList.add("show");  
    setTimeout(() => {
        messageDiv.classList.remove("show");
        messageDiv.style.display = "none";  
    }, 3000); 
}

/**
 * Shows an error message for a specific field.
 * @param {string} message - The error message to display.
 * @param {string} errorId - The id of the error container element.
 */
function showErrorMessage(message, errorId) {
    let allErrorContainers = document.querySelectorAll('.error-message');
    
    for (let i = 0; i < allErrorContainers.length; i++) {
        allErrorContainers[i].style.display = 'none';
    }

    let errorContainer = document.getElementById(errorId);
    errorContainer.innerText = message;
    errorContainer.style.display = 'block';
}

/**
 * Resets the input fields of the task creation form.
 */
function resetFormFields() {
    document.getElementById("title_add_task").value;
    document.getElementById("description_add_task").value;
    document.getElementById("dateInput-add-task").value;
    document.getElementById("category_add_task").innerText = "Select task category"; 
}

/**
 * Clears the subtask input and the subtask list.
 */
function resetSubtasks() {
    document.getElementById("subtask").value = ""; 
    document.getElementById("added-subtasks").innerHTML = "";
}

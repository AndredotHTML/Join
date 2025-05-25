let assignedContacts =[];
let updatedPriority = ''; 

/**
 * Sets the selected category text and hides the category options dropdown.
 * @param {string} category - The category selected by the user.
 */
function selectCategory(category) {
    document.getElementById('category_add_task').innerText = category;
    document.getElementById('options_container').style.display = 'none';
    document.getElementById('arrowIconCategory').src = "/assets/icons/arrow_drop_down.svg"; 
}

/**
 * Toggles the visibility of the category options dropdown and changes the arrow icon accordingly.
 */
function toggleOptions() {
    const optionsContainer = document.getElementById('options_container');
    const arrowIcon = document.getElementById('arrowIconCategory');
    
    if (optionsContainer.style.display === 'none') {
        optionsContainer.style.display = 'block';
        arrowIcon.src = "../assets/icons/arrow_drop_down_close.svg"; 
    } else {
        optionsContainer.style.display = 'none';
        arrowIcon.src = "../assets/icons/arrow_drop_down.svg"; 
    }
}

/**
 * Enables the subtask input field and shows the subtask action icons.
 */
function showSubtaskActions() {
    let subtaskInput = document.getElementById("subtask");
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskInput.disabled = false;   
    subtaskIcons.innerHTML = subtaskActionsTemplate();
}

/**
 * Adds a new subtask to the subtask list from the input field.
 * Clears the input and resets icons afterward.
 */
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

/**
 * Generates HTML for a list of subtasks.
 * @param {Array<{title: string}>} subtasks - Array of subtasks.
 * @returns {string} HTML string representing all subtasks.
 */
function generateSubtasksHtml(subtasks) {
    let subtasksHtml = ''; 
    if (subtasks && subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            subtasksHtml += subtaskTemplate(subtasks[i].title);
        }
    }
    return subtasksHtml; 
}

/**
 * Resets subtask input field to disabled state and restores default subtask icons.
 */
function resetSubtaskIcons() {
    let subtaskInput = document.getElementById("subtask");
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskInput.disabled = true;  
    subtaskIcons.innerHTML = `<img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">`;
    document.getElementById("subtask").value = "";  
}

/**
 * Enables editing mode on a subtask item.
 * @param {HTMLElement} icon - The edit icon clicked.
 */
function editSubtask(icon) {
    let subtaskItem = icon.closest('.added_subtask');
    let subtaskText = subtaskItem.querySelector('.subtask_text'); 
    let deleteIcon = subtaskItem.querySelector('.delete-icon');
    let checkIcon = subtaskItem.querySelector('.check-icon'); 
    let editIcon = subtaskItem.querySelector('.edit-icon');

    subtaskText.contentEditable = "true";  
    subtaskText.focus(); 
    subtaskItem.classList.add('editing');
    editIcon.style.display='none';
    deleteIcon.style.display = 'inline';
    checkIcon.style.display = 'inline'; 
}

/**
 * Confirms editing of a subtask, disables content editing mode.
 * @param {HTMLElement} icon - The check icon clicked to confirm edit.
 */
function confirmEdit(icon) {
    let subtaskItem = icon.closest('.added_subtask');
    let subtaskText = subtaskItem.querySelector('.subtask_text');
    let checkIcon = subtaskItem.querySelector('.check-icon');
    let editIcon = subtaskItem.querySelector('.edit-icon');

    subtaskText.contentEditable = "false";
    checkIcon.style.display = 'none';
    editIcon.style.display='inline';
    subtaskItem.classList.remove('editing');
}

/**
 * Deletes a subtask item from the list.
 * @param {HTMLElement} icon - The delete icon clicked.
 */
function deleteSubtask(icon) {
    let subtaskItem = icon.closest('.added_subtask');
    subtaskItem.remove();
}

/**
 * Displays the list of contacts with checkboxes indicating selected users.
 */
function displayContacts() {
    let contactMenu = document.getElementById('contactDropdown');
    let selectedUsers = JSON.parse(localStorage.getItem('selectedUsers')) || [];
    contactMenu.innerHTML = '';

    for (let index = 0; index < contacts.length; index++) {
        let element = contacts[index];
        let isChecked = selectedUsers.includes(element.name);
        contactMenu.innerHTML += generateSingleUser(element, isChecked);
    }
}

/**
 * Toggles the dropdown menu for selecting contacts and the container showing selected users.
 */
function toggleUserDropdown() {
    let contactMenu = document.getElementById("contactDropdown");
    let arrowIcon = document.getElementById("arrowIcon");
    let selectedUsersContainer = document.getElementById("selected_user_container");

    toggleContactMenu(contactMenu, arrowIcon);
    toggleSelectedUsersContainer(selectedUsersContainer);
}

/**
 * Helper to toggle the contact dropdown menu visibility and update arrow icon.
 * @param {HTMLElement} contactMenu - The dropdown menu container.
 * @param {HTMLElement} arrowIcon - The arrow icon element.
 */
function toggleContactMenu(contactMenu, arrowIcon) {
    if (contactMenu.style.display === "flex") {
        contactMenu.style.display = "none";
        arrowIcon.src = "/assets/icons/arrow_drop_down.svg"; 
    } else {
        contactMenu.style.display = "flex";
        displayContacts(); 
        arrowIcon.src = "/assets/icons/arrow_drop_down_close.svg";
    }
}

/**
 * Helper to toggle the display of the selected users container based on its content.
 * @param {HTMLElement} selectedUsersContainer - Container for selected user icons.
 */
function toggleSelectedUsersContainer(selectedUsersContainer) {
    if (selectedUsersContainer.innerHTML.trim() === "") {
        selectedUsersContainer.style.display = "none"; 
    } else {
        selectedUsersContainer.style.display = "inline-flex";
        selectedUsersContainer.style.paddingLeft = "10px";
        selectedUsersContainer.style.paddingTop = "10px";
    }
}

/**
 * Updates the list of assigned contacts based on checked checkboxes and stores it locally.
 */
function updateSelectedUsers() {
    assignedContacts = getCheckedUsers();
    renderSelectedUserIcons(assignedContacts, "selected_user_container");
    localStorage.setItem('selectedUsers', JSON.stringify(assignedContacts));
}

/**
 * Retrieves the list of checked user names from the contacts list.
 * @returns {string[]} Array of selected user names.
 */
function getCheckedUsers() {
    let selected = [];
    for (let contact of contacts) {
        let checkbox = document.getElementById(`user-${contact.id}`);
        if (checkbox && checkbox.checked) {
            selected.push(contact.name);
        }
    }
    return selected;
}

/**
 * Renders user icons for the given list of user names inside a container.
 * Shows a "+N" icon if more than max icons are present.
 * @param {string[]} userList - Array of user names.
 * @param {string} containerId - The id of the container to render icons into.
 */
function renderSelectedUserIcons(userList, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = '';
    let maxIcons = 5;
    for (let i = 0; i < userList.length && i < maxIcons; i++) {
        let contact = contacts.find(c => c.name === userList[i]);
        if (contact) container.innerHTML += generateUserIcon(contact);
    }
    if (userList.length > maxIcons) {
        let remaining = userList.length - maxIcons;
        container.innerHTML += `<span class="user-icon more_users">+${remaining}</span>`;
    }
}

/**
 * Renders user icons from a list of assigned contacts (by name).
 */
function showSelectedUsersFromTask() {
    renderUserIconsFromNames(assignedContacts, "selected_user_container");
}

/**
 * Renders user icons given an array of user names inside a specified container.
 * @param {string[]} userNames - Array of user names.
 * @param {string} containerId - The id of the container to render into.
 */
function renderUserIconsFromNames(userNames, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = '';
    let maxIcons = 5;
    for (let i = 0; i < userNames.length && i < maxIcons; i++) {
        container.innerHTML += generateUserIconFromName(userNames[i]);
    }
    if (userNames.length > maxIcons) {
        let remaining = userNames.length - maxIcons;
        container.innerHTML += `<span class="user-icon more_users">+${remaining}</span>`;
    }
}

/**
 * Generates a user icon element (initials with background color) from a user name.
 * @param {string} userName - Full name of the user.
 * @returns {string} HTML span element string for the user icon.
 */
function generateUserIconFromName(userName) {
    let parts = userName.trim().split(' ');
    let initials = parts[0][0];
    if (parts.length > 1) {
        initials += parts[1][0];
    }
    let color = getColorForUser(userName); 
    return `
        <span class="user-icon" style="background-color: ${color};">${initials}</span>
    `;
}

/**
 * Creates a new task with a given status, validates input, posts to backend, and updates UI.
 * @param {string} status - Status of the new task (e.g., "toDo", "inProgress").
 */
async function createTaskByStatus(status) {
    await pushToContactsArray();
    const task = taskObject(status);
    if (!validateForm(task.title, task.dueDate, task.priority, task.category)) return;

    let newId = await postTask("/tasks", task);
    if (newId) {
        task.id = newId;
        tasks.push(task);
        updateTaskOnBoard(status, task);
    }
    createTaskFinale();
}

/**
 * Constructs a task object from the form inputs and assigned contacts.
 * @param {string} status - Status of the task.
 * @returns {Object} Task object ready to be saved.
 */
function taskObject(status) {
    return {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: getPriority(),
        assignedUsers: assignedContacts,
        category: document.getElementById("category_add_task").innerText,
        subtasks: getNewSubtasks(),
        status: status
    };
}

/**
 * Updates the task on the board based on its status.
 * @param {string} status - Status of the task.
 * @param {Object} task - The task object to update.
 */
function updateTaskOnBoard(status, task) {
    if (status === 'toDo') updateToDo(task);
    else if (status === 'inProgress') updateInProgress(task);
    else if (status === 'awaitFeedback') updateAwaitFeedback(task);
}

/**
 * Shows a confirmation message, resets the form and subtasks, reloads page, and closes overlay.
 */
function createTaskFinale() {
    showTaskMessage();
    resetFormFields();
    resetSubtasks();
    setTimeout(() => {
        location.reload();
    }, 1000);
    setTimeout(closeOverlay, 1000);
}

/**
 * Validates the task creation form fields.
 * @param {string} title - Task title.
 * @param {string} dueDate - Due date.
 * @param {string} priority - Priority level.
 * @param {string} category - Task category.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm(title, dueDate, priority, category) {
    if (!title) {
        showErrorMessage('Please enter a title.', 'title-error');
        return false;
    }
    if (!dueDate) {
        showErrorMessage('Please select a date.', 'date-error');
        return false;
    }
    if (!priority) {
        showErrorMessage('Please select a priority.', 'priority-error');
        return false;
    }
    if (!category || category === "Select category") {
        showErrorMessage('Please select a category.', 'category-error');
        return false;
    }
    return true; 
}

/**
 * Retrieves the selected priority radio button value.
 * @returns {string|null} Priority string or null if none selected.
 */
function getPriority() {
    if (document.getElementById("urgent-rad").checked) return "Urgent";
    if (document.getElementById("medium-rad").checked) return "Medium";
    if (document.getElementById("low-rad").checked) return "Low";
    return null;
}

/**
 * Extracts subtasks from the DOM and returns them as an array of objects.
 * @returns {Array<{title: string, completed: boolean}>} List of subtasks.
 */
function getNewSubtasks() {
    let subtasks = [];
    let subtaskElements = document.querySelectorAll("#added-subtasks li");

    for (let i = 0; i < subtaskElements.length; i++) {
        let subtaskTextElement = subtaskElements[i].querySelector('.subtask_text');
        if (subtaskTextElement) {
            subtasks.push({
                title: subtaskTextElement.textContent.trim(),
                completed: false
            });
        }
    }
    return subtasks;
}





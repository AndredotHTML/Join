let assignedContacts =[];
let updatedPriority = ''; 

function selectCategory(category) {
    document.getElementById('category_add_task').innerText = category;
    document.getElementById('options_container').style.display = 'none';
    document.getElementById('arrowIconCategory').src = "/assets/icons/arrow_drop_down.svg"; 
}

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

function showSubtaskActions() {
    let subtaskInput = document.getElementById("subtask");
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskInput.disabled = false;   
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

function generateSubtasksHtml(subtasks) {
    let subtasksHtml = ''; 
    if (subtasks && subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            subtasksHtml += subtaskTemplate(subtasks[i].title);
        }
    }
    return subtasksHtml; 
}

function subtaskTemplate(subtaskValue){
    return `<li class="added_subtask">
             <span class="subtask_text">${subtaskValue}</span>
            <div class="subtask_actions">
                <img src="../assets/icons/edit.png" alt="Edit" class="edit-icon"  onclick="editSubtask(this)">
                <img src="../assets/icons/delete.png" alt="Delete" class="delete-icon" onclick="deleteSubtask(this)">
                <img src="../assets/icons/check.png" alt="Confirm" class="check-icon" onclick="confirmEdit(this)" style="display:none;">
            </div></li>`
}


function resetSubtaskIcons() {
    let subtaskInput = document.getElementById("subtask");
    let subtaskIcons = document.getElementById("subtask-icons");

    subtaskInput.disabled = true;  
    subtaskIcons.innerHTML = `<img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">`;
    document.getElementById("subtask").value = "";  
}

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

function deleteSubtask(icon) {
    let subtaskItem = icon.closest('.added_subtask');
    subtaskItem.remove();
}

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

function generateSingleUser(element, isChecked) {
    let name = element.name; 
    let nameParts = name.split(' ');
    let initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : name[0];
    let color = getColorForUser(name); 

    return `
        <label for="user-${element.id}" class="user-item">
            <span class="user-icon" style="background-color: ${color};">${initials}</span>
            <span class="user-name">${name}</span>
            <input type="checkbox" id="user-${element.id}" value="${name}" ${isChecked ? 'checked' : ''} onchange="updateSelectedUsers()">
            <span class="checkbox-custom"></span>
        </label>
    `;
}

function generateUserIcon(user) {
    let name = user.name;
    let nameParts = name.split(' ');
    let initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : name[0];
    let color = getColorForUser(name); 

    return `
        <span class="user-icon" style="background-color: ${color};">${initials}</span>
    `;
}


function toggleUserDropdown() {
    let contactMenu = document.getElementById("contactDropdown");
    let arrowIcon = document.getElementById("arrowIcon");
    let selectedUsersContainer = document.getElementById("selected_user_container");

    toggleContactMenu(contactMenu, arrowIcon);
    toggleSelectedUsersContainer(selectedUsersContainer);
}

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

function toggleSelectedUsersContainer(selectedUsersContainer) {
    if (selectedUsersContainer.innerHTML.trim() === "") {
        selectedUsersContainer.style.display = "none"; 
    } else {
        selectedUsersContainer.style.display = "inline-flex";
        selectedUsersContainer.style.paddingLeft = "10px";
        selectedUsersContainer.style.paddingTop = "10px";
    }
}

function updateSelectedUsers() {
    assignedContacts = getCheckedUsers();
    renderSelectedUserIcons(assignedContacts, "selected_user_container");
    localStorage.setItem('selectedUsers', JSON.stringify(assignedContacts));
}

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

function showSelectedUsersFromTask() {
    renderUserIconsFromNames(assignedContacts, "selected_user_container");
}

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

async function createTask() {
    const task =taskObject();
    if (!validateForm(task.title, task.dueDate, task.priority, task.category)) return;
    let newId= await postTask("/tasks", task);
    if (newId) {
        task.id = newId; 
        tasks.push(task);
        updateToDo(task);
    }
    createTaskFinale();
}

async function createTaskInProgress() {
    await  pushToContactsArray(); 
    const task =taskObjectInProgress();
    if (!validateForm(task.title, task.dueDate, task.priority, task.category)) return;
    let newId= await postTask("/tasks", task);
    if (newId) {
        task.id = newId; 
        tasks.push(task);
        updateInProgress(task);
    }
    createTaskFinale();
}

async function createTaskAwaitFeedback() {
    await  pushToContactsArray();
    const task =taskObjectAwaitFeedback();
    if (!validateForm(task.title, task.dueDate, task.priority, task.category)) return;
    let newId= await postTask("/tasks", task);
    if (newId) {
        task.id = newId; 
        tasks.push(task);
        updateAwaitFeedback(task);
    }
    createTaskFinale();
}

function taskObject() {
    return {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: getPriority(),
        assignedUsers: assignedContacts,
        category: document.getElementById("category_add_task").innerText, 
        subtasks: getNewSubtasks(),
        status: "toDo"
    };
}

function taskObjectInProgress() {
    return {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: getPriority(),
        assignedUsers: assignedContacts,
        category: document.getElementById("category_add_task").innerText, 
        subtasks: getNewSubtasks(),
        status: "inProgress"
    };
}

function taskObjectAwaitFeedback() {
    return {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: getPriority(),
        assignedUsers: assignedContacts,
        category: document.getElementById("category_add_task").innerText, 
        subtasks: getNewSubtasks(),
        status: "awaitFeedback"
    };
}

function createTaskFinale() {
    showTaskMessage();
    resetFormFields();
    resetSubtasks();
    setTimeout(() => {
        location.reload();
    }, 1000);
    setTimeout(closeOverlay, 1000);
}

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

function getPriority() {
    if (document.getElementById("urgent-rad").checked) return "Urgent";
    if (document.getElementById("medium-rad").checked) return "Medium";
    if (document.getElementById("low-rad").checked) return "Low";
    return null;
}

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

function showTaskMessage() {
    let messageDiv = document.getElementById("task-message");
    messageDiv.style.display = "flex";  
    messageDiv.classList.add("show");  
    setTimeout(() => {
        messageDiv.classList.remove("show");
        messageDiv.style.display = "none";  
    }, 3000); 
}

function showErrorMessage(message, errorId) {
    let allErrorContainers = document.querySelectorAll('.error-message');
    
    for (let i = 0; i < allErrorContainers.length; i++) {
        allErrorContainers[i].style.display = 'none';
    }

    let errorContainer = document.getElementById(errorId);
    errorContainer.innerText = message;
    errorContainer.style.display = 'block';
}

function resetFormFields() {
    document.getElementById("title_add_task").value;
    document.getElementById("description_add_task").value;
    document.getElementById("dateInput-add-task").value;
    document.getElementById("category_add_task").innerText = "Select task category"; 
}

function resetSubtasks() {
    document.getElementById("subtask").value = ""; 
    document.getElementById("added-subtasks").innerHTML = "";
}




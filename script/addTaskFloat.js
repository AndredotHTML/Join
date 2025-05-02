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

function subtaskTemplate( subtaskValue){
    return `<li class="added_subtask">
             <span class="subtask_text">${subtaskValue}</span>
            <div class="subtask_actions">
                <img src="../assets/icons/edit.png" alt="Edit" class="edit-icon"  onclick="editSubtask(this)">
                <img src="../assets/icons/delete.png" alt="Delete" class="delete-icon" onclick="deleteSubtask(this)">
                <img src="../assets/icons/check.png" alt="Confirm" class="check-icon" onclick="confirmEdit(this)" style="display:none;">
            </div></li>`
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
    assignedContacts = [];
    let selectedUsersContainer = document.getElementById("selected_user_container");
    selectedUsersContainer.innerHTML = ''; 
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let userCheckbox = document.getElementById(`user-${contact.id}`);
        if (userCheckbox && userCheckbox.checked) {
            assignedContacts.push(contact.name);
            let userIcon = generateUserIcon(contact);
            selectedUsersContainer.innerHTML += userIcon;
        }
    }
    localStorage.setItem('selectedUsers', JSON.stringify(assignedContacts));
}

function showSelectedUsersFromTask() {
    let selectedUsersContainer = document.getElementById("selected_user_container");
    selectedUsersContainer.innerHTML = '';
    let users = assignedContacts;  
    for (let i = 0; i < users.length; i++) {
        let userName = users[i];
        if (userName) {
            let userIcon = generateUserIconFromName(userName);
            selectedUsersContainer.innerHTML += userIcon;
        }
    }
}

function generateUserIconFromName(userName) {
    let initials = `${userName.split(' ')[0][0]}${userName.split(' ')[1][0]}`; 
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




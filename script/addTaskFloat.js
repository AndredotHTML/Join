let assignedUsers =[];

function radioBtnChecked(priority) {
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

function selectCategory(category) {
    document.getElementById('category_add_task').innerHTML = category;
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

function displayUsers(){
    let contactMenu = document.getElementById('contactDropdown');
    let selectedUsers = JSON.parse(localStorage.getItem('selectedUsers')) || [];
    contactMenu.innerHTML = '';

    for (let index = 0; index < users.length; index++) {
       let element = users[index];
       let isChecked = selectedUsers.includes(element.userData.name); 
       contactMenu.innerHTML += generateSingleUser(element,isChecked); 
    }
}

function generateSingleUser(element,isChecked) {
    let name = element.userData.name;
    let initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    let color = getColorForUser(name); 

    return `
        <label for="user-${element.id}" class="user-item">
            <span class="user-icon" style="background-color: ${color};">${initials}</span>
            <span class="user-name">${name}</span>
            <input type="checkbox" id="user-${element.id}" value="${name}" ${isChecked ? 'checked' : ''}  onclick="updateSelectedUsers()">
             <span class="checkbox-custom"></span>
        </label>
    `;
}

function generateUserIcon(user) {
    let name = user.userData.name;
    let initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
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
        displayUsers(); 
        arrowIcon.src = "/assets/icons/arrow_drop_down_close.svg";
    }
}

function toggleSelectedUsersContainer(selectedUsersContainer) {
    if (selectedUsersContainer.innerHTML.trim() === "") {
        selectedUsersContainer.style.display = "none"; 
    } else {
        selectedUsersContainer.style.display = "inline-flex";
    }
}

function updateSelectedUsers() {
    assignedUsers = [];

    let selectedUsersContainer = document.getElementById("selected_user_container");
    selectedUsersContainer.innerHTML = ''; 

    for (let i = 0; i < users.length; i++) {
        let userCheckbox = document.getElementById(`user-${users[i].id}`);
        if (userCheckbox && userCheckbox.checked) {
            assignedUsers.push(users[i].userData.name);

            let userIcon = generateUserIcon(users[i]);
            selectedUsersContainer.innerHTML += userIcon;
        }
    }
    localStorage.setItem('selectedUsers', JSON.stringify(assignedUsers));
}

async function createTask() {
    await pushToUsersArray(); 
    let title = document.getElementById("title_add_task").value;
    let description = document.getElementById("description_add_task").value;
    let dueDate = document.getElementById("dateInput-add-task").value;
    let priority = getPriority();
    let category = document.getElementById("category_add_task").innerText;
    let subtasks = getNewSubtasks();

    if (!validateForm(title, dueDate, priority, category)) {
        return; 
    }

    const task = {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        assignedUsers: assignedUsers, 
        category: category,
        subtasks: subtasks,
        status: "toDo"
    };

    postTask("/tasks", task);
    updateToDo(task);
    showTaskMessage();
    resetFormFields(); 
    resetSubtasks();
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

function updateToDo(task){
    let toDo = document.getElementById('toDo');
    toDo.innerHTML +=generateTask(task);
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
        subtasks.push({
            title: subtaskElements[i].innerHTML, 
            completed: false
        });
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

async function postTask(path = "", data = {}) {
    try {
        const response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}


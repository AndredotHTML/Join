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


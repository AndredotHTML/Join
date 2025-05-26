/**
 * Adds a subtask if the input is not empty, then clears the input field
 */

function addSubtask() {
    let inputSubtaskRef = document.getElementById("subtask")
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    let inputSubtaskVal = inputSubtaskRef.value
    if (inputSubtaskVal.trim() !== "") {
        displaydSubtaskRef.innerHTML += subtaskTemplat(inputSubtaskVal)
        inputSubtaskRef.value = ""
    }
    placeForSubtasks()
}


/**
 * Adds bottom padding based on the count of subtasks.
 * @param {HTMLElement} displaydSubtaskRef The container holding all subtasks
 */

function placeForSubtasks() {
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    let countedSubtasks = displaydSubtaskRef.children.length
    let extraPadding = countedSubtasks * 44
    displaydSubtaskRef.style.paddingBottom = extraPadding+"px"
}


/**
 * Makes the subtasks editable and adds a blur listener for reset styling after editing.
 * @param {HTMLElement} element The list element to be edited
 */

function editSubtasks(element) {
    element.contentEditable = "true"
    element.style.listStyleType = "none"
    element.focus()
    let subtaskContainerRef = element.closest(".addedSubtask")
    let subtaskIconContainer = subtaskContainerRef.querySelector(".icon-for-subtask-work")
    let editContainer = subtaskIconContainer.querySelector(".subtask-edit-icons")
    styleSubtaskOnEditing(subtaskContainerRef, editContainer)
    element.addEventListener("blur", function () {
        styleSubtaskBlur(element, subtaskContainerRef, editContainer)
    });
}


/**
 * Styles the subtask when it is editable
 * @param {HTMLElement} subtaskContainerRef Container element with all subtask icon 
 * @param {HTMLElement} editContainer Container element with icons that have to be displayed, on editing
 */

function styleSubtaskOnEditing(subtaskContainerRef, editContainer) {
    subtaskContainerRef.classList.add("disable-hover")
    subtaskContainerRef.style.borderBottom = "1px solid #005DFF";
    subtaskContainerRef.style.borderRadius = "0"
    editContainer.classList.remove("d_none")
    editContainer.classList.add("d_flex", "d-f-row")
}


/**
 * Ends editing of the element and restore the origin style
 * @param {HTMLElement} element The list element to be edited
 * @param {HTMLElement} subtaskContainerRef Container element with all subtask icon 
 * @param {HTMLElement} editContainer Container element with icons that have to be displayed, on editing
 */

function styleSubtaskBlur(element, subtaskContainerRef, editContainer) {
    element.contentEditable = false
    element.style.listStyleType = ""
    editContainer.classList.remove("d_flex", "d-f-row")
    editContainer.classList.add("d_none")
    subtaskContainerRef.classList.remove("disable-hover")
    subtaskContainerRef.style.borderBottom = "";
    subtaskContainerRef.style.borderRadius = ""
}


/**
 * Deletes the selected subtask element
 * @param {HTMLElement} element The subtask list item to be deleted
 */

function deleteSubtask(element) {
    element.remove();
    placeForSubtasks()
}


/**
 * When Enter is pressed, prevent default behavior of the form.
 * @param {KeyboardEvent} event 
 */

function subtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask()
    }
}


/**
 * Toggles visibility of the subtask input icons.
 */

function changeSubtaskIconsOnInput() {
    let createSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    createSubtaskAreaRef.classList.toggle("d_flex");
    createSubtaskAreaRef.classList.toggle("d_none");
    displaySubtaskIconRef.classList.toggle("d_none")
}


/**
 * Adds a new subtask and Toggles the visibility of the subtask input icons.
 */

function subtaskInputCheck() {
    addSubtask()
    changeSubtaskIconsOnInput()
}


/**
 * Sets fokus on the subtask input and toggles the subtask input icons
 */

function fokusSubtaskInp() {
    let subtaskInput = document.getElementById("subtask")
    subtaskInput.focus()
    changeSubtaskIconsOnInput()
}


/**
 * Changes the subtask input icons when the input field loses fokus. 
 * @param {FokusEvent} event The fokus event triggered on losing focus
 */

function hideSubtaskIcons(event) {
    let createSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    let subtaskAreaRef = document.getElementById("subtask-area")
    if (subtaskAreaRef.contains(event.relatedTarget)) {
        return
    }
    changeSubtaskIconsOnInput()
    createSubtaskAreaRef.classList.remove("d_flex");
    createSubtaskAreaRef.classList.add("d_none");
    displaySubtaskIconRef.classList.remove("d_none")
}


/**
 * Changes the subtask input icons when the input field is fokused
 */

function showSubtaskIcons() {
    let createSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener");
    createSubtaskAreaRef.classList.add("d_flex");
    createSubtaskAreaRef.classList.remove("d_none");
    displaySubtaskIconRef.classList.add("d_none");
}


/**
 * Clears the subtask input and reset icons and styles on default.
 */

function clearInputSubtask() {
    let inputSubtaskRef = document.getElementById("subtask");
    inputSubtaskRef.value = "";
    changeSubtaskIconsOnInput();
    placeForSubtasks();
}

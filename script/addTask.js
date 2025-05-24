const form = document.getElementById("form-add-task");
let lastCursPos = 0


function authLogIn() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "http://127.0.0.1:5500/html/index.html";
    }
}


function stopPropagation(event) {
    event.stopPropagation()
}


/**
 * Stores the last position of the cursor of the first textarea in a global variable "lastCursPos"
 */

function lastCursorPosition() {
    let textarea = document.querySelector("textarea")
    lastCursPos = textarea.selectionStart;
}


/**
 * Set the cursor at the start of the textarea if it's empty,
 *  or at the end of the content if you click beyond it.
 */

function textareaCursPos() {
    let textarea = document.querySelector("textarea")
    if (textarea.value.trim() == "") {
        textarea.setSelectionRange(0, 0)
    } else if (textarea.selectionStart >= lastCursPos) {
        textarea.setSelectionRange(lastCursPos, lastCursPos)
    }
}


/**
 * Enables resizeing the textarea by dragging, on mousedown save the mouse position and textarea height.
 * on mousemove, adjusts the height by the Y-difference ,stop it on mouseup.
 * @param {MouseEvent} event click on the resize element to store the current mouse position and textarea height
 */

function resizeTextarea(event) {
    let textareaRef = document.getElementById("description-add-task")
    let mousePos = event.clientY
    let textareaHeight = textareaRef.offsetHeight
    document.addEventListener('mousemove', newHeightTA)
    function newHeightTA(e) {
        let mousePosDif = e.clientY - mousePos
        textareaRef.style.height = `${textareaHeight + mousePosDif}px`
    }
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', newHeightTA)
    }, { once: true });
}


/**
 * Checks every click to see is it inside the wrapper, if not closes the dropdown menu and the input lose focus 
 */

document.addEventListener("click", function (e) {
    let wrapper = document.querySelector(".wrapper-assigned-to")
    if (!wrapper.contains(e.target)) {
        if (isAssignedDropdownOpen) {
            closeDropdown();
            blurAssig()
            isAssignedDropdownOpen = false
        }
    }
})


/**
 * Prevents the default form submission  and checks that the form is valid
 * @param {SubmitEvent} event The submit
 */

function submitForm(event) {
    event.preventDefault();
    let valide = true
    clearValidationAreas()
    errMsgAreaAndInputs()
    if (valide === true) {
        createTask()
    }
}


/**
 * Checks the inputs, if them empty calls the errorMsg() for each one
 */

function errMsgAreaAndInputs() {
    let inputToValidateTitle = document.getElementById("title-add-task");
    let requiredTitleRef = document.getElementById("title-validation");
    let inputToValidateDate = document.getElementById("date-input-add-task");
    let requiredDateRef = document.getElementById("date-validation");
    let inputToValidateCategory = document.getElementById("category-add-task")
    let categoryWrapper = document.getElementById("select-category")
    let requiredCategoryRef = document.getElementById("category-validation")
    inputValidation(inputToValidateTitle,requiredTitleRef,inputToValidateDate,requiredDateRef,inputToValidateCategory,categoryWrapper,requiredCategoryRef)
}

function inputValidation(inputToValidateTitle,requiredTitleRef,inputToValidateDate,requiredDateRef,inputToValidateCategory,categoryWrapper,requiredCategoryRef) {
    if (inputToValidateTitle.value === "") {
        errorMsg(requiredTitleRef, inputToValidateTitle)
    }
    if (inputToValidateDate.value === "") {
        errorMsg(requiredDateRef, inputToValidateDate)
    }
    if (inputToValidateCategory.innerHTML.trim() == "Select task category") {
       errorMsg(requiredCategoryRef, categoryWrapper)
    }
}


/**
 * Marks the input as empty and shows an error message
 * @param {HTMLElement} inputToValidate Input that have to be marked if it is empty
 * @param {HTMLElement} requiredRef Container in which the error messege is displayed
 */

function errorMsg(requiredRef, inputToValidate) {
    let errMsg = "This field is required"
    requiredRef.innerHTML = errMsg;
    requiredRef.style.color = "#FF8190"
    inputToValidate.style.borderBottom = "1px solid #FF8190";
    valide = false
}


/**
 * Delete the error message and turn back the style of the input border
 * @param {HTMLElement} element Input which style have to be reseted
 */

function resValidOnInp(element) {
    let wrapperRef = element.closest(`[class*="-wrapper"]`)
    let validAreaRef = wrapperRef.querySelector(".validation-add-task-form")
    validAreaRef.innerHTML = "";
    element.style.borderBottom = "";
}


function resValidCategory(element) {
    let validAreaRef = document.getElementById("category-validation")
    validAreaRef.innerHTML = "";
    element.style.borderBottom = "";
}

/**
 * Iterates over the validation messengs and clear their content
 */

function clearValidationAreas() {
    let validationAreaRef = document.getElementsByClassName("validation-add-task-form");
    for (let index = 0; index < validationAreaRef.length; index++) {
        let singValidArea = validationAreaRef[index];
        singValidArea.innerHTML = "";
    }
}


/**
 * Resets the styles of the priority buttons and highlights the checked one.
 * @param {string} priority Show the urgency ('low', 'medium', 'urgent')
 */

function radioBtnChecked(priority) {
    let labelList = document.querySelectorAll(".radio-btn")
    let inputRef = document.getElementById(priority + "-rad")
    let labelRef = document.querySelector('label[for="' + priority + '-rad"]')
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
    if (inputRef.checked) {
        labelRef.style.backgroundColor = `var(--${priority}Color)`;
        labelRef.style.color = `var(--secondaryColor)`;
    }
}


/**
 * Resets the inputs of the form
 */

function clearForm() {
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    let categoryRef = document.getElementById("category-add-task")
    let assignedToAreaRef = document.getElementById("assigned-to-display")
    document.forms[0].reset()
    assignedToAreaRef.innerHTML = ""
    categoryRef.innerHTML = "Select task category"
    displaydSubtaskRef.innerHTML = ""
    radioBtnChecked("medium")
    clearValidationAreas()
    clearStyleChange()
    placeForSubtasks()
}

function clearStyleChange() {
    let titleRef = document.getElementById("title-add-task")
    let dateRef = document.getElementById("date-input-add-task")
    let categoryRef = document.getElementById("select-category")
    titleRef.style.borderBottom = "";
    dateRef.style.borderBottom = "";
    categoryRef.style.borderBottom = "";
}


/**
 * Enables the create button when all required inputs (title , date, priority, category) are filled
 */

function enabledCreateBtn() {
    let titleNewTaskRef = document.getElementById("title-add-task")
    let dateNewTaskRef = document.getElementById("date-input-add-task")
    let priorityNewTaskRef = document.querySelector('input[name="priority"]:checked')
    let categoryNewTaskRef = document.getElementById("category-add-task")
    let btn = document.getElementById("add-task-create-btn")
    if (titleNewTaskRef.value !== "" && dateNewTaskRef.value !== "" && priorityNewTaskRef !== null && categoryNewTaskRef.innerText !== "Select task category") {
        btn.disabled = false
    }
    else {
        btn.disabled = true
    }
}


/**
 * Creates a template for every contact, including the current user,  which collects and then displays them all at once.
 * Highlights the current user by appending "You" after their name
 */

function displayContacts() {
    let currentUser = user[0] || 'guest';
    let userArray = searchAssigned()
    sortUserToTheTop(userArray, currentUser)
    let selectedContacts = assignedContactsToData()
    let assignedToAreaRef = document.getElementById("assigned-to-display")
    let allContacts = ""
    userArray.forEach(contact => {
        let isChecked = selectedContacts.includes(contact.name)
        let isCurrentUser = contact.name === currentUser.name
        allContacts += templateAssignedTo(contact, isChecked, isCurrentUser)
    });
    assignedToAreaRef.innerHTML = allContacts
}


/**
 * Sorts the contacts so that the current user are at the top of the list 
 * @param {Array<Object>} userArray An array with data objects from the contacts
 * @param {Object} currentUser An object with data from the current user
 */

function sortUserToTheTop(userArray, currentUser) {
    userArray.sort((a, b) => {
        if (a.name === currentUser.name) { return -1 }
        if (b.name === currentUser.name) { return 1 }
        return 0
    })
}
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
 * Filtera non-numeric characters from a date input and reconstructs the date as dd/mm/yyyy
 * @example 10/04/2025
*/

function customDateInput() {
    let dateInputRef = document.getElementById("date-input-add-task");
    let dateInputVal = dateInputRef.value.replace(/[^\d]/g, '');
    let dayInput = extractDay(dateInputVal)
    let monthInput = extractMonth(dateInputVal)
    let yearInput = extractYear(dateInputVal)
    let customDateInput = `${dayInput}` + `${monthInput}` + `${yearInput}`
    dateInputRef.value = customDateInput
}


/**
 * Checks the first two characters of the input for valid day input
 * @param {number} dateInputVal filtert input from customDateInput()
 * @returns days for the reconstruction of the date
 */

function extractDay(dateInputVal) {
    if (dateInputVal.length >= 1) {
        let day = dateInputVal.slice(0, 2)
        if (day > 31) {
            day = 31
        }

        return day
    }
    return ""
}


/**
 * Checks the 3rd and 4th characters of the input for valid (01-12) month input
 * @param {number} dateInputVal filtered input from customDateInput()
 * @returns A "/" and a month (2 numbers) for the reconstruction of the date
 */

function extractMonth(dateInputVal) {
    if (dateInputVal.length >= 3) {
        let month = dateInputVal.slice(2, 4)
        if (month > 12) {
            month = 12
        }
        return "/" + month
    }
    return ""
}


/**
 * Validate the 5th to 8th Characters of the date input for reconstruction of the year
 * @param {number} dateInputVal filtered input from customDateInput()
 * @returns A "/" and a year (4 numbers) capt on 2099  for reconstruction of the date
 */

function extractYear(dateInputVal) {
    if (dateInputVal.length >= 5) {
        let year = dateInputVal.slice(4, 8)
        if (year >= 2100) {
            let twoThousend = 20
            let tenthYear = dateInputVal.slice(6, 8)
            year = twoThousend + tenthYear
        }
        return "/" + year
    }
    return ""
}


function showPicker() {
    let pickerRef = document.getElementById("nativ-date-input")
    pickerRef.showPicker()
}


/**
 * Transfers the selected date from the nativ picker to the custom date input in the changed format (dd/mm/yyyy)
 */

function transferFromPicker() {
    let pickerRef = document.getElementById("nativ-date-input")
    let dateInputRef = document.getElementById("date-input-add-task")
    let reversedDate = pickerRef.value.split("-").reverse().join("/")
    dateInputRef.value = reversedDate
}


/**
 * Iterates over the validation messengs and clear their content
 */

function clearValidationArea() {
    let validationAreaRef = document.getElementsByClassName("validation-add-task-form");
    for (let index = 0; index < validationAreaRef.length; index++) {
        let singValidArea = validationAreaRef[index];
        singValidArea.innerHTML = "";
    }
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
    }else if (textarea.selectionStart >= lastCursPos) {
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
    clearValidationArea()
    errMsgAreaControl()
    if (valide === true) {
        createTask()
    }
}


/**
 * Checks the inputs, if them empty calls the errorMsg() for each one
 */

function errMsgAreaControl() {
    let inputToValidateTitle = document.getElementById("title-add-task");
    let requiredTitleRef = document.getElementById("title-validation");
    let inputToValidateDate = document.getElementById("date-input-add-task");
    let requiredDateRef = document.getElementById("date-validation");
    if (inputToValidateTitle.value === "") {
        errorMsg(requiredTitleRef, inputToValidateTitle)
    }
    if (inputToValidateDate.value === "") {
        errorMsg(requiredDateRef, inputToValidateDate)
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
    let wrapperRef = element.closest(`[class$="-wrapper"]`)
    let validAreaRef = wrapperRef.querySelector(".validation-add-task-form")
    validAreaRef.innerHTML = "";
    element.style.borderBottom = "";
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
    clearValidationArea()
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
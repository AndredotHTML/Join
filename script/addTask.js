let isDropdownOpen = false;
const form = document.getElementById("form-add-task");
let lastCursPosDisc = 0
let openDD = false
let placeForCheckedIcon = false

function authLogIn() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "http://127.0.0.1:5500/html/index.html"; 
      }
}

function stopPropagation(event) {
    event.stopPropagation()
}

/** changes the date format and limits the days and months
 * @example 10/04/2025
  */

function customDateInput() {
    let dateInputRef = document.getElementById("date-input-add-task");
    let dateInputVal = dateInputRef.value.replace(/[^\d]/g, '');
    let dayInput = day(dateInputVal)
    let monthInput = month(dateInputVal)
    let yearInput = year(dateInputVal)
    let customDateInput = `${dayInput}` + `${monthInput}` + `${yearInput}`
    dateInputRef.value = customDateInput
}

function day(dateInputVal) {
    if (dateInputVal.length >= 1) {
        let day = dateInputVal.slice(0, 2)
        if (day > 31) {
            day = 31
        }
        return day
    }
    return ""
}

function month(dateInputVal) {
    if (dateInputVal.length >= 3) {
        let month = dateInputVal.slice(2, 4)
        if (month > 12) {
            month = 12
        }
        return "/" + month
    }
    return ""
}

function year(dateInputVal) {
    if (dateInputVal.length >= 5) {
        let year = dateInputVal.slice(4, 8)
        return "/" + year
    }
    return ""
}

function showPicker() {
    let pickerRef = document.getElementById("nativ-date-input")
    pickerRef.showPicker()
}

function transferFromPicker() {
    let pickerRef = document.getElementById("nativ-date-input")
    let dateInputRef = document.getElementById("date-input-add-task")
    let reversDate = pickerRef.value.split("-").reverse().join("/")
    dateInputRef.value = reversDate
}

function clearValidationArea() {
    let validationAreaRef = document.getElementsByClassName("validation-add-task-form");
    for (let index = 0; index < validationAreaRef.length; index++) {
        let singValidArea = validationAreaRef[index];
        singValidArea.innerHTML = "";
    }
}

function textareaCursPos() {
    let textarea = document.querySelector("textarea")
    if (textarea.value.trim() == "") {
        textarea.setSelectionRange(0, 0)
    }if (textarea.selectionStart > lastCursPosDisc) {
        textarea.setSelectionRange(lastCursPosDisc, lastCursPosDisc)
    }
}

function lastCurserposition() {
    let textarea = document.querySelector("textarea")
    lastCursPosDisc = textarea.selectionStart;
}

function resizeTextarea(event) {
    let textareaRef = document.getElementById("description-add-task")
    let mousePos = event.clientY
    let textareaHeight = textareaRef.offsetHeight
    document.addEventListener('mousemove', newHeightTA)
    function newHeightTA(e) {
        let mouseMovePos = e.clientY - mousePos
        textareaRef.style.height = `${textareaHeight + mouseMovePos}px`
    }
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', newHeightTA)
    }, { once: true });
}

document.addEventListener("click", function (e) {
    let wrapper = document.querySelector(".wrapper-assigned-to")
    if (!wrapper.contains(e.target)) {
        if (isDropdownOpen) {
            closeDropdown();
            blurAssig()
            isDropdownOpen = false
        }
    }
})

form.addEventListener("submit", function (event) {
    event.preventDefault();
    let valide = true
    let inputToValidateTitle = document.getElementById("title-add-task");
    let requerdTitleRef = document.getElementById("title-validation");
    let inputToValidateDate = document.getElementById("date-input-add-task");
    let requerdDateRef = document.getElementById("date-validation");
    clearValidationArea()
    errMsgAreaControl(inputToValidateTitle, requerdTitleRef, inputToValidateDate, requerdDateRef)
    if (valide === true) {
        creatTask()
    }
})

function errorMsg(requerdRef, inputToValidate) {
    let errMsg = "This field is required"
    requerdRef.innerHTML = errMsg;
    requerdRef.style.color = "#FF8190"
    inputToValidate.style.borderBottom = "1px solid #FF8190";
    valide = false
}

function errMsgAreaControl(inputToValidateTitle, requerdTitleRef, inputToValidateDate, requerdDateRef) {
    if (inputToValidateTitle.value === "") {
        errorMsg(requerdTitleRef, inputToValidateTitle)
    }
    if (inputToValidateDate.value === "") {
        errorMsg(requerdDateRef, inputToValidateDate)
    }
}

function resValidOnInp(element) {
    let wrapperRef = element.closest(`[class$="-wrapper"]`)
    let validAreaRef = wrapperRef.querySelector(".validation-add-task-form")
    validAreaRef.innerHTML = "";
    element.style.borderBottom = "";
}

function radioBtnChecked(priority) {
    let labelList = document.querySelectorAll(".radio-btn")
    let priorityRef = priority
    let inputRef = document.getElementById(priorityRef + "-rad")
    let labelRef = document.querySelector('label[for="' + priorityRef + '-rad"]')
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
    if (inputRef.checked) {
        labelRef.style.backgroundColor = `var(--${priorityRef}Color)`;
        labelRef.style.color = `var(--secondaryColor)`;
    }
}

function addSubtask() {
    let inputSubtaskRef = document.getElementById("subtask")
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    let inputSubtaskVal = inputSubtaskRef.value
    if (inputSubtaskVal !== "") {
        displaydSubtaskRef.innerHTML += subtaskTemplat(inputSubtaskVal)
        inputSubtaskRef.value = ""
    }
}

function subtaskInputCheck(){
    addSubtask()
    changeSubtaskIcons()
}

function subtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask()
    }
}

function changeSubtaskIcons() {
    let creatSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    creatSubtaskAreaRef.classList.toggle("d_flex");
    creatSubtaskAreaRef.classList.toggle("d_none");
    displaySubtaskIconRef.classList.toggle("d_none")
}

function fokusSubtaskInp(){
    let subtaskInput = document.getElementById("subtask")
    subtaskInput.focus()
    changeSubtaskIcons()
}

function hideSubtaskIcons(event) {
    let creatSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    let subtaskAreaRef = document.getElementById("subtask-area")
    if (subtaskAreaRef.contains(event.relatedTarget)) {
        return
    }
    creatSubtaskAreaRef.classList.remove("d_flex");
    creatSubtaskAreaRef.classList.add("d_none");
    displaySubtaskIconRef.classList.remove("d_none")
}

function showSubtaskIcons() {
    let creatSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    creatSubtaskAreaRef.classList.add("d_flex");
    creatSubtaskAreaRef.classList.remove("d_none");
    displaySubtaskIconRef.classList.add("d_none")
}

function clearInputSubtask() {
    let inputSubtaskRef = document.getElementById("subtask")
    inputSubtaskRef.value = ""
    changeSubtaskIcons()
}

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

function enabledCreatBtn() {
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

function displayUser() {
    let currentUser = user[0]|| 'guest';
    currentUser.name = currentUser.name.slice(0,1).toUpperCase() + currentUser.name.slice(1)
    let userArray = searchAssigned()
    userArray.splice(0,0,currentUser)
    let selectedUser = assignetUserToData()
    let assignedToAreaRef = document.getElementById("assigned-to-display")
    let allContacts = ""
    userArray.forEach(contact => {
        let isChecked = selectedUser.includes(contact.name)
        let isCurrentUser = contact.name === currentUser.name
        allContacts += templateAssignedTo(contact, isChecked, isCurrentUser)
    });
    assignedToAreaRef.innerHTML = allContacts
}

function dropDownForAssigned() {
    if (!isDropdownOpen) {
        openDropdown();
    } else {
        closeDropdown();
        blurAssig()
    }
    isDropdownOpen = !isDropdownOpen;
}

function blurAssig() {
    let assignRef = document.getElementById("assigned-to-input")
    assignRef.value = ""
    assignRef.blur()
}

function openDropdown() {
    displayUser()
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedRef.classList.add("visible-assigned");
    assignedRef.classList.remove("visible-assigned-min")
    assignedRef.style.display = "flex";
    assignedRef.style.flexDirection = "column"
    arrowImgToggle(arrowOpenRef)
    styAssignedContOpen(assignedContactRef)
}

function styAssignedContOpen(assignedContactRef) {
    assignedContactRef.forEach(contact => {
        contact.style.display = "flex";
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let inputTemplate = contact.querySelector(".input-assigned");
        nameTemplate.style.display = "flex";
        inputTemplate.style.display = "flex";
    });
}

function closeDropdown() {
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedRef.style.flexDirection = "row"
    styAssignedContClosed(assignedContactRef, assignedRef)
    arrowImgToggle(arrowOpenRef)
}

function styAssignedContClosed(assignedContactRef, assignedRef) {
    assignedContactRef.forEach(contact => {
        let checkbox = contact.querySelector("input[type='checkbox']");
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let contactLabel = contact.querySelector("label")
        if (checkbox.checked) {
            styleForCheckedCont(contact, nameTemplate, checkbox, contactLabel)
            placeForCheckedIcon = true
        } else {
            contact.classList.remove("visible-assigned");
        }
    });
    styAssignedAreaClose(assignedRef)
}

function styAssignedAreaClose(assignedRef) {
    if (placeForCheckedIcon) {
        assignedRef.classList.remove("visible-assigned")
        assignedRef.classList.add("visible-assigned-min")
    } else {
        assignedRef.classList.remove("visible-assigned", "visible-assigned-min")
    }
}

function styleForCheckedCont(contact, name, checkbox, contactLabel) {
    contact.classList.add("bg-white")
    name.style.display = "none";
    checkbox.style.display = "none";
    contactLabel.style.padding = "8px 0 0 0"
}

function dropDownForCategory() {
    let arrowOpenRef = document.getElementById("arrow-open-category")
    let selectRef = document.getElementById("wrapper-category")
    let options = document.querySelectorAll(".option-category")
    selectRef.addEventListener("click", function () {
        if (openDD === false) {
            showCategoryDD(options, arrowOpenRef);
            openDD = true;
        } else {
            closeCategoryDD(options, arrowOpenRef);
            openDD = false;
        }
    });
    changeCategory(options, arrowOpenRef)
}

function changeCategory(options, arrowOpenRef) {
    let categoryInputRef = document.getElementById("category-add-task")
    options.forEach(option => {
        option.addEventListener("click", function () {
            categoryInputRef.textContent = this.textContent;
            closeCategoryDD(options, arrowOpenRef)
            openDD = false;
        })
    })
}

function showCategoryDD(options, arrowOpenRef) {
    options.forEach(option => {
        option.classList.add("visible")
    });
    arrowImgToggle(arrowOpenRef)
}

function closeCategoryDD(options, arrowOpenRef) {
    options.forEach(option => {
        option.classList.remove("visible")
    })
    arrowImgToggle(arrowOpenRef)
    return
}

function arrowImgToggle(arrowOpenRef) {
    let imgRef = arrowOpenRef.querySelectorAll("img")
    for (const img of imgRef) {
        img.classList.toggle("d_none")
    }
}

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

function styleSubtaskOnEditing(subtaskContainerRef, editContainer) {
    subtaskContainerRef.classList.add("disable-hover")
    subtaskContainerRef.style.borderBottom = "1px solid #005DFF";
    subtaskContainerRef.style.borderRadius = "0"
    editContainer.classList.remove("d_none")
    editContainer.classList.add("d_flex", "d-f-row")
}

function styleSubtaskBlur(element, subtaskContainerRef, editContainer) {
    element.contentEditable = false
    element.style.listStyleType = ""
    editContainer.classList.remove("d_flex", "d-f-row")
    editContainer.classList.add("d_none")
    subtaskContainerRef.classList.remove("disable-hover")
    subtaskContainerRef.style.borderBottom = "";
    subtaskContainerRef.style.borderRadius = ""
}

function deleteSubtask(element) {
    element.remove();
}
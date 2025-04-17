const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/"
let isDropdownOpen = false;
const form = document.getElementById("form-add-task");
let getUserCache = [];
user = []
let lastCursPosDisc = 0
let openDD = false
let placeForCheckedIcon = false



async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData);
        generateUserIcon();
    } else {
        console.log("Kein Nutzer gefunden.");
    }
}

function generateUserIcon() {
    let userName = user[0].name;
    let iconContainer = document.getElementById('icon-container');
    let iconWrapper = document.getElementById('icon-wrapper');
    if (userName) {
        let initials = userName.split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
        iconContainer.textContent = initials;
        iconWrapper.style.display = 'flex';
    }
}

function stopPropagation(event) {
    event.stopPropagation()
}

document.addEventListener("DOMContentLoaded", async function () {
    dropDownForCategory();
    enabledCreatBtn()
    await getUser(path = "/users");
    document.getElementById("assigned-to-input").addEventListener("input", displayUser);
});

/** changes the date format and limits the days and months
 * @example 10/04/2025
  */

function customDateInput() {
    let dateInputRef = document.getElementById("date-input-add-task");
    let dateInputVal = dateInputRef.value.replace(/[^\d]/g, '');
    let displaydDate = ""
    if (dateInputVal.length >= 1) {
        if (dateInputVal.slice(0, 2) > 31) {
            displaydDate = 31
        } else {
            displaydDate = dateInputVal.slice(0, 2)
        }
    }
    if (dateInputVal.length >= 3) {
        if (dateInputVal.slice(2, 4) > 12) {
            displaydDate += "/" + 12
        } else {
            displaydDate += "/" + dateInputVal.slice(2, 4)
        }
    }
    if (dateInputVal.length >= 5) {
        displaydDate += "/" + dateInputVal.slice(4, 8)
    }
    dateInputRef.value = displaydDate
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

function textareaCursPos() {
    let textarea = document.querySelector("textarea")
    if (textarea.value.trim() == "") {
        textarea.setSelectionRange(0, 0)
    } else {
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
    document.addEventListener('mouseup', stopResize)
    function stopResize() {
        document.removeEventListener('mousemove', newHeightTA)
        document.removeEventListener('mouseup', stopResize)
    }
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
    let errMsg = "This field is required"
    if (inputToValidateTitle.value === "") {
        errorMsg(requerdTitleRef, inputToValidateTitle, errMsg)
    }
    if (inputToValidateDate.value === "") {
        errorMsg(requerdDateRef, inputToValidateDate, errMsg)
    }
    if (valide === true) {
        creatTask()
    }
})

function errorMsg(requerdRef, inputToValidate, errMsg) {
    requerdRef.innerHTML = errMsg;
    requerdRef.style.color = "#FF8190"
    inputToValidate.style.borderBottom = "1px solid #FF8190";
    valide = false
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
    if (inputSubtaskVal === "") {
        return
    }
    displaydSubtaskRef.innerHTML += subtaskTemplat(inputSubtaskVal)
    inputSubtaskRef.value = ""
    changeSubtaskIcons()
}

function changeSubtaskIcons() {
    let creatSubtaskAreaRef = document.getElementById("input-subtask-icons");
    let displaySubtaskIconRef = document.getElementById("working-icons-opener")
    creatSubtaskAreaRef.classList.toggle("d_flex");
    creatSubtaskAreaRef.classList.toggle("d_none");
    displaySubtaskIconRef.classList.toggle("d_none")
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
    let labelList = document.querySelectorAll(".radio-btn")
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
    clearValidationArea()
}


function getTaskInputs() {
    let titleNewTaskRef = document.getElementById("title-add-task").value
    let descriptionNewTaskRef = document.getElementById("description-add-task").value
    let dateNewTaskRef = document.getElementById("date-input-add-task").value
    let priorityNewTaskRef = document.querySelector('input[name="priority"]:checked').value
    let categoryNewTaskRef = document.getElementById("category-add-task").textContent
    let assignedUserRef = assignetUserToData()
    let subtasks = getSubtasks();
    return { titleNewTaskRef, descriptionNewTaskRef, dateNewTaskRef, priorityNewTaskRef, categoryNewTaskRef, assignedUserRef, subtasks }
}

function creatTaskData(inputData) {
    return {
        title: inputData.titleNewTaskRef,
        description: inputData.descriptionNewTaskRef,
        dueDate: inputData.dateNewTaskRef,
        priority: inputData.priorityNewTaskRef,
        category: inputData.categoryNewTaskRef,
        assignedUsers: inputData.assignedUserRef,
        status: "toDo",
        subtasks: inputData.subtasks,
    };
}

function creatTask() {
    let inputs = getTaskInputs()
    let data = creatTaskData(inputs)
    postTask("/tasks", data)
    transferToBoard()
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

function getSubtasks() {
    let subtasks = [];
    let subtaskElements = document.querySelectorAll("#added-subtasks li");
    for (let i = 0; i < subtaskElements.length; i++) {
        subtasks.push({
            title: subtaskElements[i].innerText,
            completed: false
        });
    }
    return subtasks;
}

function assignetUserToData() {
    let assignedRef = document.getElementById("assigned-to-display");
    let assignetContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    let selectedUser = [];
    assignetContactRef.forEach(contact => {
        let nameIcon = contact.querySelector(".name-icon");
        let checkbox = contact.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
            let assignetData = nameIcon.dataset.value;
            selectedUser.push(assignetData)
        }
    })
    return selectedUser
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
        if (!response.ok) {
            throw new Error("Fehler beim Senden der Daten");
        }
        const result = await response.json()
        return result;
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}

async function getUser(path = "") {
    if (getUserCache.length > 0) {
        return getUserCache;
    }
    try {
        const response = await fetch(BASE_URL + path + ".json")
        if (!response.ok) {
            throw new Error("Fehler beim Empfangen der User");
        }
        const result = await response.json()
        const userArray = Object.values(result)
        getUserCache = userArray;
        return getUserCache;
    } catch (error) {
        console.error("Fehler:", error.message);
    }
}

function searchAssigned() {
    let userArray = getUserCache
    let inputRef = document.getElementById("assigned-to-input")
    let inputVal = inputRef.value.toLowerCase()
    let searchingName = userArray.filter(function (nameToSearch) {
        return nameToSearch.name.toLowerCase().includes(inputVal)
    }
    )

    return searchingName
}

function displayUser() {
    let userArray = searchAssigned()
    let selectedUser = assignetUserToData()
    let assignedToAreaRef = document.getElementById("assigned-to-display")
    let allContacts = ""
    userArray.forEach(contact => {
        let userName = contact.name;
        let isChecked = selectedUser.includes(userName)
        allContacts += templateAssignedTo(userName, isChecked)
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
    let selectRef = document.getElementById("select-category")
    let options = document.querySelectorAll(".wrapper-category .option-category")
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
}

function arrowImgToggle(arrowOpenRef) {
    let imgRef = arrowOpenRef.querySelectorAll("img")
    for (const img of imgRef) {
        img.classList.toggle("d_none")
    }
}

function clearValidationArea() {
    let validationAreaRef = document.getElementsByClassName("validation-add-task-form");
    for (let index = 0; index < validationAreaRef.length; index++) {
        let singValidArea = validationAreaRef[index];
        singValidArea.innerHTML = "";
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
        styleSubtaskBlur(element,subtaskContainerRef, editContainer)
    });
}

function styleSubtaskOnEditing(subtaskContainerRef, editContainer) {
    subtaskContainerRef.classList.add("disable-hover")
    subtaskContainerRef.style.borderBottom = "1px solid #005DFF";
    subtaskContainerRef.style.borderRadius = "0"
    editContainer.classList.remove("d_none")
    editContainer.classList.add("d_flex", "d-f-row")
}

function styleSubtaskBlur(element,subtaskContainerRef, editContainer) {
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


function transferToBoard() {
    document.body.innerHTML += tempTaskToBoardOverlay()
    let createTaskBtn = document.getElementById("add-task-create-btn")
    let createTaskIcon = document.getElementById("btn-icon-check")
    createTaskBtn.classList.add("activ-creat-btn")
    createTaskIcon.classList.add("checkt-icon")
    setTimeout(() => {
        window.location.href = "/html/board.html";
    }, 800);
}

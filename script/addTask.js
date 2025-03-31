const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/"
let isDropdownOpen = false;
const form = document.getElementById("form-add-task");
let getUserCache = [];
user = []


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

document.addEventListener("DOMContentLoaded", async function () {
    dropDownForCategory();
    await getUser(path = "/users");
    // displayIconToclear()
    document.getElementById("assigned-to-container").addEventListener("click", dropDownForAssigned);
    document.getElementById("assigned-to-input").addEventListener("input", displayUser);
});

function changeSubtaskIcons(){
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



// function displayIconToclear() {
//     let subtaskInput = document.getElementById("subtask")
//     let subtaskArea = document.getElementById("subtask-area");
//     let iconRef = document.getElementById("subtask_input_clear");
//     subtaskArea.addEventListener("focusin", function() {
//         iconRef.classList.remove("d_none");
//     });
//     if (subtaskInput.value.trim() === "")
//     subtaskArea.addEventListener("focusout", function() {
//         iconRef.classList.add("d_none");
//     });
// }

// function clearSubtaskInput() {
//     let subtaskInput = document.getElementById("subtask");
//     console.log("subtaskInput.value");
//     subtaskInput.value = ""
//     console.log("subtaskInput.value");
// }

function stopPropagation(event) {
    event.stopPropagation()
}

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
        requerdTitleRef.innerHTML = errMsg;
        requerdTitleRef.style.color = 'red'
        valide = false
    }
    if (inputToValidateDate.value === "") {
        requerdDateRef.innerHTML = errMsg;
        requerdDateRef.style.color = 'red'
        valide = false
    }
    if (valide === true) {
        creatTask()
    }
})

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
    displaydSubtaskRef.innerHTML += subtaskTemplat(inputSubtaskVal)
    inputSubtaskRef.value = ""
    changeSubtaskIcons()
}

function clearForm() {
    document.forms[0].reset()
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    displaydSubtaskRef.innerHTML = ""
    let labelList = document.querySelectorAll(".radio-btn")
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
    clearValidationArea()
}

function creatTask() {
    let titleNewTaskRef = document.getElementById("title-add-task")
    let descriptionNewTaskRef = document.getElementById("description-add-task")
    let dateNewTaskRef = document.getElementById("date-input-add-task")
    let priorityNewTaskRef = document.querySelector('input[name="priority"]:checked')
    let categoryNewTaskRef = document.getElementById("category-add-task")
    let assignedUserRef = assignetUserToData()
    let subtasks = getSubtasks();

    let data = {
        title: titleNewTaskRef.value,
        description: descriptionNewTaskRef.value,
        dueDate: dateNewTaskRef.value,
        priority: priorityNewTaskRef.value,
        category: categoryNewTaskRef.textContent,
        assignedUsers: assignedUserRef,
        status: "toDo",
        subtasks: subtasks
    };
    postTask("/tasks", data)
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
        allContacts += templateAssignedTo(userName,isChecked)
    });
    assignedToAreaRef.innerHTML = allContacts
}

function dropDownForAssigned() {
    if (!isDropdownOpen) {
        openDropdown();
    } else {
        closeDropdown();
    }
    isDropdownOpen = !isDropdownOpen;
}

function openDropdown() {
    displayUser()
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");

    assignedRef.classList.remove("d_none");
    assignedContactRef.forEach(contact => {
        contact.classList.remove("bg-white")
        contact.style.display = "flex";
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let inputTemplate = contact.querySelector(".input-assigned");
        nameTemplate.style.display = "flex";
        inputTemplate.style.display = "flex";

    });
    arrowOpenRef.classList.toggle("drop-down-arrow-close")
    assignedRef.style.display = "flex";
    assignedRef.style.flexDirection = "column"
}

function closeDropdown() {
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedContactRef.forEach(contact => {
        let checkbox = contact.querySelector("input[type='checkbox']");
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let inputTemplate = contact.querySelector(".input-assigned");
        if (checkbox && checkbox.checked) {
            contact.classList.add("bg-white")
            nameTemplate.style.display = "none";
            inputTemplate.style.display = "none";

        } else {
            contact.style.display = "none";
        }
    });
    assignedRef.style.display = "flex";
    assignedRef.style.gap = "8px";
    assignedRef.style.flexDirection = "row"
    arrowOpenRef.classList.toggle("drop-down-arrow-close")
}

function dropDownForCategory() {
    let arrowOpenRef = document.getElementById("arrow-open-category")
    let categoryInputRef = document.getElementById("category-add-task")
    let selectRef = document.getElementById("select-category")
    let options = document.querySelectorAll(".wrapper-category .option-category")
    selectRef.addEventListener("click", function () {
        toggleCategoryDD(options, arrowOpenRef)
    });
    options.forEach(option => {
        option.addEventListener("click", function () {
            categoryInputRef.textContent = this.textContent;
            closeCategoryDD(options, arrowOpenRef)
        })
    })
}

function toggleCategoryDD(options, arrowOpenRef) {
    options.forEach(option => {
        option.classList.toggle("d_none")
    });
    arrowOpenRef.classList.toggle("drop-down-arrow-close")
}

function closeCategoryDD(options, arrowOpenRef) {
    options.forEach(option => {
        option.classList.add("d_none")
        arrowOpenRef.classList.remove("drop-down-arrow-close")
    })
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
    let editContainer =  subtaskIconContainer.querySelector(".subtask-edit-icons")
    subtaskContainerRef.classList.add("disable-hover")
    subtaskContainerRef.style.borderBottom = "1px solid #005DFF";
    subtaskContainerRef.style.borderRadius ="0"
    editContainer.classList.remove("d_none")
    editContainer.classList.add("d_flex")
    editContainer.style.flexDirection="row"
    element.addEventListener("blur", function(){
        element.contentEditable = false
        element.style.listStyleType = ""
        editContainer.classList.remove("d_flex")
        editContainer.classList.add("d_none")
        subtaskContainerRef.classList.remove("disable-hover")
        subtaskContainerRef.style.borderBottom = "";
        subtaskContainerRef.style.borderRadius =""
    });
}















// date form problem.
// const placeholderArr = ["d","d","/","m","m","/","y","y","y","y"]



// function placeholderDate() {
//     let placeholderDateRef = document.getElementById("dateInput-add-task").value;
//     let placeholderText = []
//     for (let iPlaceholder = 0; iPlaceholder < placeholderArr.length; iPlaceholder++) {
//         placeholderDisplay += placeholderArr[iPlaceholder];
//     }
//     console.log(placeholderDisplay);
//     placeholderDateRef.value = placeholderDisplay
// }
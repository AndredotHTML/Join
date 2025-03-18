const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/"
let isDropdownOpen = false;
document.addEventListener("DOMContentLoaded", function () {
    dropDownForCategory();
    getUser(path = "/users");
});
document.getElementById("assigned-to-input").addEventListener("click", dropDownForAssigned);


document.querySelectorAll("form select").forEach(select => {
    select.addEventListener("click", () => {
        if (select.classList.contains("open")) {
            select.classList.remove("open");
        } else {
            select.classList.add("open");
        }
    });
    select.addEventListener("blur", () => {
        select.classList.remove("open");
    });
});

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
}

function creatTask() {
    let titleNewTaskRef = document.getElementById("title-add-task")
    let descriptionNewTaskRef = document.getElementById("description-add-task")
    let dateNewTaskRef = document.getElementById("date-input-add-task")
    let priorityNewTaskRef = document.querySelector('input[name="priority"]:checked')
    let categoryNewTaskRef = document.getElementById("category-add-task")
    let assignedUserRef = assignetUserToData()
    let subtasksNewTaskRef = document.getElementById("added-subtasks")
    let subtaskCollection = subtasksNewTaskRef.getElementsByTagName("li")
    let subtasks = []
    for (const subtask of subtaskCollection) {
        subtasks.push(subtask.textContent.trim().replace(/\s+/g, " "))
    }
    let data = {
        [titleNewTaskRef.value]: {
            description: descriptionNewTaskRef.value,
            dueDate: dateNewTaskRef.value,
            priority: priorityNewTaskRef.value,
            category: categoryNewTaskRef.textContent,
            assigned: assignedUserRef,
            status: "toDo",
            subtasks: subtasks
        }
    };
    postTask("/tasks", data)
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
        console.log("Task wurde angenommen", result);
        return result;
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}

async function getUser(path = "") {
    try {
        const response = await fetch(BASE_URL + path + ".json")
        if (!response.ok) {
            throw new Error("Fehler beim Empfangen der User");
        }
        const result = await response.json()
        const userArray = result ? Object.values(result) : []
        displayUser(userArray)
        return result;
    } catch (error) {
        console.error("Fehler:", error.message);
    }
}

function displayUser(userArray) {
    let assignedToAreaRef = document.getElementById("assigned-to-display")
    let allContacts = []
    for (let i = 0; i < userArray.length; i++) {
        let user = userArray[i];
        let userName = user.name;
        allContacts += templateAssignedTo(userName)
    }
    assignedToAreaRef.innerHTML = allContacts
    assignedToAreaRef.classList.add("d_none");
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
    let assignedRef = document.getElementById("assigned-to-display");
    let assignetContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedRef.classList.remove("d_none");
    assignetContactRef.forEach(contact => {
        contact.style.display = "flex";
        let label = contact.querySelector("label");
        if (label) {
            label.style.display = "flex";
        }
    });
}

function closeDropdown() {
    let assignedRef = document.getElementById("assigned-to-display");
    let assignetContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignetContactRef.forEach(contact => {
        let checkbox = contact.querySelector("input[type='checkbox']");
        let label = contact.querySelector("label");
        if (checkbox && checkbox.checked) {
            if (label) {
                label.style.display = "none";
            }
            // contact.style.display = "flex";
        } else {
            contact.style.display = "none";
        }
    });
}

function dropDownForCategory() {
    let categoryInputRef = document.getElementById("category-add-task")
    let options = document.querySelectorAll(".wrapper-category .option-category")
    categoryInputRef.addEventListener("click", function () {
        options.forEach(option => {
            option.classList.toggle("d_none")
        });
    });
    options.forEach(option => {
        option.addEventListener("click", function () {
            categoryInputRef.textContent = this.textContent;
            options.forEach(option => {
                option.classList.add("d_none")
            })
        })
    })
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
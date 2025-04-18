const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/"
let getUserCache = [];
user = []

document.addEventListener("DOMContentLoaded", async function () {
    dropDownForCategory()
    enabledCreatBtn()
    await getUser(path = "/users");
    document.getElementById("assigned-to-input").addEventListener("input", displayUser);
});

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

async function postTask(path = "", data = {}) {
    try {
        const response = await fetch(BASE_URL + path + ".json",fetchOptions(data))
        return await handleResponse(response);
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}

function fetchOptions(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
}

async function getUser(path = "") {
    if (getUserCache.length > 0) {
        return getUserCache;
    }
    try {
        const response = await fetch(BASE_URL + path + ".json")
        const result = await handleResponse(response)
        const userArray = Object.values(result)
        getUserCache = userArray;
        return getUserCache;
    } catch (error) {
        console.error("Fehler:", error.message);
    }
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error("Fehler an den API Daten");
    }
    return response.json()
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
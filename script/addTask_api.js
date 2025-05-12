let getUserCache = [];
let getContactCache = [];
user = []


document.addEventListener("DOMContentLoaded", async function () {
    dropdownForCategory()
    await getContacts(path = "/contacts");
    document.getElementById("assigned-to-input").addEventListener("input", displayContacts);
    radioBtnChecked("medium")
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


/**
 * Sends an asynchronous POST request to an API endpoint URL
 * @async
 * @param {string} path - Appended to the BASE_URL.
 * @param {Object} data - Values that have to be sent as JSON
 * @returns {Promise<Object|null>} Parsed responsed data or null on failure
 */

async function postTask(path = "", data = {}) {
    try {
        const response = await fetch(BASE_URL + path + ".json", fetchOptions(data))
        return await handleResponse(response);
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}


/**
 * Prepares the options for sending data as JSON in a POST request.
 * @param {Object} data - Values that have to be sent as JSON.
 */

function fetchOptions(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
}


/**
 * Fetch contacts and store them in the Cache
 * @param {/url} path - appended to the BASE_URL.
 * @returns an Object with data of the contacts if there are contacts, they are stored in the Contacts Cache
 */

async function getContacts(path = "") {
    if (getContactCache.length > 0) {
        return getContactCache;
    }
    try {
        const response = await fetch(BASE_URL + path + ".json")
        const result = await handleResponse(response)
        const userArray = Object.values(result)
        getContactCache = userArray;
        return getContactCache;
    } catch (error) {
        console.error("Fehler:", error.message);
    }
}


/**
 * Checks the response status and returns the parsed JSON Object
 * @param {*} response data from the server
 * @returns the parsed JSON-Object
 */

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error("Fehler an den API Daten");
    }
    return response.json()
}


/**
 * Sorts the getContactCache alphabetically, compares each name with the input and stores matched results in an array "filteredContacts"
 * @returns An array of filtered contacts
 */

function searchAssigned() {
    let userArray = getContactCache.sort((a, b) => a.name.localeCompare(b.name))
    let inputRef = document.getElementById("assigned-to-input")
    let inputVal = inputRef.value.toLowerCase()
    let filteredContacts = userArray.filter(function (nameToSearch) {
        return nameToSearch.name.toLowerCase().includes(inputVal)
    }
    )
    return filteredContacts
}


/**
 * checks which contacts are selected and stores them in "selectedContacts"
 * @returns An array of selected Contacts
 */

function assignedContactsToData() {
    let assignedRef = document.getElementById("assigned-to-display");
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    let selectedContacts = [];
    assignedContactRef.forEach(contact => {
        let nameIcon = contact.querySelector(".name-icon");
        let checkbox = contact.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
            let assignedData = nameIcon.dataset.value;
            selectedContacts.push(assignedData)
        }
    })
    return selectedContacts
}


/**
 * Collects the title and status of subtasks in an object and stores them in an array
 * @returns An array of subtasks{ title, completed }
 */

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


/**
 * Collects the input values from the form for creating a new task
 * @returns An object with all inputs of the form
 */

function getTaskInputs() {
    let titleNewTaskRef = document.getElementById("title-add-task").value
    let descriptionNewTaskRef = document.getElementById("description-add-task").value
    let dateNewTaskRef = document.getElementById("date-input-add-task").value
    let priorityNewTaskRef = document.querySelector('input[name="priority"]:checked').value
    let categoryNewTaskRef = document.getElementById("category-add-task").textContent
    let assignedUserRef = assignedContactsToData()
    let subtasks = getSubtasks();
    return { titleNewTaskRef, descriptionNewTaskRef, dateNewTaskRef, priorityNewTaskRef, categoryNewTaskRef, assignedUserRef, subtasks }
}


/**
 * Create a new object with a different structure from the given object.
 * @param {object} inputData objekt with the values from the form inputs
 * @returns A Object in a new structure
 */

function createTaskData(inputData) {
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


/**
 * Create a new task by collecting the input values, restructuring them, and sending them to the server.
 * Afterward the user is redirected to the board.
 */

function createTask() {
    let inputs = getTaskInputs()
    let data = createTaskData(inputs)
    postTask("/tasks", data)
    transferToBoard()
}


/**
 * Change the style of the create button and direkt the user to the board after a short delay
 */

function transferToBoard() {
    document.body.innerHTML += tempTaskToBoardOverlay()
    let createTaskBtn = document.getElementById("add-task-create-btn")
    let createTaskIcon = document.getElementById("btn-icon-check")
    createTaskBtn.classList.add("active-creat-btn")
    createTaskIcon.classList.add("checkt-icon")
    setTimeout(() => {
        window.location.href = "/html/board.html";
    }, 800);
}
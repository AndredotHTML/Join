let tasks = [];
let contacts =[];

/**
 * Fetches all tasks from Firebase at the given path.
 * @param {string} path - The path to the tasks collection in Firebase.
 * @returns {Promise<Object>} - A promise that resolves to the tasks object.
 */
async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}

/**
 * Pushes all tasks from Firebase into the `tasks` array and updates the view.
 * @returns {Promise<void>}
 */
async function pushToTask() {
    let task = await getAllTasks("/tasks"); 
    let tasksArray = task ? Object.keys(task) : [];

    for (let index = 0; index < tasksArray.length; index++) {
        let taskData = task[tasksArray[index]]; 
        tasks.push({
            id: tasksArray[index], 
            category: taskData.category,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            status: taskData.status,
            subtasks: taskData.subtasks,
            assignedUsers: taskData.assignedUsers
        });
    }
    updateView()
}

/**
 * Fetches all contacts from Firebase at the given path.
 * @param {string} path - The path to the contacts collection in Firebase.
 * @returns {Promise<Object>} - A promise that resolves to the contacts object.
 */
async function getAllContacts ( path ) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}

/**
 * Pushes all contacts from Firebase into the `contacts` array.
 * @returns {Promise<void>}
 */
async function pushToContactsArray() {
    let contact = await getAllContacts ("/contacts");
    let contactsArray = contact? Object.keys(contact) : [];

    for (let index = 0; index < contactsArray.length; index++) {
        let contactData = contact[contactsArray[index]];
        contacts.push({
            id:contactsArray[index],
           colorClass: contactData.avatarColorClass,
           email: contactData.email,
           name: contactData.name,
           phone: contactData.phone
        });
    }
}

/**
 * Updates the status of a task in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status to set.
 * @returns {Promise<void>}
 */
async function updateTaskStatus(taskId, newStatus) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

    try {

            await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

    } catch (error) {
        console.error("Firebase update error:", error);
    }
}


/**
 * Updates the completion status of a subtask in Firebase.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskId - The ID of the subtask to update.
 * @param {boolean} newStatus - The new completed status.
 * @returns {Promise<void>}
 */
async function updateSubtaskStatus(taskId, subtaskId, newStatus) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/subtasks/${subtaskId}.json`;

    try {
        await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newStatus })
        });
    } catch (error) {
        console.error("Firebase update error:", error);
    }
}

/**
 * Deletes a task from Firebase and updates the local task array and view.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

    try {
        await fetch(url, {
            method : "DELETE"
        });
        tasks = tasks.filter(task => task.id !== taskId);
        updateView();
        closeOverlay();
    } catch (error) {
        console.error("Firebase delete error:", error);
    }
}

/**
 * Updates a task object in Firebase with new data.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedTask - The updated task data.
 * @returns {Promise<void>}
 */
async function updateTaskInFirebase(taskId, updatedTask) {
    const url = `https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;

    try {
        await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });
    } catch (error) {
        console.error("Firebase update error:", error);
    }
}

/**
 * Changes the status of a task, updates Firebase, and refreshes the view.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status to assign.
 * @returns {Promise<void>}
 */
async function changeTaskStatus(taskId, newStatus) {
    let task = tasks.find(t => t.id === taskId);
    task.status = newStatus; 
    await updateTaskInFirebase(taskId, { status: newStatus });
    closeStatusMenu();
    updateView();
}
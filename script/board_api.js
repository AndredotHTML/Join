let tasks = [];
let contacts =[];

async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}

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

async function getAllContacts ( path ) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}

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
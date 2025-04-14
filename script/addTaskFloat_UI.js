function openCalendar() {
    const dateInput = document.getElementById("dateInput-add-task");
        flatpickr(dateInput, {
            dateFormat: "d/m/Y", 
        }).open();
}

function radioBtnChecked(priority) {
    updatedPriority = priority;

    let labelList = document.querySelectorAll(".radio_btn");
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
        toggleIcons(radioBtn, 'hide');
    });
    let labelRef = document.querySelector(`label[for="${priority.toLowerCase()}-rad"]`);
    labelRef.style.backgroundColor = `var(--${priority.toLowerCase()}Color)`;
    labelRef.style.color = `var(--secondaryColor)`;
    toggleIcons(labelRef, 'show');
}

function toggleIcons(radioBtn, action) {
    let checkedIcon = radioBtn.querySelector('.checked_priority');
    let uncheckedIcon = radioBtn.querySelector('.unchecked_priority');
    if (action === 'hide') {
        checkedIcon.style.display = 'none';
        uncheckedIcon.style.display = 'inline-block';
    } else {
        checkedIcon.style.display = 'inline-block';
        uncheckedIcon.style.display = 'none';
    }
}

function updateToDo(task){
    let toDo = document.getElementById('toDo');
    toDo.innerHTML +=generateTask(task);
}

function updateInProgress(task){
    let inProgress = document.getElementById('inProgress');
    inProgress.innerHTML +=generateTask(task);
}

function updateAwaitFeedback(task){
    let awaitFeedback = document.getElementById('awaitFeedback');
    awaitFeedback.innerHTML +=generateTask(task);
}

async function postTask(path = "", data = {}) {
    try {
           const response= await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result.name;
    } catch (error) {
        console.error("Fehler:", error.message);
        return null;
    }
}

async function saveEditedTask(taskId) {
    const updatedTask = {
        title: document.getElementById("title_add_task").value,
        description: document.getElementById("description_add_task").value,
        dueDate: document.getElementById("dateInput-add-task").value,
        priority: updatedPriority,
        assignedUsers: assignedUsers,
        category: document.getElementById("category_add_task").innerText, 
        subtasks: getNewSubtasks(),
    }
    await updateTaskInFirebase(taskId,updatedTask);
    showTaskMessage();
    setTimeout(() => {
        location.reload();
    }, 1000);
    setTimeout(closeOverlay, 1000);
}
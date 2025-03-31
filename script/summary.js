const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";

tasks = []

user = []


async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}


async function pushToTask() {
    let task = await getAllTasks("/tasks"); 
    let tasksArray = Object.keys(task);

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
    renderSummaryNumbers();
}


async function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData)
        let email = user[0].email
        postUserProfile(email, {createdAt: new Date().toISOString()})
        displayUserData()
        greetUser()
    } else {
        console.log("Kein Nutzer gefunden.");
        greetUser()
    }
    pushToTask()
}


function displayUserData() {
    let userName = user[0].name;
    welcomeMsg = document.getElementById("user_name");
    welcomeMsg.innerHTML = " ";
    welcomeMsg.innerHTML += userName;
    generateUserIcon(userName);
}


function generateUserIcon(userName) {
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


function greetUser() {
    let greetElement = document.getElementById("greet");
    let currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }
    greetElement.textContent = greeting;
}


async function postUserProfile(email, data = {}) {
    const sanitizedEmail = email.replace(/\./g, "_");
    await fetch(BASE_URL + `/${sanitizedEmail}.json`,{
        method: "PUT",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}


async function testUserPush() {
    let email = user[0].email;
    let sanitizedEmail = email.replace(/\./g, "_");
    await putUserTest(sanitizedEmail, {"task": "testtask"})
}


async function putUserTest(path, data) {
    await fetch(BASE_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}


function renderSummaryNumbers() {
    renderUrgentTasks("urgent-number");
    renderInBoardTasks("in-board-number");
    renderToDoTasks("to-do-number");
    renderInProgressTasks("in-progress-number");
    renderFeedbackTasks("feedback-number");
    renderDoneTasks("done-number");
}


function renderUrgentTasks(id) {
    let urgentCount = tasks.filter(task => task.priority === "Urgent").length;
    document.getElementById(id).innerText = urgentCount
}


function renderInBoardTasks(id) {
    let tasksCount = tasks.length;
    document.getElementById(id).innerText = tasksCount;
}


function renderToDoTasks(id) {
    let toDoCount = tasks.filter(task => task.status === "toDo").length;
    document.getElementById(id).innerText = toDoCount;
}


function renderInProgressTasks(id) {
    let inProgressCount = tasks.filter(task => task.status === "inProgress").length;
    document.getElementById(id).innerText = inProgressCount;
}


function renderFeedbackTasks(id) {
    let feedbackCount = tasks.filter(task => task.status === "awaitingFeedback").length;
    document.getElementById(id).innerText = feedbackCount;
}


function renderDoneTasks(id) {
    let doneCount = tasks.filter(task => task.status === "done").length;
    document.getElementById(id).innerText = doneCount;
}

tasks = [];

user = [];


/**
 * Fetches all Tasks for the Summary Dashboard from the API
 * @param {string} path The Firebase API URL 
 * @returns 
 */
async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return  await response.json()
}


/**
 * Pushes all Tasks fetched from the API to the local tasks array
 */
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


/**
 * Transition for the greeting on mobile version 
 */
function greetTransition() {
    const greeting = document.getElementById("user-greeting")
    if (window.innerWidth <= 910)
        setTimeout(() => {
            greeting.classList.add("greet_transition");
            }, 2000);
}


/**
 * init runs all function which are aquired to run onload of the html
 */
async function init() {
    authLogIn()
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        let email = user[0].email;
        postUserProfile(email, {createdAt: new Date().toISOString()});
        displayUserData();
        greetUser();
    } else {
        handleGuestLogin();
        greetGuest();
    }
    pushToTask();
    greetTransition()
}


/**
 * greeting for the guest login 
 */
function handleGuestLogin() {
    document.getElementById("greet").classList.add("font_weight_bold")
}


/**
 * displays the username in the greeting welcome message 
 */
function displayUserData() {
    let userName = user[0].name;
    welcomeMsg = document.getElementById("user_name");
    welcomeMsg.innerHTML = " ";
    welcomeMsg.innerHTML += userName;
    generateUserIcon(userName);
}

/**
 * genarates the usericon in the header
 * @param {string} userName the username input by the user at the registration
 */
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

/**
 * greeting generation for the guest login
 */
function greetGuest() {
    let greetElement = document.getElementById("greet");
    let currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    greetElement.textContent = greeting;
}

/**
 * greeting generation for the user login 
 */
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

/**
 * puts a profile for the user on the API
 * @param {string} email user email
 * @param {string} data Data for the API
 */
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

/**
 * render the Numbers of tasks for the different categorys in the summary dashboard
 */
function renderSummaryNumbers() {
    renderUrgentTasks("urgent-number");
    renderInBoardTasks("in-board-number");
    renderToDoTasks("to-do-number");
    renderInProgressTasks("in-progress-number");
    renderFeedbackTasks("feedback-number");
    renderDoneTasks("done-number");
}

/**
 * Renders the Values needed for Urgent tasks card
 * @param {string} id urgenttask string ID
 */
function renderUrgentTasks(id) {
    let urgentCount = tasks.filter(task => task.priority === "Urgent").length;
    document.getElementById(id).innerText = urgentCount
    renderUrgentDate()
}

/**
 * Renders the Values needed for in Board tasks card
 * @param {string} id in Board string ID
 */
function renderInBoardTasks(id) {
    let tasksCount = tasks.length;
    document.getElementById(id).innerText = tasksCount;
}

/**
 * Renders the Values needed for to do tasks card
 * @param {string} id to do string ID
 */
function renderToDoTasks(id) {
    let toDoCount = tasks.filter(task => task.status === "toDo").length;
    document.getElementById(id).innerText = toDoCount;
}

/**
 * Renders the Values needed for in progress tasks card
 * @param {string} id urgenttask string ID
 */
function renderInProgressTasks(id) {
    let inProgressCount = tasks.filter(task => task.status === "inProgress").length;
    document.getElementById(id).innerText = inProgressCount;
}

/**
 * Renders the Values needed for in progress tasks card
 * @param {string} id urgenttask string ID
 */
function renderFeedbackTasks(id) {
    let feedbackCount = tasks.filter(task => task.status === "awaitFeedback").length;
    document.getElementById(id).innerText = feedbackCount;
}

/**
 * Renders the Values needed for done tasks card
 * @param {string} id done string ID
 */
function renderDoneTasks(id) {
    let doneCount = tasks.filter(task => task.status === "done").length;
    document.getElementById(id).innerText = doneCount;
}

/**
 * Renders the Date of the next due date for the urgent tasks
 * @returns 
 */
function renderUrgentDate() {
    const urgentTasks = tasks.filter(task => task.priority === "Urgent");
    if (urgentTasks.length === 0) {
        return;
    }
    const urgentDates = urgentTasks.map(task => {
        const [day, month, year] = task.dueDate.split("/");
        return new Date(`${year}-${month}-${day}`);
    });
    const nextUrgentDate = new Date(Math.min(...urgentDates));
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById("dueDate").innerText = nextUrgentDate.toLocaleDateString('en-US', options);
}

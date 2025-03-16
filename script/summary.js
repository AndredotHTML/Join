user = []


function getCurrentUser() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        user.push(userData)
        displayUserData()
        greetUser()
    } else {
        console.log("Kein Nutzer gefunden.");
        greetUser()
    }
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
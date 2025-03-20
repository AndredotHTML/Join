let users = [];

const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * toggles the visibility for the password input
 * @param {*} id - the ID of the element which will be toggled 
 */
function togglePassword(id, icon) {
    const passwordInput = document.getElementById(id);
    const passwordIcon = document.getElementById(icon);
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordIcon.src = "/assets/icons/visibility.png"
    } else {
      passwordInput.type = "password";
      passwordIcon.src = "/assets/icons/visibility_off.png"
    }
  }


/**
 * checks if the passwords are the same and if the inputs are empty 
 */
function checkPasswords() {
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm_password");
    let errorMsg = document.getElementById("error_msg_password");
    if (password.value == confirmPassword.value && password.value !== "" && confirmPassword.value !== "") {
        errorMsg.style.display = "none";
        confirmPassword.classList.remove("error")
        checkEmail()
    } else {
        confirmPassword.classList.add("error")
        errorMsg.style.display = "block";
    }
}


/**
 * checks if the inputs in the form are valid and displays error messages if they are not 
 */
function validateForm() {
    let name = document.getElementById("name")
    let email = document.getElementById("email");
    let errorMsg = document.getElementById("error_msg");
    if (!email.validity.valid || !name.validity.valid) {
        email.classList.add("error"); 
        name.classList.add("error"); 
        errorMsg.style.display = "block";
    } else {
        email.classList.remove("error"); 
        name.classList.remove("error");
        errorMsg.style.display = "none";
    }
}


/**
 * checks if the email for the signup already exists 
 */
async function checkEmail() {
    let email = document.getElementById("email");
    let errorMsg = document.getElementById("error_msg_email");
    if (await checkEmailExists(email.value)) {
        email.classList.add("error");
        errorMsg.style.display = "block";
      } else {
        email.classList.remove("error"); 
        errorMsg.style.display = "none";
        toggleOverlay()
        getUserData()
        redirectToLogin()
}}


/**
 * searches for the input email in the users array
 * @param {*} inputMail - is the value of the email input
 */
async function checkEmailExists(inputMail) {
    for (let index = 0; index < users.length; index++) {
        if (users[index].userData.email === inputMail) {
            return true
        }
    } return false
}


/**
 * toggles a 3 second overlay with a message that tells the user that he signup up 
 */
function toggleOverlay() {
    let overlay = document.getElementById("signup_overlay"); 
    let div = document.getElementById("signup_msg");
    overlay.classList.remove("d_none"); 
    fadeInDiv(div)

    setTimeout(() => {
        overlay.classList.add("d_none");
        div.classList.remove("show")
    }, 3000); 
}


/**
 * makes the div to fade in from the bottom of the screen
 * @param {*} div - is the element that fades in 
 */
function fadeInDiv(div) {
    div.classList.add("show"); 
}


/**
 * gets the data from the input values 
 */
function getUserData() {
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    postUserData("/users", {"name": name, "email": email, "password": password})
}


/**
 * posts the userdata into the Storage API 
 * @param {*} path - is the path where the data will be safed
 * @param {*} data - is the userdata input by the user
 */
async function postUserData(path = "", data = {}) {
    await fetch(BASE_URL + path + ".json",{
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    pushToUsersArray()  
}


/**
 * fetches the userData from the storage API
 * @param {*} path - is the path from where it fetches the data
 */
async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json()
}


/**
 * pushes the users from the Storage API into a local array [users]
 */
async function pushToUsersArray() {
    let userResponse = await getAllUsers("/users")
    let userKeysArray = Object.keys(userResponse)
    for (let index = 0; index < userKeysArray.length; index++) {
        users.push(
            {
                id : userKeysArray[index],
                userData : userResponse[userKeysArray[index]],
            }
        ) 
    }
}


/**
 * redirects back to the login 
 */
function redirectToLogin() {
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/html/login.html";
    }, 3000);
}
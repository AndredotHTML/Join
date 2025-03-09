let users = [];

const BASE_URL = "https://join-5677e-default-rtdb.europe-west1.firebasedatabase.app/";


function togglePassword(id) {
    const passwordInput = document.getElementById(id);
    const passwordIcon = document.querySelector(".input_icon_password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordIcon.src = "/assets/icons/visibility.png"
    } else {
      passwordInput.type = "password";
      passwordIcon.src = "/assets/icons/visibility_off.png"
    }
  }


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


async function checkEmailExists(inputMail) {
    for (let index = 0; index < users.length; index++) {
        if (users[index].userData.email === inputMail) {
            return true
        }
    } return false
}


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


function fadeInDiv(div) {
    div.classList.add("show"); 
}


function getUserData() {
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    postUserData("/users", {"name": name, "email": email, "password": password})
}


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


async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json()
}


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

function redirectToLogin() {
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/html/login.html";
    }, 3000);
}
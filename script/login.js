function init() {
  startAnimation()
  pushToUsersArray()
  deleteLocalUser()
}


function startAnimation() {
  const logo = document.getElementById("animated_logo");

  setTimeout(() => {
      logo.classList.add("join_logo");
      logo.classList.remove("join_logo_start")
      }, 100);
}


/**
 * checks if the inputs in the form are valid and displays error messages if they are not 
 */
function validateLoginForm() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let errorMsg = document.getElementById("error_msg");
    if (!email.validity.valid || !password.validity.valid) {
      displayError()
      return false;
    } else {
        email.classList.remove("error"); 
        password.classList.remove("error");
        errorMsg.style.display = "none";
        return true;
      }
}


/**
 * redirects the user to the summary page 
 * @param {*} user - userdata to give over information as parameter
 */
function redirectToSummary() {
  window.location.href = "http://127.0.0.1:5500/html/summary.html"  
}


/**
 * checks if the users e-mail and password match to login
 */
function login() {
  if (!validateLoginForm()) return;
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const user = users.find(user => user.userData.email === emailInput);
  if (user) {
      if (user.userData.password === passwordInput) {
          handleSuccessfulLogin(user.userData);
      } else {
        displayError()
      }
  } else {
    displayError()
  }
}


function displayError() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let errorMsg = document.getElementById("error_msg");
  email.classList.add("error"); 
  password.classList.add("error"); 
  errorMsg.style.display = "block";
}


/**
 * when login is succesful redirect the user to the summary
 * @param {*} userData - userdata to give over information as parameter
 */
function handleSuccessfulLogin(userData) {
  localStorage.setItem('user', JSON.stringify(userData));
  console.log(userData);
  redirectToSummary()
}

function deleteLocalUser() {
  localStorage.removeItem('user');
}






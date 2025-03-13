/**
 * checks if the inputs in the form are valid and displays error messages if they are not 
 */
function validateLoginForm() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let errorMsg = document.getElementById("error_msg");
    if (!email.validity.valid || !password.validity.valid) {
        email.classList.add("error"); 
        password.classList.add("error"); 
        errorMsg.style.display = "block";
    } else {
        email.classList.remove("error"); 
        password.classList.remove("error");
        errorMsg.style.display = "none";
      }
}


/**
 * redirects the user to the summary page 
 * @param {*} User - userdata to give over information as parameter
 */
function redirectToSummary(User) {
    window.location.href = "http://127.0.0.1:5500/html/summary.html"
}


/**
 * checks if the users e-mail and password match to login
 */
function login() {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const user = users.find(user => user.userData.email === emailInput);
  if (user) {
      if (user.userData.password === passwordInput) {
          handleSuccessfulLogin(user.userData);
      } else {
        email.classList.add("error"); 
        password.classList.add("error"); 
        errorMsg.style.display = "block";
      }
  } 
}

/**
 * when login is succesful redirect the user to the summary
 * @param {*} userData - userdata to give over information as parameter
 */
function handleSuccessfulLogin(userData) {
  console.log("Angemeldeter Nutzer:", userData);
  redirectToSummary(userData)
}






function togglePassword() {
    const passwordInput = document.getElementById("password");
    const passwordIcon = document.querySelector(".input_icon_password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordIcon.src = "/assets/icons/visibility.png"
    } else {
      passwordInput.type = "password";
      passwordIcon.src = "/assets/icons/visibility_off.png"
    }
  }


function validateForm() {
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


async function login() {
    
}


function redirectToSummary() {
    
}







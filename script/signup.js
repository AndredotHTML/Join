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
        validateForm()
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
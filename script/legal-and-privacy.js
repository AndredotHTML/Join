function init() {
    authLogIn()
    toggleDNoneOnResize()
}

function authLogIn() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        document.getElementById("standart_nav_bar").classList.toggle("d_none")
        document.getElementById("alt_nav_bar").classList.toggle("d_none")
        document.getElementById("icon-wrapper").classList.toggle("d_none")
      } else {
        if (window.innerWidth >= 1200) {
            document.getElementById("legal_stuff").classList.toggle("d_none")
        }
      }
}


function toggleDNoneOnResize() {
    if (localStorage.getItem("isLoggedIn") == "true") {
        const element = document.getElementById("legal_stuff");
  
        function checkWidth() {
        if (window.innerWidth <= 1200) {
            element.classList.add("d_none");
        } else {
            element.classList.remove("d_none");
        }
        }
        checkWidth();

        window.addEventListener("resize", checkWidth);
    }
  }
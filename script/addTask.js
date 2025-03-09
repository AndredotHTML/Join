document.querySelectorAll("form select").forEach(select => {
    select.addEventListener("click", () => {
        if (select.classList.contains("open")) {
            select.classList.remove("open");
        } else {
            select.classList.add("open");
        }
    });
    select.addEventListener("blur", () => {
        select.classList.remove("open");
    });
});

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



function radioBtnChecked(priority) {
    let labelList = document.querySelectorAll(".radio-btn")
    let priorityRef = priority
    let inputRef = document.getElementById(priorityRef + "-rad")
    let labelRef = document.querySelector('label[for="' + priorityRef + '-rad"]')
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
    if (inputRef.checked) {
        labelRef.style.backgroundColor = `var(--${priorityRef}Color)`;
        labelRef.style.color = `var(--secondaryColor)`;
    }
}

function addSubtask() {
    let inputSubtaskRef = document.getElementById("subtask")
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    let inputSubtaskVal = inputSubtaskRef.value
    displaydSubtaskRef.innerHTML += subtaskTemplat(inputSubtaskVal)
    inputSubtaskRef.value =""
}

function clearForm(){
    document.forms[0].reset()
    let displaydSubtaskRef = document.getElementById("added-subtasks")
    displaydSubtaskRef.innerHTML = ""
    let labelList = document.querySelectorAll(".radio-btn")
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
    });
}

function creatTask() {
    
}





// date form problem.
// const placeholderArr = ["d","d","/","m","m","/","y","y","y","y"]



// function placeholderDate() {
//     let placeholderDateRef = document.getElementById("dateInput-add-task").value;
//     let placeholderText = []
//     for (let iPlaceholder = 0; iPlaceholder < placeholderArr.length; iPlaceholder++) {
//         placeholderDisplay += placeholderArr[iPlaceholder];
//     }
//     console.log(placeholderDisplay);
//     placeholderDateRef.value = placeholderDisplay
// }
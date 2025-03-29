function radioBtnChecked(priority) {
    let labelList = document.querySelectorAll(".radio_btn");
    labelList.forEach(radioBtn => {
        radioBtn.style.backgroundColor = `var(--secondaryColor)`;
        radioBtn.style.color = `black`;
        toggleIcons(radioBtn, 'hide');
    });
    let labelRef = document.querySelector(`label[for="${priority.toLowerCase()}-rad"]`);
    labelRef.style.backgroundColor = `var(--${priority.toLowerCase()}Color)`;
    labelRef.style.color = `var(--secondaryColor)`;
    toggleIcons(labelRef, 'show');
}

function toggleIcons(radioBtn, action) {
    let checkedIcon = radioBtn.querySelector('.checked_priority');
    let uncheckedIcon = radioBtn.querySelector('.unchecked_priority');
    if (action === 'hide') {
        checkedIcon.style.display = 'none';
        uncheckedIcon.style.display = 'inline-block';
    } else {
        checkedIcon.style.display = 'inline-block';
        uncheckedIcon.style.display = 'none';
    }
}

function selectCategory(category) {
    document.getElementById('category_add_task').innerHTML = category;
    document.getElementById('options_container').style.display = 'none';
    document.getElementById('arrowIconCategory').src = "/assets/icons/arrow_drop_down.svg"; 
}

function toggleOptions() {
    const optionsContainer = document.getElementById('options_container');
    const arrowIcon = document.getElementById('arrowIconCategory');
    
    if (optionsContainer.style.display === 'none') {
        optionsContainer.style.display = 'block';
        arrowIcon.src = "../assets/icons/arrow_drop_down_close.svg"; 
    } else {
        optionsContainer.style.display = 'none';
        arrowIcon.src = "../assets/icons/arrow_drop_down.svg"; 
    }
}
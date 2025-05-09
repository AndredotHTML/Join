let openCategoryDD = false
let isAssignedDropdownOpen = false;
let placeForCheckedIcon = false

/**
 * Toggles the assignedTo dropdown ,  opnes it if close, close and clear focus if open
 */
function dropdownForAssigned() {
    if (!isAssignedDropdownOpen) {
        openAssignedDropdown();
    } else {
        closeDropdown();
        blurAssig()
    }
    isAssignedDropdownOpen = !isAssignedDropdownOpen;
}


function blurAssig() {
    let assignRef = document.getElementById("assigned-to-input")
    assignRef.value = ""
    assignRef.blur()
}


/**
 * Opens the dropdown menu for the assigned contacts
 */

function openAssignedDropdown() {
    displayContacts()
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedRef.classList.add("visible-assigned");
    assignedRef.classList.remove("visible-assigned-min")
    assignedRef.style.display = "flex";
    assignedRef.style.flexDirection = "column"
    arrowImgToggle(arrowOpenRef)
    styleAssignedContOpen(assignedContactRef)
}


/**
 * Changes the styles for each contact while the dropdown menu is open
 * @param {NodeList} assignedContactRef A list of all contacts
 */

function styleAssignedContOpen(assignedContactRef) {
    assignedContactRef.forEach(contact => {
        contact.style.display = "flex";
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let inputTemplate = contact.querySelector(".input-assigned");
        nameTemplate.style.display = "flex";
        inputTemplate.style.display = "flex";
    });
}


function closeDropdown() {
    let assignedRef = document.getElementById("assigned-to-display");
    let arrowOpenRef = document.getElementById("arrow-open-assigned")
    let assignedContactRef = assignedRef.querySelectorAll(".assigned-contacts");
    assignedRef.style.flexDirection = "row"
    styAssignedContClosed(assignedContactRef, assignedRef)
    arrowImgToggle(arrowOpenRef)
}


/**
 * When the dropdown menu is closed , highlights checked contacts and hides unchecked
 * @param {NodeList} assignedContactRef A list of all contacts
 * @param {HTMLElement} assignedRef A Container for all contacts
 */

function styAssignedContClosed(assignedContactRef, assignedRef) {
    assignedContactRef.forEach(contact => {
        let checkbox = contact.querySelector("input[type='checkbox']");
        let nameTemplate = contact.querySelector(".assigned-template-name");
        let contactLabel = contact.querySelector("label")
        if (checkbox.checked) {
            styleForCheckedCont(contact, nameTemplate, checkbox, contactLabel)
            placeForCheckedIcon = true
        } else {
            contact.classList.remove("visible-assigned");
        }
    });
    styAssignedAreaClose(assignedRef)
}

function styAssignedAreaClose(assignedRef) {
    if (placeForCheckedIcon) {
        assignedRef.classList.remove("visible-assigned")
        assignedRef.classList.add("visible-assigned-min")
    } else {
        assignedRef.classList.remove("visible-assigned", "visible-assigned-min")
    }
}

/**
 * Style for checked contacts
 */

function styleForCheckedCont(contact, name, checkbox, contactLabel) {
    contact.classList.add("bg-white")
    name.style.display = "none";
    checkbox.style.display = "none";
    contactLabel.style.padding = "8px 0 0 0"
}


/**
 * Toggles dropdown menu if the wrapper is clicked.
 */

function dropdownForCategory() {
    let selectRef = document.getElementById("wrapper-category")
    let options = document.querySelectorAll(".option-category")
    selectRef.addEventListener("click", function () {
        if (openCategoryDD === false) {
            showCategoryDD(options);
            openCategoryDD = true;
        } else {
            closeCategoryDD(options);
            openCategoryDD = false;
        }
    });
    changeCategory(options)
}


/**
 * Adds every option the visible class.
 * @param {NodeList} options A list of options for the category
 */

function showCategoryDD(options) {
    let arrowOpenRef = document.getElementById("arrow-open-category")
    options.forEach(option => {
        option.classList.add("visible")
    });
    arrowImgToggle(arrowOpenRef)
}


/**
 * Update the category input to the clicked option and close the dropdown menu.
 * @param {NodeList} options A list of options for the category
 */

function changeCategory(options) {
    let categoryInputRef = document.getElementById("category-add-task")
    options.forEach(option => {
        option.addEventListener("click", function () {
            categoryInputRef.textContent = this.textContent;
            closeCategoryDD(options)
            openCategoryDD = false;
        })
    })
}


function closeCategoryDD(options ) {
    let arrowOpenRef = document.getElementById("arrow-open-category")
    options.forEach(option => {
        option.classList.remove("visible")
    })
    arrowImgToggle(arrowOpenRef)
}


function arrowImgToggle(arrowOpenRef) {
    let imgRef = arrowOpenRef.querySelectorAll("img")
    for (const img of imgRef) {
        img.classList.toggle("d_none")
    }
}
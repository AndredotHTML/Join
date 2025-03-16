function subtaskTemplat(inputSubtaskVal) {
    return ` <li class="addedSubtask">
                ${inputSubtaskVal} 
            </li>
    `
}

function templateAssignedTo(userName) {
    return`
            <div class="assigned-contacts d_flex">
                <div class="name-icon">${userName.split(' ')[0][0]}
                </div>
                <div>${userName}</div>
                <div class="checkbox"></div>
            </div>
    `
}


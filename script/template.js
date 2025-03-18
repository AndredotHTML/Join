function subtaskTemplat(inputSubtaskVal) {
    return ` <li class="addedSubtask">
                ${inputSubtaskVal} 
            </li>
    `
}

function templateAssignedTo(userName) {
    return `
    <div class="assigned-contacts d_flex">
            <div class="name-icon d_flex" data-value="${userName}">
                    ${userName.split(' ')[0][0]}
                </div>
            <label for="assigned-user-${userName}" class="d_flex">
                <div>
                    ${userName}
                </div>
                <input type="checkbox" name="assigned-user-${userName}" id="assigned-user-${userName}">
            </label>  
        </div>    
    `
}







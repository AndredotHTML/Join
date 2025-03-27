function subtaskTemplat(inputSubtaskVal) {
    return ` 
            <div>
                <li class="addedSubtask">
                    ${inputSubtaskVal} 
                </li>
                <div class="d_none icon-for-subtssk-work" id="input-subtask-icons" >
                    <img src="/assets/icons/close_cross.svg" class="icon-form" id="subtask_input_clear" alt="" onclick="clearInputSubtask()">
                    <div class="separator"></div>
                    <img src="/assets/icons/check_blue.svg" class="icon-form" alt="" onclick="addSubtask()">
                </div>
            </div>
    `
}

function templateAssignedTo(userName,isChecked) {
    return `
    <div class="assigned-contacts d_flex">
            <label for="assigned-user-${userName}" onclick="stopPropagation(event)" class="d_flex">
                <div class="d_flex icon-name-template">
                    <div class="name-icon d_flex" data-value="${userName}">
                    ${userName.split(' ')[0][0]}${userName.split(' ')[1][0]}
                    </div>
                    <div class="assigned-template-name">
                        ${userName}
                    </div>
                </div>
                <input type="checkbox" ${isChecked?"checked" :""} class="input-assigned" name="assigned-user-${userName}" id="assigned-user-${userName}">
            </label>  
        </div>    
    `
}







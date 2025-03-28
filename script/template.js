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

function generateTask(element) {
    let bg_color = toggleCategoryColor(element.category);
    let {completed,total,progress} = calculateSubtaskProgress(element.subtasks);
    let priority_img = togglePriority(element.priority);
    let user_icon =generateUserIcons(element.assignedUsers);

    return `
    <div draggable="true"  ondragstart="startDragging('${element.id}')" class="ticket" onclick="showOverlay('${element.id}')">
    <div class="ticket_category"><span style="background-color: ${bg_color};" >${element.category}</span></div>
    <div class="ticket_title"><h3>${element.title}</h3></div>
    <div class="ticket_description">${element.description}</div>
    <div class="ticket_subtasks">
    <div class="progress_bar">
          <div class="progress" style="width: ${progress}%;"></div>
    </div>
    <div class="completed"><span>${completed}/${total} Subtasks</span></div>
    </div>
    <div class="ticket_footer">
    <div class="ticket_users">${user_icon}</div>
    <div class="ticket_priority">${priority_img}</div>
    </div>
    </div>`
}

function generateNoTask(status){
    return `
        <div class="noTask_msg">
        <span>No task ${status} </span>
    </div>
`;
}

function generateTaskOverlay(element) {
    let bg_color = toggleCategoryColor(element.category);
    let priority_img = togglePriority(element.priority);
    let user_icon_name =generateOverlayUserIcons(element.assignedUsers);
    let subtask = generateSubtasks(element.subtasks, element.id);

    return `
    <div  class="ticket_overlay">
    <div class="overlay_header">
    <div class="category_overlay"><span style="background-color: ${bg_color};" >${element.category}</span></div>
    <div class="x" onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
    </div>
    <div class="title_overlay"><h1>${element.title}</h1></div>
    <div class="description_overlay">${element.description}</div>
    <div class="date_overlay"><span>Due date : </span>
    <div class="date">${element.dueDate}</div></div>
    <div class="priority_overlay"><span>Priority: </span>
    <div class="priority">${element.priority}  ${priority_img}</div></div>
    <div class="assigned_overlay">
    <table>
    <tr><th>Assigned To:</th> </tr>
    <tr><td>${user_icon_name}</td></tr>
    </table></div>
    <div class="subtasks"><span>Subtasks:</span>
        ${subtask}
    </div>
    <div class="delete_edit">
        <button type="button" class="delete_btn" onclick="deleteTask('${element.id}')"><img src="../assets/icons/delete.png" alt="delete icon">Delete</button>
        <button type="button" class="edit_btn"><img src="../assets/icons/edit.png" alt="edit icon">Edit</button>
    </div>
    </div>`
}

function addTaskOverlay(){
    return `  <div  class="add_task_overlay">
            <div class="addTask_header_overlay">
            <div class="header_x"  onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
            <div class="header_headline"><h1> Add Task</h1></div>
            </div>
            <div class="addTask_content">
            <input type="text" class="title_add_task" id="title_add_task" placeholder="Enter a title">
            <div class="description">
            <span><strong> Description</strong> (optional)</span>
            <textarea  id="description_add_task" placeholder="Enter a Description"></textarea>
            </div>
            <div class="date">
            <span><strong>Due date </strong></span>
            <input type="date" id="dateInput-add-task">
            </div>
            <div class="priority">
                <span><strong> Priority </strong></span>
                <div class="priority_buttons">
                 <label class="radio_btn add_task_urgent" for="urgent-rad" onclick="radioBtnChecked('Urgent')">
                        <input type="radio" id="urgent-rad" value="Urgent"> Urgent 
                         <img class="unchecked_priority" src="../assets/icons/urgent.svg" alt="">
                        <img class="checked_priority" src="../assets/icons/urgent_white.svg" alt="">
                 </label>
                 <label class="radio_btn add_task_medium" for="medium-rad" onclick="radioBtnChecked('Medium')">
                        <input type="radio" id="medium-rad" value="Medium"> Medium 
                        <img class="unchecked_priority" src="../assets/icons/medium.svg" alt="">
                        <img class="checked_priority" src="../assets/icons/medium_white.svg" alt="">
                 </label>
                 <label class="radio_btn add_task_low" for="low-rad" onclick="radioBtnChecked('Low')">
                        <input type="radio" id="low-rad" value="Low"> Low 
                        <img class="unchecked_priority" src="../assets/icons/low.svg" alt="">
                         <img class="checked_priority" src="../assets/icons/low_white.svg" alt="">
                 </label>
                </div>
            </div>
           <div class="assigned">
           <span><strong>Assigned to </strong>(optional)</span>
           <div class="select_contact">
                <span id="selectContactText">Select contact to assign</span>
                <img src="/assets/icons/arrow_drop_down.svg" alt="Arrow" id="arrowIcon">
            </div>
            <div class="contact_dropdown" id="contactDropdown">
                <ul id="contactList"></ul>
            </div>
           </div> 
           <div class="category">
            <span><strong>Category</strong></span>
            <div class="cat" onclick="toggleOptions()">
                <span id="category_add_task">Select category</span>
                <img src="/assets/icons/arrow_drop_down.svg" alt="Arrow" id="arrowIconCategory">
            </div>
                <div id="options_container" class="options_container" style="display: none;">
                <div class="option_category" onclick="selectCategory('Technical Task')">Technical Task</div>
                <div class="option_category" onclick="selectCategory('User Story')">User Story</div>
            </div>
            </div>
            <div class="subtasks">
                <span><strong>Subtasks </strong>(optional)</span>
            <div class="subtask_area">
                <input type="text" id="subtask" placeholder="Add new subtask">
                <img id="subtask_add_icon" src="../assets/icons/add.png" alt="Add">
            </div>
            <div>
                    <ul id="added_subtasks"></ul>
            </div>
           </div>
            </div>
                <div class="button_div">
                <button class="add_task_create_btn" id="add_task_create_btn" onclick="createTask()">
                    <div class="btn_title">Create Task </div>
                    <img src="../assets/icons/check.svg" alt="">
                </button>
            </div> 
   </div> `
}





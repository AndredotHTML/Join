function addTaskOverlay(status = 'toDo'){
    return `<div id="task-message" style="display: none;">
            <p>Task added to board</p>
            <img src="../assets/icons/board_icon.png" alt="Board Icon">
            </div>
            <div  class="add_task_overlay">
            <div class="addTask_header_overlay">
            <div class="header_x"  onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
            <div class="header_headline"><h1> Add Task</h1></div>
            </div>
            <div class="addTask_content">
            <input type="text" class="title_add_task" id="title_add_task" placeholder="Enter a title">
            <div id="title-error" class="error-message" style="color: red; display: none;"></div>
            <div class="description">
            <span><strong> Description</strong> (optional)</span>
            <textarea  id="description_add_task" placeholder="Enter a Description"></textarea>
            </div>
            <div class="date">
            <span><strong>Due date</strong></span>
            <div class="date-picker-wrapper">
            <input type="text" id="dateInput-add-task" placeholder="dd/mm/yyyy"  onclick="openCalendar()" readonly>
            <img src="../assets/icons/event.png" alt="Calendar" id="calendarIcon" class="calendar-icon" onclick="openCalendar()">
            </div>
            <div id="date-error" class="error-message" style="color: red; display: none;"></div>
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
                 <div id="priority-error"  class="error-message" style="color: red; display: none;"></div>
            </div>
           <div class="assigned">
           <span><strong>Assigned to </strong>(optional)</span>
           <div class="select_contact" onclick="toggleUserDropdown()">
                <span id="selectContactText">Select contact to assign</span>
                <img src="/assets/icons/arrow_drop_down.svg" alt="Arrow" id="arrowIcon">
            </div>
            <div id="selected_user_container"></div>
            <div class="contact_dropdown" id="contactDropdown"></div>
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
            <div id="category-error" class="error-message" style="color: red; display: none;"></div>
            </div>
            <div class="subtasks">
                    <span><strong>Subtasks</strong>(optional)</span>
            <div class="subtask_area">
                <input type="text" id="subtask" placeholder="Add new subtask" disabled>
            <div id="subtask-icons">
                    <img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">
            </div>
            </div>
                    <ul id="added-subtasks"></ul>
            </div>
            </div>
                <div class="button_div">
                <button class="add_task_create_btn" id="add_task_create_btn" onclick="createTaskByStatus('${status}')">
                    <div class="btn_title">Create Task </div>
                    <img src="../assets/icons/check.svg" alt="">
                </button>
            </div> 
   </div> `
}

function addTaskInProgressOverlay(status = 'inProgress'){
    return `<div id="task-message" style="display: none;">
            <p>Task added to board</p>
            <img src="../assets/icons/board_icon.png" alt="Board Icon">
            </div>
            <div  class="add_task_overlay">
            <div class="addTask_header_overlay">
            <div class="header_x"  onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
            <div class="header_headline"><h1> Add Task</h1></div>
            </div>
            <div class="addTask_content">
            <input type="text" class="title_add_task" id="title_add_task" placeholder="Enter a title">
            <div id="title-error" class="error-message" style="color: red; display: none;"></div>
            <div class="description">
            <span><strong> Description</strong> (optional)</span>
            <textarea  id="description_add_task" placeholder="Enter a Description"></textarea>
            </div>
            <div class="date">
            <span><strong>Due date</strong></span>
            <div class="date-picker-wrapper">
            <input type="text" id="dateInput-add-task" placeholder="dd/mm/yyyy"  onclick="openCalendar()" readonly>
            <img src="../assets/icons/event.png" alt="Calendar" id="calendarIcon" class="calendar-icon" onclick="openCalendar()">
            </div>
            <div id="date-error" class="error-message" style="color: red; display: none;"></div>
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
                 <div id="priority-error"  class="error-message" style="color: red; display: none;"></div>
            </div>
           <div class="assigned">
           <span><strong>Assigned to </strong>(optional)</span>
           <div class="select_contact" onclick="toggleUserDropdown()">
                <span id="selectContactText">Select contact to assign</span>
                <img src="/assets/icons/arrow_drop_down.svg" alt="Arrow" id="arrowIcon">
            </div>
            <div id="selected_user_container"></div>
            <div class="contact_dropdown" id="contactDropdown"></div>
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
            <div id="category-error" class="error-message" style="color: red; display: none;"></div>
            </div>
            <div class="subtasks">
                    <span><strong>Subtasks</strong>(optional)</span>
            <div class="subtask_area">
                <input type="text" id="subtask" placeholder="Add new subtask" disabled>
            <div id="subtask-icons">
                    <img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">
            </div>
            </div>
                    <ul id="added-subtasks"></ul>
            </div>
            </div>
                <div class="button_div">
                <button class="add_task_create_btn" id="add_task_create_btn" onclick="createTaskByStatus('${status}')">
                    <div class="btn_title">Create Task </div>
                    <img src="../assets/icons/check.svg" alt="">
                </button>
            </div> 
   </div> `
}

function addTaskAwaitFeedbackOverlay(status = 'awaitFeedback'){
    return `<div id="task-message" style="display: none;">
            <p>Task added to board</p>
            <img src="../assets/icons/board_icon.png" alt="Board Icon">
            </div>
            <div  class="add_task_overlay">
            <div class="addTask_header_overlay">
            <div class="header_x"  onclick="closeOverlay()"><img src="../assets/icons/x.png" alt="X"></div>
            <div class="header_headline"><h1> Add Task</h1></div>
            </div>
            <div class="addTask_content">
            <input type="text" class="title_add_task" id="title_add_task" placeholder="Enter a title">
            <div id="title-error" class="error-message" style="color: red; display: none;"></div>
            <div class="description">
            <span><strong> Description</strong> (optional)</span>
            <textarea  id="description_add_task" placeholder="Enter a Description"></textarea>
            </div>
            <div class="date">
            <span><strong>Due date</strong></span>
            <div class="date-picker-wrapper">
            <input type="text" id="dateInput-add-task" placeholder="dd/mm/yyyy"  onclick="openCalendar()" readonly>
            <img src="../assets/icons/event.png" alt="Calendar" id="calendarIcon" class="calendar-icon" onclick="openCalendar()">
            </div>
            <div id="date-error" class="error-message" style="color: red; display: none;"></div>
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
                 <div id="priority-error"  class="error-message" style="color: red; display: none;"></div>
            </div>
           <div class="assigned">
           <span><strong>Assigned to </strong>(optional)</span>
           <div class="select_contact" onclick="toggleUserDropdown()">
                <span id="selectContactText">Select contact to assign</span>
                <img src="/assets/icons/arrow_drop_down.svg" alt="Arrow" id="arrowIcon">
            </div>
            <div id="selected_user_container"></div>
            <div class="contact_dropdown" id="contactDropdown"></div>
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
            <div id="category-error" class="error-message" style="color: red; display: none;"></div>
            </div>
            <div class="subtasks">
                    <span><strong>Subtasks</strong>(optional)</span>
            <div class="subtask_area">
                <input type="text" id="subtask" placeholder="Add new subtask" disabled>
            <div id="subtask-icons">
                    <img id="subtask-add-icon" src="../assets/icons/add.png" alt="Add" onclick="showSubtaskActions()">
            </div>
            </div>
                    <ul id="added-subtasks"></ul>
            </div>
            </div>
                <div class="button_div">
                <button class="add_task_create_btn" id="add_task_create_btn" onclick="createTaskByStatus('${status}')">
                    <div class="btn_title">Create Task </div>
                    <img src="../assets/icons/check.svg" alt="">
                </button>
            </div> 
   </div> `
}

function subtaskActionsTemplate() {
    return `
        <img id="subtask-check-icon" src="../assets/icons/check.png" alt="Check" onclick="addSubtaskOverlay()">
        <img id="subtask-delete-icon" src="../assets/icons/x.png" alt="Delete" onclick="resetSubtaskIcons()">
    `;
}

function subtaskTemplate(subtaskValue){
    return `<li class="added_subtask">
             <span class="subtask_text">${subtaskValue}</span>
            <div class="subtask_actions">
                <img src="../assets/icons/edit.png" alt="Edit" class="edit-icon"  onclick="editSubtask(this)">
                <img src="../assets/icons/delete.png" alt="Delete" class="delete-icon" onclick="deleteSubtask(this)">
                <img src="../assets/icons/check.png" alt="Confirm" class="check-icon" onclick="confirmEdit(this)" style="display:none;">
            </div></li>`
}

function generateSingleUser(element, isChecked) {
    let name = element.name; 
    let nameParts = name.split(' ');
    let initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : name[0];
    let color = getColorForUser(name); 

    return `
        <label for="user-${element.id}" class="user-item">
            <span class="user-icon" style="background-color: ${color};">${initials}</span>
            <span class="user-name">${name}</span>
            <input type="checkbox" id="user-${element.id}" value="${name}" ${isChecked ? 'checked' : ''} onchange="updateSelectedUsers()">
            <span class="checkbox-custom"></span>
        </label>
    `;
}

function generateUserIcon(user) {
    let name = user.name;
    let nameParts = name.split(' ');
    let initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : name[0];
    let color = getColorForUser(name); 

    return `
        <span class="user-icon" style="background-color: ${color};">${initials}</span>
    `;
}
# Documentation for Script: `addTaskFloat_api.js`

## Variables:

### `contacts`

- **Description:** Array that holds all the contacts fetched from Firebase.
- **Type:** Array

## Functions:

### `getAllContacts(path)`

- **Description:** Fetches all contacts from the database using the provided path.
- **Parameters:**
  - `path` (string): The database path to fetch the contacts from.
- **Returns:** A promise that resolves with the contacts data as a JSON object.

### `pushToContactsArray()`

- **Description:** Fetches contacts and pushes them into the global `contacts` array.
- **Parameters:** None
- **Returns:** None

# Documentation for Script: `board_userManagement.js`

## Functions:

### `getCurrentUser()`

- **Description:** Retrieves the current user from localStorage and stores it in the `user` array, then generates the user icon header.
- **Parameters:** None
- **Returns:** None

### `generateUserIconHeader()`

- **Description:** Generates the user icon for the header by extracting the initials from the user's name and displaying them.
- **Parameters:** None
- **Returns:** None

### `getUsersInitials(assignedUsers)`

- **Description:** Returns an array of objects containing the initials and names of the assigned users.
- **Parameters:**
  - `assignedUsers` (array): Array of user names.
- **Returns:** An array of objects, each containing the initials and name of a user.

### `generateUserIcons(assignedUsers)`

- **Description:** Generates user icons for the assigned users, including handling cases with more than three users.
- **Parameters:**
  - `assignedUsers` (array): Array of user names.
- **Returns:** A string of HTML for the user icons.

### `createExtraUsersIcon(count, leftPosition)`

- **Description:** Creates an HTML element for the icon representing additional users.
- **Parameters:**
  - `count` (number): Number of extra users.
  - `leftPosition` (number): The left position for the icon's CSS style.
- **Returns:** A string of HTML for the extra user icon.

### `createDisplayedUserIcons(usersData, maxIcons, overlapDistance)`

- **Description:** Creates HTML for displaying the icons of a specified number of users, considering overlap.
- **Parameters:**
  - `usersData` (array): Array of user objects containing initials and names.
  - `maxIcons` (number): Maximum number of icons to display.
  - `overlapDistance` (number): The overlap distance between icons.
- **Returns:** A string of HTML for the displayed user icons.

### `generateSingleUserIcon(initial, leftPosition, color)`

- **Description:** Generates a single user icon based on initials, position, and color.
- **Parameters:**
  - `initial` (string): Initials of the user.
  - `leftPosition` (number): Left position for the icon's CSS style.
  - `color` (string): Background color for the icon.
- **Returns:** A string of HTML for a single user icon.

### `generateOverlayUserIcons(assignedUsers)`

- **Description:** Generates overlay user icons for the assigned users.
- **Parameters:**
  - `assignedUsers` (array): Array of user names.
- **Returns:** A string of HTML for the overlay user icons.

### `generateOverlaySingleUserIcon(initial, name, color)`

- **Description:** Generates a single overlay user icon with their name and initials.
- **Parameters:**
  - `initial` (string): Initials of the user.
  - `name` (string): Name of the user.
  - `color` (string): Background color for the icon.
- **Returns:** A string of HTML for a single overlay user icon.

### `getColorForUser(name)`

- **Description:** Determines the background color for a user based on the first letter of their name.
- **Parameters:**
  - `name` (string): The name of the user.
- **Returns:** A string representing the background color.

### `handleSearch()`

- **Description:** Handles the search input to filter tasks and displays sections accordingly.
- **Parameters:** None
- **Returns:** None

### `filterTasksByStatusAndSearch(status, searchTerm)`

- **Description:** Filters tasks by status and search term.
- **Parameters:**
  - `status` (string): The task status.
  - `searchTerm` (string): The search term to filter tasks.
- **Returns:** An array of filtered tasks.

### `displayTasks(container, filteredTasks)`

- **Description:** Displays filtered tasks inside the provided container.
- **Parameters:**
  - `container` (HTMLElement): The container element to display tasks in.
  - `filteredTasks` (array): The tasks to display.
- **Returns:** None

### `filterAndDisplayTasks(status, searchTerm)`

- **Description:** Filters and displays tasks by status and search term in the respective container.
- **Parameters:**
  - `status` (string): The task status.
  - `searchTerm` (string): The search term to filter tasks.
- **Returns:** A boolean indicating if tasks were found.

### `toggleSections(displayStyle)`

- **Description:** Toggles the display of task sections by setting their `display` style.
- **Parameters:**
  - `displayStyle` (string): The display style to set for the sections.
- **Returns:** None

### `hideAllSections()`

- **Description:** Hides all task sections by setting their display style to "none."
- **Parameters:** None
- **Returns:** None

### `showAllSections()`

- **Description:** Shows all task sections by setting their display style to "flex."
- **Parameters:** None
- **Returns:** None

### `showNoTasksFoundMessage()`

- **Description:** Displays a "No task found" message in all task sections.
- **Parameters:** None
- **Returns:** None

### `showMiniMenu(event, taskId, currentStatus)`

- **Description:** Displays the mini menu for changing task status at the position of the mouse click.
- **Parameters:**
  - `event` (Event): The mouse event triggering the display.
  - `taskId` (string): The ID of the task.
  - `currentStatus` (string): The current status of the task.
- **Returns:** None

### `prepareStatusMenu(menu, content)`

- **Description:** Prepares the status menu with the given content and ensures it is hidden off-screen until displayed.
- **Parameters:**
  - `menu` (HTMLElement): The status menu element.
  - `content` (string): The HTML content for the menu.
- **Returns:** None

### `calculateMenuPosition(event, menu)`

- **Description:** Calculates the position of the status menu to prevent it from overflowing the screen.
- **Parameters:**
  - `event` (Event): The mouse event triggering the calculation.
  - `menu` (HTMLElement): The status menu element.
- **Returns:** An object containing `x` and `y` coordinates for the menu.

### `generateStatusMenuHTML(taskId, currentStatus)`

- **Description:** Generates the HTML content for the status menu based on the current status of the task.
- **Parameters:**
  - `taskId` (string): The ID of the task.
  - `currentStatus` (string): The current status of the task.
- **Returns:** A string of HTML for the status menu.

### `createStatusMenuOption(taskId, status, displayedStatus)`

- **Description:** Creates an HTML option for changing a task's status.
- **Parameters:**
  - `taskId` (string): The ID of the task.
  - `status` (string): The status to change to.
  - `displayedStatus` (string): The displayed status name.
- **Returns:** A string of HTML for the status option.

### `closeStatusMenu(event)`

- **Description:** Closes the status menu when clicked outside of it.
- **Parameters:**
  - `event` (Event): The mouse event triggering the close.
- **Returns:** None

### `changeTaskStatus(taskId, newStatus)`

- **Description:** Changes the status of a task and updates it in Firebase, then updates the view.
- **Parameters:**
  - `taskId` (string): The ID of the task.
  - `newStatus` (string): The new status to set.
- **Returns:** None

# Documentation for Script: `board.js`

## Variables:

### `tasks`

- **Description:** Array that holds all the tasks fetched from Firebase.
- **Type:** Array

### `currentDraggedElement`

- **Description:** Holds the ID of the task that is currently being dragged.
- **Type:** String

### `predefinedColors`

- **Description:** Array that holds predefined colors used for categorizing tasks.
- **Type:** Array of Strings

## Functions:

### `updateHTML()`

- **Description:** Updates the HTML content of the board by calling necessary functions to fetch tasks, user data, and display different task statuses.
- **Parameters:** None
- **Returns:** None

### `updateView()`

- **Description:** Refreshes the display of tasks by calling the display functions for different task statuses.
- **Parameters:** None
- **Returns:** None

### `getAllTasks(path)`

- **Description:** Fetches all tasks from a specified Firebase path.
- **Parameters:**
  - `path` (string): The Firebase path to fetch tasks from.
- **Returns:** `Promise` that resolves to the task data.

### `pushToTask()`

- **Description:** Pushes fetched task data to the `tasks` array and updates the view by displaying tasks according to their status.
- **Parameters:** None
- **Returns:** None

### `displayToDo()`

- **Description:** Displays tasks with the "To Do" status on the board.
- **Parameters:** None
- **Returns:** None

### `displayInProgress()`

- **Description:** Displays tasks with the "In Progress" status on the board.
- **Parameters:** None
- **Returns:** None

### `displayAwaitFeedback()`

- **Description:** Displays tasks with the "Await Feedback" status on the board.
- **Parameters:** None
- **Returns:** None

### `displayDone()`

- **Description:** Displays tasks with the "Done" status on the board.
- **Parameters:** None
- **Returns:** None

### `toggleCategoryColor(category)`

- **Description:** Returns a color based on the task category.
- **Parameters:**
  - `category` (string): The category of the task (e.g., "User Story").
- **Returns:** String representing the color associated with the category.

### `isSubtasksEmpty(subtasks)`

- **Description:** Checks if a task has no subtasks.
- **Parameters:**
  - `subtasks` (object): The subtasks of a task.
- **Returns:** Boolean indicating if the subtasks are empty.

### `calculateSubtaskProgress(subtasks)`

- **Description:** Calculates the progress of a task's subtasks.
- **Parameters:**
  - `subtasks` (object): The subtasks of a task.
- **Returns:** An object containing `completed`, `total`, and `progress` of the subtasks.

### `togglePriority(priority)`

- **Description:** Returns the appropriate icon for a task's priority.
- **Parameters:**
  - `priority` (string): The priority of the task (e.g., "Urgent", "Medium", "Low").
- **Returns:** HTML string for the icon representing the task's priority.

### `isDragAndDropEnabled()`

- **Description:** Checks if drag and drop functionality is enabled based on the screen width.
- **Parameters:** None
- **Returns:** Boolean indicating if drag and drop is enabled.

### `startDragging(id)`

- **Description:** Starts the dragging process for a task.
- **Parameters:**
  - `id` (string): The ID of the task being dragged.
- **Returns:** None

### `allowDrop(ev)`

- **Description:** Allows a task to be dropped by preventing the default action on the target element.
- **Parameters:**
  - `ev` (Event): The drop event triggered by the user.
- **Returns:** None

### `moveTo(status)`

- **Description:** Moves a task to a new status (To Do, In Progress, Await Feedback, Done) and updates the task status in Firebase.
- **Parameters:**
  - `status` (string): The new status of the task.
- **Returns:** None

### `showDragTooltip()`

- **Description:** Displays a tooltip when drag-and-drop is not available on smaller screens.
- **Parameters:** None
- **Returns:** None

### `updateTaskStatus(taskId, newStatus)`

- **Description:** Updates the status of a task in Firebase.
- **Parameters:**
  - `taskId` (string): The ID of the task being updated.
  - `newStatus` (string): The new status of the task.
- **Returns:** `Promise` for the Firebase update.

### `removeHighlight(id)`

- **Description:** Removes the highlight from a task when it is no longer dragged.
- **Parameters:**
  - `id` (string): The ID of the task.
- **Returns:** None

### `highlight(id)`

- **Description:** Adds a highlight to a task when it is dragged over a valid drop target.
- **Parameters:**
  - `id` (string): The ID of the task.
- **Returns:** None

### `showOverlay(id)`

- **Description:** Displays the overlay with task details when a task is clicked.
- **Parameters:**
  - `id` (string): The ID of the task.
- **Returns:** None

### `closeOverlay(event)`

- **Description:** Closes the overlay when the close button or overlay background is clicked.
- **Parameters:**
  - `event` (Event): The click event that triggered the overlay close.
- **Returns:** None

### `getSubtasks(subtasks)`

- **Description:** Converts the subtasks object into an array for easier processing.
- **Parameters:**
  - `subtasks` (object): The subtasks of a task.
- **Returns:** Array of subtasks with `title` and `completed` properties.

### `generateSubtasks(subtasks, taskId)`

- **Description:** Generates HTML for displaying subtasks of a task.
- **Parameters:**
  - `subtasks` (object): The subtasks of a task.
  - `taskId` (string): The ID of the task.
- **Returns:** HTML string representing the subtasks.

### `generateSingleSubtask(title, checked, taskId, index)`

- **Description:** Generates HTML for a single subtask.
- **Parameters:**
  - `title` (string): The title of the subtask.
  - `checked` (string): Whether the subtask is checked or not.
  - `taskId` (string): The ID of the task.
  - `index` (number): The index of the subtask.
- **Returns:** HTML string for the subtask.

### `toggleSubtask(taskId, subtaskId)`

- **Description:** Toggles the completion status of a subtask.
- **Parameters:**
  - `taskId` (string): The ID of the task containing the subtask.
  - `subtaskId` (string): The ID of the subtask.
- **Returns:** `Promise` for the Firebase update.

### `updateSubtaskStatus(taskId, subtaskId, newStatus)`

- **Description:** Updates the completion status of a subtask in Firebase.
- **Parameters:**
  - `taskId` (string): The ID of the task.
  - `subtaskId` (string): The ID of the subtask.
  - `newStatus` (boolean): The new completion status of the subtask.
- **Returns:** `Promise` for the Firebase update.

### `deleteTask(taskId)`

- **Description:** Deletes a task from Firebase.
- **Parameters:**
  - `taskId` (string): The ID of the task to be deleted.
- **Returns:** `Promise` for the Firebase delete.

### `showAddTaskOverlay()`

- **Description:** Displays the "Add Task" overlay.
- **Parameters:** None
- **Returns:** None

### `showAddTaskInProgressOverlay()`

- **Description:** Displays the "Add Task in Progress" overlay.
- **Parameters:** None
- **Returns:** None

### `showAddTaskAwaitFeedbackOverlay()`

- **Description:** Displays the "Add Task Await Feedback" overlay.
- **Parameters:** None
- **Returns:** None

### `showEditOverlay(id)`

- **Description:** Displays the "Edit Task" overlay with pre-filled task data.
- **Parameters:**
  - `id` (string): The ID of the task being edited.
- **Returns:** None

### `updateTaskInFirebase(taskId, updatedTask)`

- **Description:** Updates the task data in Firebase.
- **Parameters:**
  - `taskId` (string): The ID of the task to be updated.
  - `updatedTask` (object): The updated task data.
- **Returns:** `Promise` for the Firebase update.

# Documentation for Script: `addTaskFloat.js`

## Variables:

### `assignedContacts`

- **Description:** Array holding the list of contacts assigned to the task.
- **Type:** Array

### `updatedPriority`

- **Description:** Stores the selected priority for the task.
- **Type:** String

## Functions:

### `selectCategory(category)`

- **Description:** Sets the selected category to the `category_add_task` element and hides the options container.
- **Parameters:**
  -`category` (string) : The category to be selected.
- **Returns:** None

### `toggleOptions()`

- **Description:** Toggles the visibility of the options container and changes the arrow icon.
- **Parameters:** None
- **Returns:** None

### `showSubtaskActions()`

- **Description:** Enables the subtask input and displays the icons for adding and deleting a subtask.
- **Parameters:** None
- **Returns:** None

### `addSubtaskOverlay()`

- **Description:** Adds a new subtask to the list of subtasks if the input is not empty and resets the subtask icons.
- **Parameters:** None
- **Returns:** None

### `generateSubtasksHtml(subtasks)`

- **Description:** Generates HTML for all the subtasks in a list.
- **Parameters:**
  -`subtasks` (Array): List of subtasks.
- **Returns:** String (HTML markup for all subtasks)

### `subtaskTemplate(subtaskValue)`

- **Description:** Generates HTML for a subtask item.
- **Parameters:**
  -`subtaskValue`(string): The text value of the subtask.
- **Returns:** String (HTML markup for the subtask)

### `resetSubtaskIcons()`

- **Description:** Resets the subtask icons to their default state and disables the subtask input.
- **Parameters:** None
- **Returns:** None

### `editSubtask(icon)`

- **Description:** Enables editing of a subtask item when the edit icon is clicked.
- **Parameters:**
  -`icon` (Element): The clicked edit icon element.
- **Returns:** None

### `confirmEdit(icon)`

- **Description:** Confirms the edited subtask and disables editing mode.
- **Parameters:**
  -`icon` (Element): The clicked confirm icon element.
- **Returns:** None

### `deleteSubtask(icon)`

- **Description:** Deletes the subtask when the delete icon is clicked.
- **Parameters:**
  -`icon`(Element): The clicked delete icon element.
- **Returns:** None

### `displayContacts()`

- **Description:** Displays the contacts list in the contact dropdown menu.
- **Parameters:** None
- **Returns:** None

### `generateSingleUser(element, isChecked)`

- **Description:** Generates HTML for a single user in the contact dropdown.
- **Parameters:**
  - `element`(Object): The contact object containing the contact's name and ID.
  - `isChecked`(boolean): Whether the user is already selected.
- **Returns:** String (HTML markup for the user)

### `generateUserIcon(user)`

- **Description:** Generates an icon for the user.
- **Parameters:**
  -`user` (Object): The user object.
- **Returns:** String (HTML markup for the user's icon)

### `toggleUserDropdown()`

- **Description:** Toggles the visibility of the contact dropdown menu and the selected users container.
- **Parameters:** None
- **Returns:** None

### `toggleContactMenu(contactMenu, arrowIcon)`

- **Description:** Toggles the visibility of the contact menu and updates the arrow icon.
- **Parameters:**
  -`contactMenu` (Element): The contact menu element.
  -`arrowIcon` (Element): The arrow icon element.
- **Returns:** None

### `toggleSelectedUsersContainer(selectedUsersContainer)`

- **Description:** Toggles the visibility of the selected users container based on the selected users.
- **Parameters:**
  -`selectedUsersContainer` (Element): The selected users container element.
- **Returns:** None

### `updateSelectedUsers()`

- **Description:**  Updates the list of selected users and stores them in local storage.
- **Parameters:** None
- **Returns:** None

### `getCheckedUsers()`

- **Description:** Retrieves all checked users from the contact list.
- **Parameters:** None
- **Returns:** Array (List of selected user names)

### `renderSelectedUserIcons(userList, containerId)`

- **Description:** Renders icons for the selected users in the specified container.
- **Parameters:**
  -`userList` (Array): List of selected user names.
  -`containerId` (string): The ID of the container element.
- **Returns:** None

### `showSelectedUsersFromTask()`

- **Description:** Displays the selected users for a task.
- **Parameters:** None
- **Returns:** None

### `renderUserIconsFromNames(userNames, containerId)`

- **Description:** Renders icons for a list of user names in the specified container.
- **Parameters:**
  -`userNames` (Array): List of user names.
  -`containerId` (string): The ID of the container element.
- **Returns:** None

### `generateUserIconFromName(userName)`

- **Description:** Generates a user icon for a given user name.
- **Parameters:**
  -`userName` (string): The user's name.
- **Returns:** String (HTML markup for the user icon)

### `createTask()`

- **Description:** Creates a task and adds it to the Firebase database.
- **Parameters:** None
- **Returns:** None

### `createTaskInProgress()`

- **Description:** Creates a task with an "inProgress" status and adds it to the Firebase database.
- **Parameters:** None
- **Returns:** None

### `createTaskAwaitFeedback()`

- **Description:** Creates a task with an "awaitFeedback" status and adds it to the Firebase database.
- **Parameters:** None
- **Returns:** None

### `taskObject()`

- **Description:**  Constructs an object representing a task with the necessary details.
- **Parameters:** None
- **Returns:**  Object (Task object)

### `taskObjectInProgress()`

- **Description:** Constructs an object representing a task with an "inProgress" status.
- **Parameters:** None
- **Returns:**  Object (Task object)

### `taskObjectAwaitFeedback()`

- **Description:** Constructs an object representing a task with an "awaitFeedback" status.
- **Parameters:** None
- **Returns:**  Object (Task object)

### `validateForm(title, dueDate, priority, category)`

- **Description:** Validates the task creation form to ensure all required fields are filled.
- **Parameters:**
  -`title` (string): The task title.
  -`dueDate` (string): The task due date.
  -`priority` (string): The task priority.
  -`category` (string): The task category.
- **Returns:**  Boolean (true if valid, false if invalid)

### `getPriority()`

- **Description:** Retrieves the selected priority for the task from the form.
- **Parameters:** None
- **Returns:** String (Priority value)

### `getNewSubtasks()`

- **Description:** Retrieves all subtasks from the form and constructs an array of subtask objects.
- **Parameters:** None
- **Returns:** Array (List of subtasks)

### `showTaskMessage()`

- **Description:** Displays a success message after task creation.
- **Parameters:** None
- **Returns:** None

### `showErrorMessage(message, errorId)`

- **Description:**  Displays an error message for a specific field.
- **Parameters:**
  -`message` (string): The error message to display.
  -`errorId` (string): The ID of the error container element.
- **Returns:** None

### `resetFormFields()`

- **Description:** Clears the values of the task form fields including title, description, and date. Resets the category text to the default prompt.
- **Parameters:** None
- **Returns:** None

### `resetSubtasks()`

- **Description:** Resets the subtask input field and removes all added subtasks from the UI.
- **Parameters:** None
- **Returns:** None

# Documentation for Script: `addTaskFloat_UI.js`

## Functions:

### `openCalendar()`

- **Description:** Opens a date picker (Flatpickr) on the due date input field with a specified format and minimum date set to today.
- **Parameters:** None
- **Returns:** None

### `radioBtnChecked(priority)`

- **Description:** Sets the selected priority, updates the styling of the priority buttons, and toggles the priority icons accordingly.
- **Parameters:**
  -`priority` (string): The selected priority (e.g., "Urgent", "Medium", "Low").
- **Returns:** None

### `toggleIcons(radioBtn,action)`

- **Description:** Shows or hides the checked/unchecked icons for a given radio button element based on the specified action.
- **Parameters:**
  -`radioBtn` (Element): The label element for the priority radio button.
  -`action` (string): The action to perform, either "show" or "hide".
- **Returns:** None

### `updateToDo(task)`

- **Description:** Appends a generated HTML task element to the "To Do" section.
- **Parameters:**
  -`task` (Object): The task object to display.
- **Returns:** None

### `updateInProgress(task)`

- **Description:** Appends a generated HTML task element to the "In Progress" section.
- **Parameters:**
  -`task` (Object): The task object to display.
- **Returns:** None

### `updateAwaitFeedback(task)`

- **Description:** Appends a generated HTML task element to the "Await Feedback" section.
- **Parameters:**
  -`task` (Object): The task object to display.
- **Returns:** None

### `postTask(path,data)`

- **Description:** Sends a POST request to the Firebase Realtime Database to save a new task.
- **Parameters:**
  -`path` (string): The database path where the task should be saved.
  -`data` (Object): The task data to save.
- **Returns:** Promise<string | null>: The ID (name) of the newly created task, or null if an error occurred.

### `saveEditedTask(taskId)`

- **Description:** Saves an edited task by collecting updated form data and sending it to Firebase, then reloads the page and closes the overlay.
- **Parameters:**
  -`taskId` (string): The ID of the task to update.
- **Returns:** Promise

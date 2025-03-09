let task = [{
    'id' : 0,
    'title' : 'Kochwelt Page & Recipe Recommender',
    'type' : 'User Story',
    'description' : 'Build start page with recipe recommendataion...',
    'date' : '11.3.2025' ,
    'priority': 'medium',
    'users' : ['Emmanuel Mauer' , 'Marcel Bauer', 'Anton Mayer'],
    'subtasks' : ['Implement Recipe Recommendation', 'Start Page Layout'],
    'category' : 'inProgress'
},{
    'id' : 1,
    'title' : 'CSS Architecture Planning',
    'type' : 'Technical Task',
    'description' : 'Define CSS naming conventions and structure',
    'date' : '11.3.2025' ,
    'priority': 'urgent',
    'users' : ['Benedikt Ziegler' , 'Sofia Müller'],
    'subtasks' : ['Establish CSS Methodology', 'Setup Base Styles'],
    'category' : 'done'
}];

let currentDraggedElement;

function updateHTML() {
    displayToDo();
    displayInProgress();
    displayAwaitFeedback();
    displayDone();
}

function displayToDo() {
    let toDo = task.filter(t => t['category'] == 'toDo');
    let toDoContainer = document.getElementById('toDo');
    toDoContainer.innerHTML = '';
    
    if(toDo.length === 0) {
        toDoContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < toDo.length ; i++){
            const element = toDo[i];
            toDoContainer.innerHTML += generateTask(element);
        }
    }
}

function displayInProgress(){
    let inProgress = task.filter(t => t['category'] == 'inProgress')
    let inProgressContainer = document.getElementById('inProgress');
    inProgressContainer.innerHTML = '';

    if(inProgress.length === 0) {
        inProgressContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < inProgress.length ; i++) {
            const element = inProgress[i];
            inProgressContainer.innerHTML += generateTask(element);
        }
    }
}

function displayAwaitFeedback(){
    let aFeedback = task.filter(t => t['category'] == 'awaitFeedback');
    let aFeedbackContainer = document.getElementById('awaitFeedback');
    aFeedbackContainer.innerHTML = '' ;

    if(aFeedback.length === 0) {
        aFeedbackContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < aFeedback.length ; i++) {
            const element = aFeedback[i];
            aFeedbackContainer.innerHTML += generateTask(element);
        }
    }
}

function displayDone() {
    let done = task.filter(t => t['category'] == 'done');
    let doneContainer = document.getElementById('done');
    doneContainer.innerHTML = '';

    if(done.length === 0) {
        doneContainer.innerHTML = generateNoTask();
    }else {
        for(let i = 0 ; i < done.length ; i++) {
            const element = done[i];
            doneContainer.innerHTML += generateTask(element);
        }
    }
}

function generateTask(element) {
    return `
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`
}

function generateNoTask(){
    return `
        <div class="noTask_msg">
        <span>No task </span>
    </div>
`;
}

function startDragging(id) {
    currentDraggedElement = id ;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category){
    task[currentDraggedElement]['category'] = category;
    updateHTML();
    removeHighlight(category); 
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');

}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
    
}
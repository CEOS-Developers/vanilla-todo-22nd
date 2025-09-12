const dateElement = document.getElementById('date');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const currentTask = document.getElementById('currentTask');
const userDate = document.getElementById('userDate');


let tasks = [];

function updateTaskCount() {
    currentTask.textContent = tasks.length;
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const span = document.createElement('span');
    span.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = '';
    updateTaskCount();
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', function(event) {
    const targetElement = event.target;

    if(targetElement.type === 'checkbox') {
        const li = targetElement.closest('li');
        li.classList.toggle('completed');
        updateTaskCount();
    }
    if(targetElement.tagName === 'BUTTON') {
        const li = targetElement.closest('li');
        li.remove();
        updateTaskCount();
    }
});
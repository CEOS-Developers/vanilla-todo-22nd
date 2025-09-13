const dateElement = document.getElementById('date');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const currentTask = document.getElementById('currentTask');
const userDate = document.getElementById('userDate');

let todosByDate = JSON.parse(localStorage.getItem('todos') || '{}');

function renderTasks() {
    const selectedDate = userDate.value;

    taskList.innerHTML = "";

    const tasksForSelectedDate = todosByDate[selectedDate] || [];

    tasksForSelectedDate.forEach((task, index) => {
        const li = document.createElement('li');

        if(task.completed){
            li.classList.add('completed');
        }

        li.dataset.index = index;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        const span = document.createElement('span');
        span.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
        });

    updateTaskCount();
}

function updateTaskCount() {
    const selectedDate = userDate.value;
    const tasksSelectedDate = todosByDate[selectedDate] || [];

    const uncompletedTasks = tasksSelectedDate.filter(task => !task.completed).length;
    currentTask.textContent = uncompletedTasks;
}

function addTask() {
    const taskText = taskInput.value.trim();
    const selectedDate = userDate.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }
    // 날짜의 배열이 없으면 빈 배열 생성
    if (!todosByDate[selectedDate]) {
        todosByDate[selectedDate] = [];
    }
    todosByDate[selectedDate].push({text: taskText, completed: false});

    taskInput.value = "";

    saveData();
    renderTasks();
}

function saveData() {
    localStorage.setItem('todos', JSON.stringify(todosByDate));
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

userDate.addEventListener('change', renderTasks);

taskList.addEventListener('click', function(event) {
    const targetElement = event.target;
    const li = targetElement.closest('li');

    const selectedDate = userDate.value;
    const taskIndex = li.dataset.index;

    if(targetElement.type === 'checkbox') {
        todosByDate[selectedDate][taskIndex].completed = !todosByDate[selectedDate][taskIndex].completed;
    }
    if(targetElement.tagName === 'BUTTON') {
        todosByDate[selectedDate].splice(taskIndex,1);
    }

    saveData();
    renderTasks();
});

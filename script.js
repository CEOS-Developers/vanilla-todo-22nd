const todoInput = document.getElementById('todo_input');
const addButton = document.getElementById('add_button');
const todoList = document.getElementById('todo_list');
const dateSpan = document.getElementById('date_span');
const prevButton = document.getElementById('date_prev');
const nextButton = document.getElementById('date_next');

let todos = JSON.parse(localStorage.getItem('todos')) || {};

// 오늘 날짜
let currentDate = new Date();

// 날짜 포멧 변환
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// 날짜 갱신
function updateDate() {
  dateSpan.textContent = formatDate(currentDate);
}

// 투두 불러오기
function renderTodos() {
  const selectDate = formatDate(currentDate);
  const todayTodos = todos[selectDate] || [];

  todoList.innerHTML = '';

  todayTodos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;

    // 삭제 버튼 추가
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', () => {
      todayTodos.splice(index, 1);
      todos[selectDate] = todayTodos;
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    });
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

// 투두 추가
addButton.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (text === '') return;

  const date = formatDate(currentDate);
  if (!todos[date]) {
    todos[date] = [];
  }
  todos[date].push(text);

  localStorage.setItem('todos', JSON.stringify(todos));
  todoInput.value = '';
  renderTodos();
});

// 전날 버튼 클릭
prevButton.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDate();
  renderTodos();
});

// 다음날 버튼 클릭
nextButton.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDate();
  renderTodos();
});

// 초기화
updateDate();
renderTodos();

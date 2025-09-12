let currentDate = new Date(); //오늘 날짜 및 시간
let todosForEachDay = {}; //날짜별 투두를 저장할 배열

const addButton = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("sidebar-toggle");

// 날짜를 키로 사용하기 위해서 포맷팅 필요
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

//날짜 보여주기
function showDate() {
  const dateElement = document.getElementById("date");

  // 형식 변환
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  dateElement.textContent = currentDate.toLocaleDateString("ko-KR", options);
}

// 투두 개수 보여주기 - 날짜 key에 해당하는 todo의 개수 중 completed 아닌 것만 골라서 개수
function Counter() {
  const key = formatDate(currentDate);
  const todos = todosForEachDay[key] || [];
  const todoCount = todos.filter((todo) => !todo.completed).length;
  const countTodos = document.getElementById("counter"); // 여기서 가져오기
  if (countTodos) {
    countTodos.textContent = `오늘의 남은 할 일은 ${todoCount}개 입니다 !`;
  }
}

//투두 요소
function showTodos() {
  todoList.innerHTML = "";
  const key = formatDate(currentDate); //키: 날짜
  const todos = todosForEachDay[key] || []; //투두요소: 각 키에 할당되는 요소들

  todos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo, key)); //투두 만들어지면 append
  });
  Counter();
}

// 투두 요소 만들기 (내용 및 완료, 삭제)
function createTodoElement(todo, key) {
  const li = document.createElement("li");

  //내용
  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todo.text;

  //완료 버튼
  const completeButton = document.createElement("button");
  completeButton.textContent = " ";
  completeButton.className = "complete-btn";
  completeButton.addEventListener("click", () => {
    li.classList.toggle("completed");
    todo.completed = !todo.completed;
    saveTodos();
    Counter();
  });

  //삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "asset/trash.png";
  deleteIcon.width = 18;
  deleteIcon.height = 18;
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener("click", () => {
    todosForEachDay[key] = todosForEachDay[key].filter((t) => t.id !== todo.id);
    saveTodos();
    showTodos();
  });

  //li에 투두요소 추가
  li.append(completeButton, todoText, deleteButton);
  //완료 상태 보여주기
  if (todo.completed) {
    li.classList.add("completed");
  }
  return li;
}

//투두 추가
function addTodo() {
  const text = todoInput.value.trim(); //입력받은 텍스트 공백 제거 후 text에 저장
  if (text === "") return;

  // 오늘 날짜에 해당하는 키에 투두 추가
  const key = formatDate(currentDate);
  if (!todosForEachDay[key]) todosForEachDay[key] = [];

  // 삭제를 위한 id, 완료 여부 저장을 위한 completed 추가
  const todo = { id: Date.now(), text, completed: false };
  todosForEachDay[key].push(todo);

  saveTodos();
  showTodos();
  todoInput.value = "";
  Counter();
}

// 날짜 이동 버튼 및 투두와 날짜 재랜더링
prevButton.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  showDate();
  showTodos();
});
nextButton.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  showDate();
  showTodos();
});

//로컬스토리지 저장 및 불러오기
function saveTodos() {
  // 배열 문자열 변환 후 저장
  localStorage.setItem("todosForEachDay", JSON.stringify(todosForEachDay));
}

function loadTodos() {
  const data = localStorage.getItem("todosForEachDay");
  if (data) {
    // JSON 데이터 parsing -> 원래 배열로
    todosForEachDay = JSON.parse(data);
  }
}

//실행 시
addButton.addEventListener("click", addTodo);
loadTodos();
showDate();
showTodos();

// 사이드 바
toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

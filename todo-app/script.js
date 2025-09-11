let currentDate = new Date(); //오늘 날짜 및 시간
let todosForEachDay = {}; //날짜별 투두를 저장할 배열

const addButton = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

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

//투두 객체
function showTodos() {
  todoList.innerHTML = "";
  const key = formatDate(currentDate); //키: 날짜
  const todos = todosForEachDay[key]; //투두요소: 각 키에 할당되는 요소들

  todos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo, key)); //투두 만들어지면 append
  });
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
  });

  //삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.className = "delete-btn";
  deleteButton.addEventListener("click", () => {
    todosForEachDay[key] = todosForEachDay[key].filter((t) => t.id !== todo.id);
    showTodos();
  });

  li.append(completeButton, todoText, deleteButton);
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

  showTodos();
  todoInput.value = ""; //입력창 비우기
}

addButton.addEventListener("click", addTodo);
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

showDate();
showTodos();

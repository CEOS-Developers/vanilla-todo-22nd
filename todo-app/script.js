const addButton = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function addTodo() {
  const text = todoInput.value.trim();

  if (text !== "") {
    const li = document.createElement("li");
    li.textContent = text;

    todoList.appendChild(li);
    todoInput.value = "";
    todoInput.focus();
  }
}

addButton.addEventListener("click", addTodo);

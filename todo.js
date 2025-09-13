const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

let todos = [];

function render() {
  todoList.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (t.done ? " done" : "");
    li.innerHTML = `
      <span class="title">${t.text}</span>
      <div>
        <input type="checkbox" ${t.done ? "checked" : ""} data-index="${i}">
        <button data-action="delete" data-index="${i}">X</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && todoInput.value.trim()) {
    todos.push({ text: todoInput.value.trim(), done: false });
    todoInput.value = "";
    render();
  }
});

todoList.addEventListener("click", (e) => {
  const i = e.target.dataset.index;
  if (e.target.type === "checkbox") {
    todos[i].done = e.target.checked;
  }
  if (e.target.dataset.action === "delete") {
    todos.splice(i, 1);
  }
  render();
});

render();

const addButton = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function addTodo() {
  const text = todoInput.value.trim(); //입력받은 텍스트 공백 제거 후 text에 저장

  if (text !== "") {
    //text가 공백이 아닐 때만
    const li = document.createElement("li"); //새로운 li 요소를 만듦
    const todoText = document.createElement("span");
    todoText.classList.add("todo-text");
    todoText.textContent = text;

    // 리스트 요소 완료
    const completeButton = document.createElement("button");
    completeButton.textContent = " ";
    completeButton.className = "complete-btn";
    completeButton.addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    //리스트 요소 삭제
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => {
      li.remove();
    });

    // 새로운 요소 추가
    li.appendChild(completeButton);
    li.appendChild(todoText); //기존 투두리스트의 child로 새로 생성한 li 넣기
    li.appendChild(deleteButton);
    document.querySelector("#todo-list").appendChild(li);
    todoInput.value = ""; //입력창 비우기
  }
}

addButton.addEventListener("click", addTodo);

function setDate() {
  const dateElement = document.getElementById("date");
  const today = new Date(); //현재 시간을 담은 객체 Date

  // 형식 변환
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }; //toLocaleDateString에 넘겨줄 객체
  const formattedDate = today.toLocaleDateString("ko-KR", options);

  dateElement.textContent = formattedDate;
}

setDate();

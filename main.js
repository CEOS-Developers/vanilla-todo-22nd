let todos = {}; // 할 일을 저장할 객체
let selectedDay = null; // 현재 선택된 날짜 저장

// localStorage에서 할 일 불러오는 함수
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// localStorage에 할 일 저장하는 함수
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


// 모달 내 할 일 목록 표시
function renderTodoList() {
    const todoListElement = document.getElementById('todoList');
    todoListElement.innerHTML = '';
    
    // 등록된 할 일이 없으면 "할 일이 없습니다" 메시지 표시
    if (!todos[selectedDay] || todos[selectedDay].length === 0) {
        todoListElement.innerHTML = '<p style="text-align: center; color: #666;">할 일이 없습니다.</p>';
        return;
    }
    
    // 할 일 목록 표시
    todos[selectedDay].forEach((todo, index) => {
        const todoItem = document.createElement('div');
        // 완료된 할 일 className에 'completed' 추가
        todoItem.className = `todoItem ${todo.completed ? 'completed' : ''}`;
        
        todoItem.innerHTML = `
            <div class="todoText">${todo.text}</div>
            <div class="todoActions">
                <button class="complete" onclick="toggleTodo(${selectedDay}, ${index})">
                    ${todo.completed ? '취소' : '완료'}
                </button>
                <button onclick="deleteTodo(${selectedDay}, ${index})">삭제</button>
            </div>
        `;
        
        todoListElement.appendChild(todoItem);
    });
}

// 할 일 완료/취소 토글
function toggleTodo(day, index) {
    todos[day][index].completed = !todos[day][index].completed;
    saveTodos();
    renderTodoList();
    showCalendar(); // 달력도 업데이트
}

// 할 일 삭제
function deleteTodo(day, index) {
    todos[day].splice(index, 1);
    if (todos[day].length === 0) {
        delete todos[day];
    }
    saveTodos();
    renderTodoList();
    showCalendar();
}


// 모달 열기 함수
function openModal(day) {
    selectedDay = day;
    document.getElementById('modalDate').textContent = day + '일';
    document.getElementById('todoInput').value = '';
    document.getElementById('todoModal').style.display = 'block';
    renderTodoList();
}

// 모달 닫기 함수
function closeModal() {
    document.getElementById('todoModal').style.display = 'none';
    selectedDay = null;
}

// 할 일 목록 보기 함수
function showTodoList(day) {
    if (!todos[day] || todos[day].length === 0) {
        alert(day + '일에는 할 일이 없습니다.');
        return;
    }
    
    let todoList = day + '일의 할 일 목록:\n\n';
    todos[day].forEach((todo, index) => {
        todoList += (index + 1) + '. ' + todo + '\n';
    });
    
    alert(todoList);
}


// 달력 표시 함수
function showCalendar() {
    const calendarDates = document.getElementById('calendarDates');
    
    // 기존 내용 지우고 다시 그리기
    calendarDates.innerHTML = '';

    // 오늘 날짜 가져오기
    const today = new Date();
    const currentDay = today.getDate(); // 오늘이 몇 일인지 저장

    // 날짜 표시 반복문
    for (let day = 1; day <= 30; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = day;

        // 오늘 날짜는 today 클래스 추가 -> 초록색 배경
        if (day === currentDay) {
            dateElement.className = 'date today';
        }

        // 할 일 있는 날짜면 hasTodos 클래스 추가 -> 노란색 배경
        if (todos[day] && todos[day].length > 0) {
            dateElement.className += ' hasTodos';
        }

        // 날짜 클릭 이벤트
        dateElement.addEventListener('click', function() {
            openModal(day);
        });

        calendarDates.appendChild(dateElement);
    }
}

// 모달 관련 이벤트 리스너 함수
function setupModalEvents() {
    // X 버튼 클릭시 모달 닫기
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // 모달 외부 클릭시 닫기
    document.getElementById('todoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // 할 일 추가 버튼
    document.getElementById('addTodoBtn').addEventListener('click', function() {

        const todoText = document.getElementById('todoInput').value.trim();

        if (todoText && selectedDay) {
            if (!todos[selectedDay]) {
                todos[selectedDay] = [];
            }
            todos[selectedDay].push({
                text: todoText,
                completed: false
            });
            saveTodos();
            document.getElementById('todoInput').value = '';
            renderTodoList();
            showCalendar();
        }
    });
    
    // 목록 보기 버튼
    document.getElementById('showTodoBtn').addEventListener('click', function() {
        if (selectedDay) {
            showTodoList(selectedDay);
        }
    });
    
    // Enter로 할 일 추가 가능하게
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('addTodoBtn').click();
        }
    });
}

// 페이지 시작할 때 실행
loadTodos();  // 저장된 할 일 불러오기
showCalendar(); // 달력 표시
setupModalEvents();
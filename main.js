let todos = {}; // 할 일을 저장할 객체
let selectedDay = null; // 현재 선택된 날짜 저장
let currentDate = new Date(); // 현재 표시할 년월을 저장

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
                <button class="complete" onclick="toggleTodo('${selectedDay}', ${index})">
                    ${todo.completed ? '취소' : '완료'}
                </button>
                <button onclick="deleteTodo('${selectedDay}', ${index})">삭제</button>
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
    showCalendar();
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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    selectedDay = `${year}-${month}-${day}`; // 년-월-일 형태로 저장

    document.getElementById('modalDate').textContent = `${year}년 ${month}월 ${day}일`;
    document.getElementById('todoInput').value = '';
    document.getElementById('todoModal').style.display = 'block';
    renderTodoList();
}

// 모달 닫기 함수
function closeModal() {
    document.getElementById('todoModal').style.display = 'none';
    selectedDay = null;
}
    
// 달력 표시 함수
function showCalendar() {
    const calendarDates = document.getElementById('calendarDates');
    
    // 기존 내용 지우고 다시 그리기
    calendarDates.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0부터 시작 (0=1월)
    
    // 달력 헤더 업데이트
    document.getElementById('currentMonth').textContent = 
        `${year}년 ${month + 1}월`;

    // 해당 월의 첫날과 마지막날
    const firstDay = new Date(year, month, 1).getDay(); // 첫날이 무슨 요일인지
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 총 일수

    // 이전 달의 마지막 날짜들 표시
    const prevMonth = new Date(year, month - 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateElement = createDateElement(prevMonth - i, year, month - 1, true);
        calendarDates.appendChild(dateElement);
    }

    // 현재 달의 날짜들 표시
    for (let day = 1; day <= daysInMonth; day++) {
        const dateElement = createDateElement(day, year, month, false);
        calendarDates.appendChild(dateElement);
    }

    // 다음 달의 첫 날짜들로 나머지 칸 채우기
    const remainingCells = 42 - (firstDay + daysInMonth); // 최대 6주 x 7일 = 42칸
    for (let day = 1; day <= remainingCells; day++) {
        const dateElement = createDateElement(day, year, month + 1, true);
        calendarDates.appendChild(dateElement);
    }
}

// 날짜 요소 생성 함수
function createDateElement(day, year, month, isOtherMonth) {
    const dateElement = document.createElement('div');
    dateElement.className = 'date';
    dateElement.textContent = day;

    if (isOtherMonth) {
        dateElement.classList.add('otherMonth');
    }

    // 오늘 날짜 확인 -> 초록색으로 표시
    const today = new Date();
    if (year === today.getFullYear() && 
        month === today.getMonth() && 
        day === today.getDate() && 
        !isOtherMonth) {
        dateElement.classList.add('today');
    }

    // 할 일이 있는 날짜 확인 -> 노란색으로 표시
    const dateKey = `${year}-${month + 1}-${day}`;
    if (todos[dateKey] && todos[dateKey].length > 0) {
        dateElement.classList.add('hasTodos');
    }

    // 날짜 클릭 시 모달 오픈
    if (!isOtherMonth) {
        dateElement.addEventListener('click', function() {
            openModal(day);
        });
    }

    return dateElement;
}

// 이전/다음 달 이동 함수들
function goToPrevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    showCalendar();
}

function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    showCalendar();
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
    
    // Enter로 할 일 추가 가능하게
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('addTodoBtn').click();
        }
    });

    // 달력 네비게이션 버튼
    document.getElementById('prevMonth').addEventListener('click', goToPrevMonth);
    document.getElementById('nextMonth').addEventListener('click', goToNextMonth);
}

// 페이지 시작할 때 실행
loadTodos();  // 저장된 할 일 불러오기
showCalendar(); // 달력 표시
setupModalEvents();
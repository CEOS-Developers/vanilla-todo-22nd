// 전역 변수
let todosByDate = {};
let currentDate = new Date();
let nextId = 1;

// 페이지 로드 완료 시 실행
window.addEventListener('load', function () {
  // 기존 데이터 삭제 (새 구조로 변경)
  localStorage.removeItem('todoList');

  initializeApp();
  this.getSelection;
});

// 앱 초기화
function initializeApp() {
  loadTodosFromStorage();
  updateDateDisplay();
  setupEventListeners();
  renderTodoList();
  updateProgress();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 이전 날짜 버튼
  const prevBtn = document.getElementById('prevDay');
  if (prevBtn) {
    prevBtn.onclick = function () {
      moveToDate(-1);
    };
  }

  // 다음 날짜 버튼
  const nextBtn = document.getElementById('nextDay');
  if (nextBtn) {
    nextBtn.onclick = function () {
      moveToDate(1);
    };
  }

  // 날짜 입력 필드
  const dateInput = document.getElementById('dateInput');
  if (dateInput) {
    dateInput.onchange = function () {
      selectDate(this.value);
    };
  }

  // 할일 추가 폼
  const todoForm = document.getElementById('todoForm');
  if (todoForm) {
    todoForm.onsubmit = function (e) {
      e.preventDefault();
      const input = document.getElementById('todoInput');
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = '';
      } else {
        alert('할일을 입력해주세요!');
      }
    };
  }
}

// 날짜 이동 (-1: 어제, 1: 내일)
function moveToDate(direction) {
  currentDate.setDate(currentDate.getDate() + direction);
  updateDateDisplay();
  renderTodoList();
  updateProgress();
}

// 특정 날짜 선택
function selectDate(dateString) {
  const newDate = new Date(dateString + 'T00:00:00');
  if (!isNaN(newDate.getTime())) {
    currentDate = newDate;
    updateDateDisplay();
    renderTodoList();
    updateProgress();
  }
}

// 현재 날짜 문자열 반환
function getCurrentDateString() {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜 표시 업데이트
function updateDateDisplay() {
  const dateInfo = document.getElementById('dateInfo');
  const dateInput = document.getElementById('dateInput');

  if (!dateInfo || !dateInput) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();

  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayName = days[currentDate.getDay()];

  const displayText = `${year}년 ${month}월 ${date}일 ${dayName}`;
  const dateValue = getCurrentDateString();

  dateInfo.textContent = displayText;
  dateInput.value = dateValue;
}

// 현재 날짜의 할일 목록 가져오기
function getCurrentTodoList() {
  const dateStr = getCurrentDateString();
  if (!todosByDate[dateStr]) {
    todosByDate[dateStr] = [];
  }
  return todosByDate[dateStr];
}

// 할일 추가
function addTodo(text) {
  const newTodo = {
    id: nextId++,
    text: text,
    completed: false,
    date: getCurrentDateString(),
  };

  const todos = getCurrentTodoList();
  todos.push(newTodo);

  saveTodosToStorage();
  renderTodoList();
  updateProgress();
}

// 할일 완료 토글
function toggleTodo(id) {
  const todos = getCurrentTodoList();
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToStorage();
    renderTodoList();
    updateProgress();
  }
}

// 할일 삭제
function deleteTodo(id) {
  const dateStr = getCurrentDateString();
  const todos = getCurrentTodoList();
  const filteredTodos = todos.filter((t) => t.id !== id);

  todosByDate[dateStr] = filteredTodos;

  saveTodosToStorage();
  renderTodoList();
  updateProgress();
}

// 할일 목록 렌더링
function renderTodoList() {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  if (!todoList) return;

  const todos = getCurrentTodoList();

  // 기존 목록 지우기
  todoList.innerHTML = '';

  if (todos.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // 할일 항목들 생성
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todoItem ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <label class="todoLabel">
        <input type="checkbox" class="todoCheckbox" ${
          todo.completed ? 'checked' : ''
        } 
               onchange="toggleTodo(${todo.id})">
        <span class="todoText">${todo.text}</span>
      </label>
      <button class="deleteBtn" onclick="deleteTodo(${todo.id})">🗑️</button>
    `;

    todoList.appendChild(li);
  });
}

// 진행상황 업데이트
function updateProgress() {
  const progressText = document.getElementById('progressText');

  if (!progressText) return;

  const todos = getCurrentTodoList();
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;

  const dateStr = getCurrentDateString();
  const today = new Date().toISOString().split('T')[0];
  const isToday = dateStr === today;
  const prefix = isToday ? '오늘' : dateStr;

  const text = `${prefix} 할일 ${totalCount}개 중 ${completedCount}개 완료`;
  progressText.textContent = text;
}

// 데이터 저장
function saveTodosToStorage() {
  try {
    localStorage.setItem('todosByDate', JSON.stringify(todosByDate));
    localStorage.setItem('nextId', nextId.toString());
  } catch (error) {
    console.error('저장 오류:', error);
  }
}

// 데이터 불러오기
function loadTodosFromStorage() {
  try {
    const saved = localStorage.getItem('todosByDate');
    const savedId = localStorage.getItem('nextId');

    if (saved) {
      todosByDate = JSON.parse(saved);
    }

    if (savedId) {
      nextId = parseInt(savedId);
    }
  } catch (error) {
    console.error('불러오기 오류:', error);
    todosByDate = {};
    nextId = 1;
  }
}

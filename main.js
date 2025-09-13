// 할 일을 저장할 객체
let todos = {};

// localStorage에서 할 일 불러오기
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// localStorage에 할 일 저장하기
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
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
            const todo = prompt(day + '일에 할 일을 입력하세요:');

            if (todo) {  // 입력한 내용이 있으면

                if (!todos[day]) {  // 해당 날짜에 할 일 배열이 없으면 생성
                    todos[day] = [];
                }

                todos[day].push(todo);  // 할 일 추가
                alert('할 일이 추가되었습니다!');
                
                // localStorage에 저장
                saveTodos();
                console.log('현재 할 일 목록:', todos);

                // 할 일 추가되면 달력 다시 그리기
                showCalendar();
            }
        });

        calendarDates.appendChild(dateElement);
    }
}

// 페이지 시작할 때 실행
loadTodos();  // 저장된 할 일 불러오기
showCalendar(); // 달력 표시
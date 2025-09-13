// 달력 표시 함수
function showCalendar() {
    const calendarDates = document.getElementById('calendarDates');
    
    // 날짜 표시 반복문
    for (let day = 1; day <= 30; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = day;
        calendarDates.appendChild(dateElement);
    }
}

showCalendar();
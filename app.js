// 날짜 상태
let selected = new Date();
selected.setHours(0, 0, 0, 0);

// DOM 참조
const pickDate = document.getElementById("pickDate");

const KDate = (d) =>
  //getMonth는 0부터 시작
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
function renderDate() {
  pickDate.textContent = KDate(selected);
}

renderDate();

// 이벤트
document.getElementById("prev").addEventListener("click", () => {
  selected.setDate(selected.getDate() - 1);
  renderDate();
});

document.getElementById("next").addEventListener("click", () => {
  selected.setDate(selected.getDate() + 1);
  renderDate();
});

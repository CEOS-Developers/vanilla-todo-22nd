// 저장소
const STORAGE_KEY = "vanilla_todo_step3";

/** @typedef {{ id:string, text:string, done:boolean }} Todo */
/** @type {Todo[]} */
let todos = [];

// DOM 캐싱
const prevBtn = document.getElementById("prevDay");
const nextBtn = document.getElementById("nextDay");
const calBtn = document.getElementById("openCalendar");
const todayEl = document.getElementById("todayLabel");

const form = document.getElementById("todoForm"); // 있을 수도, 없을 수도
const input = document.getElementById("todoInput");
const listEl = document.getElementById("todoList");

// 유틸
function todayKoreanLabel(d = new Date()) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}월 ${day}일`;
}

function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) todos = JSON.parse(raw) || [];
  } catch (e) {
    console.warn("load fail:", e);
  }
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.warn("save fail:", e);
  }
}

// 렌더
function render() {
  listEl.innerHTML = "";
  // 최신 추가가 아래로 쌓이게 순서 유지
  todos.forEach((t, idx) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (t.done ? " done" : "");
    li.dataset.index = String(idx);

    li.innerHTML = `
      <span class="title">${escapeHtml(t.text)}</span>
      <div class="actions">
        <label style="margin-right:8px;">
          <input type="checkbox" ${
            t.done ? "checked" : ""
          } data-action="toggle">
        </label>
        <button data-action="delete" aria-label="삭제">X</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

// 초기화
function init() {
  // 오늘 날짜 세팅
  if (todayEl) todayEl.textContent = todayKoreanLabel();

  load();
  render();

  // 추가: form이 있으면 submit로, 없으면 input의 Enter로
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addFromInput();
    });
  } else if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addFromInput();
    });
  }

  // 리스트 내부 상호작용(버블링)
  listEl.addEventListener("click", (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const li = target.closest(".todo-item");
    if (!li) return;

    const idx = Number(li.dataset.index);
    const action = target.dataset.action;

    if (action === "delete") {
      todos.splice(idx, 1);
      save();
      render();
      return;
    }
  });

  listEl.addEventListener("change", (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const li = target.closest(".todo-item");
    if (!li) return;

    const idx = Number(li.dataset.index);
    const action = target.dataset.action;

    if (action === "toggle") {
      todos[idx].done = !todos[idx].done;
      save();
      render();
      return;
    }
  });

  prevBtn?.addEventListener("click", () => {
    todayEl.textContent = todayKoreanLabel(new Date(Date.now() - 86400000));
  });
  nextBtn?.addEventListener("click", () => {
    todayEl.textContent = todayKoreanLabel(new Date(Date.now() + 86400000));
  });
  calBtn?.addEventListener("click", () => {
    alert("달력은 다음 단계에서 붙일게! 😊");
  });
}

function addFromInput() {
  const value = input?.value?.trim();
  if (!value) return;
  todos.push({ id: String(Date.now()), text: value, done: false });
  save();
  render();
  input.value = "";
  input.focus();
}

init();

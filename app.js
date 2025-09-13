// 날짜 상태
let selected = new Date();
selected.setHours(0, 0, 0, 0);

// DOM 참조
const pickDate = document.getElementById("pickDate");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const form = document.getElementById("formContainer");
const input = document.getElementById("todoInput");
const countLabel = document.getElementById("countLabel");
const listEl = document.getElementById("todoList");

const KDate = (d) =>
  //getMonth는 0부터 시작
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// localStorage
const STORAGE_KEY = "todo";

const loadAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};
const saveAll = (obj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    if (e && e.name === "QuotaExceededError") {
      alert("저장 공간이 가득 찼어요");
    } else {
      console.error(e);
    }
  }
};
const getList = (key) => loadAll()[key] || [];
const setList = (key, list) => {
  const all = loadAll();
  all[key] = list;
  saveAll(all);
};

// render

function renderDate() {
  pickDate.textContent = KDate(selected);
}

function renderCount(list) {
  countLabel.textContent = `${list.length}개`;
}

function renderList() {
  const key = toKey(selected);
  const list = getList(key);

  renderCount(list);

  listEl.innerHTML = "";

  list.forEach((t, idx) => {
    const li = document.createElement("li");
    li.className = "todo" + (t.done ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!t.done;

    const label = document.createElement("label");
    label.textContent = t.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "삭제";

    // 체크 표시
    cb.addEventListener("change", () => {
      const arr = getList(key);
      arr[idx].done = cb.checked;
      setList(key, arr);
      renderList();
    });

    // 삭제
    del.addEventListener("click", () => {
      const arr = getList(key);
      arr.splice(idx, 1); // idx번째 요소 1개 삭제
      setList(key, arr);
      renderList();
    });

    li.append(cb, label, del); // 요소들을 추가해서
    listEl.appendChild(li); //listEl에 붙이기
  });
}

// 초기 렌더
renderDate();
renderList();

// 이벤트
document.getElementById("prev").addEventListener("click", () => {
  selected.setDate(selected.getDate() - 1);
  renderDate();
  renderList();
});

document.getElementById("next").addEventListener("click", () => {
  selected.setDate(selected.getDate() + 1);
  renderDate();
  renderList();
});

//저장
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const key = toKey(selected);
  const arr = getList(key);
  arr.push({ id: Date.now(), text, done: false });
  setList(key, arr);

  input.value = "";
  renderList();
});

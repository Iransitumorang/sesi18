/**
 * To-Do List App
 * - LocalStorage persistence
 * - Filter: All / Active / Done
 * - Priority: Low / Medium / High
 * - Stats counter
 */

const STORAGE_KEY = 'mytasks_v1';

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';

// ── DOM refs ──
const input        = document.getElementById('todo-input');
const prioritySel  = document.getElementById('priority-select');
const addBtn       = document.getElementById('add-btn');
const list         = document.getElementById('todo-list');
const emptyState   = document.getElementById('empty-state');
const clearDoneBtn = document.getElementById('clear-done-btn');
const statTotal    = document.getElementById('stat-total');
const statActive   = document.getElementById('stat-active');
const statDone     = document.getElementById('stat-done');

// ── Utils ──
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Stats ──
function updateStats() {
  const total  = todos.length;
  const done   = todos.filter(t => t.done).length;
  const active = total - done;

  statTotal.textContent  = total;
  statActive.textContent = active;
  statDone.textContent   = done;
}

// ── Render ──
function getFiltered() {
  if (currentFilter === 'active') return todos.filter(t => !t.done);
  if (currentFilter === 'done')   return todos.filter(t => t.done);
  return todos;
}

function render() {
  const filtered = getFiltered();
  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach(todo => list.appendChild(createItem(todo)));
  }

  updateStats();
}

function createItem(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.done ? ' done' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <button class="check-btn" aria-label="Toggle selesai">${todo.done ? '✓' : ''}</button>
    <span class="priority-dot ${todo.priority}"></span>
    <span class="todo-text">${sanitize(todo.text)}</span>
    <button class="delete-btn" aria-label="Hapus task">✕</button>
  `;

  li.querySelector('.check-btn').addEventListener('click', () => toggleDone(todo.id));
  li.querySelector('.delete-btn').addEventListener('click', () => deleteItem(li, todo.id));

  return li;
}

// ── Actions ──
function addTodo() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    return;
  }

  todos.unshift({
    id: generateId(),
    text,
    priority: prioritySel.value,
    done: false,
    createdAt: Date.now(),
  });

  save();
  render();
  input.value = '';
  input.focus();
}

function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteItem(li, id) {
  li.classList.add('removing');
  li.addEventListener('animationend', () => {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }, { once: true });
}

function clearDone() {
  const doneItems = list.querySelectorAll('.todo-item.done');
  if (doneItems.length === 0) return;

  doneItems.forEach(li => li.classList.add('removing'));

  setTimeout(() => {
    todos = todos.filter(t => !t.done);
    save();
    render();
  }, 280);
}

// ── Events ──
addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearDoneBtn.addEventListener('click', clearDone);

// ── Init ──
render();

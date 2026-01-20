loadState();

/*-- Navigation --*/
window.addEventListener('hashchange', () => {
  showPage(location.hash.replace('#','') || 'dashboard');
});
showPage('dashboard');

/*-- Dashboard --*/
function renderDashboard() {
  const completed = state.tasks.filter(t => t.completed).length;
  const total = state.tasks.length || 1;

  document.getElementById('dashboard').innerHTML = `
    <h2>Dashboard</h2>
    <div class="cards">
      <div class="card">Tasks: ${total}</div>
      <div class="card">Completed: ${completed}</div>
      <div class="card">Progress: ${Math.round(completed/total*100)}%</div>
    </div>`;
}

/*-- Tasks --*/
let editingTaskId = null;

function renderTasks() {
  const container = document.getElementById('tasks');
  container.innerHTML = `
    <h2>Tasks</h2>
    <form id="taskForm">
      <input required placeholder="Title" id="title" />
      <input type="date" required id="dueDate" />
      <select id="priority">
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <button>${editingTaskId ? 'Save' : 'Add'}</button>
    </form>
    <ul class="list">${state.tasks.map(t => `
      <li>
        <span class="${t.completed?'done':''}">${t.title} - ${t.dueDate}</span>
        <button onclick="toggleTask(${t.id})">✔</button>
        <button onclick="editTask(${t.id})">✎</button>
        <button onclick="deleteTask(${t.id})">🗑</button>
      </li>`).join('')}
    </ul>`;

  document.getElementById('taskForm').onsubmit = e => {
    e.preventDefault();
    const task = {
      id: editingTaskId || Date.now(),
      title: title.value,
      dueDate: dueDate.value,
      priority: priority.value,
      completed: false
    };

    if (editingTaskId)
      state.tasks = state.tasks.map(t => t.id===editingTaskId?task:t);
    else state.tasks.push(task);

    editingTaskId = null;
    saveState();
    renderTasks(); renderDashboard();
  };
}

function toggleTask(id){
  const t = state.tasks.find(t=>t.id===id);
  t.completed=!t.completed; saveState(); renderTasks(); renderDashboard();
}
function editTask(id){
  const t = state.tasks.find(t=>t.id===id);
  title.value=t.title; dueDate.value=t.dueDate; priority.value=t.priority;
  editingTaskId=id;
}
function deleteTask(id){
  if(confirm('Delete?')){
    state.tasks=state.tasks.filter(t=>t.id!==id);
    saveState(); renderTasks(); renderDashboard();
  }
}

/*-- Habits --*/
function renderHabits(){
  const el=document.getElementById('habits');
  el.innerHTML=`<h2>Habits</h2>
  <form id="habitForm"><input required placeholder="Habit" id="hName"><button>Add</button></form>
  ${state.habits.map((h,i)=>`
    <div class="card">${h.name}
    ${h.progress.map((d,idx)=>`<input type="checkbox" ${d?'checked':''} onchange="toggleHabit(${i},${idx})">`).join('')}
    </div>`).join('')}`;

  habitForm.onsubmit=e=>{
    e.preventDefault();
    state.habits.push({name:hName.value,progress:[false,false,false,false,false,false,false]});
    saveState(); renderHabits();
  }
}
function toggleHabit(h,i){state.habits[h].progress[i]=!state.habits[h].progress[i];saveState();}

/*-- Resources --*/
async function renderResources(){
  const el=document.getElementById('resources');
  el.innerHTML='Loading...';
  try{
    const res=await fetch('resources.json');
    const data=await res.json();
    el.innerHTML=data.map(r=>`
      <div class="card">${r.title}
      <button onclick="fav(${r.id})">★</button></div>`).join('');
  }catch{el.innerHTML='Error loading';}
}
function fav(id){
  state.favorites.includes(id)?state.favorites=state.favorites.filter(f=>f!==id):state.favorites.push(id);
  saveState();
}

/*-- Settings --*/
function renderSettings(){
  document.getElementById('settings').innerHTML=`
    <h2>Settings</h2>
    <button onclick="toggleTheme()">Toggle Theme</button>
    <button onclick="resetData()">Reset Data</button>`;
}
function toggleMenu(){
  document.querySelector('.nav-menu').classList.toggle('show');
}

function toggleTheme(){
  document.body.classList.toggle('dark');
  state.settings.theme=document.body.classList.contains('dark')?'dark':'light';
  saveState();
}

/* ---------- Initial Render ---------- */
renderDashboard(); renderTasks(); renderHabits(); renderResources(); renderSettings();
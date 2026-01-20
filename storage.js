function saveState() {
    localStorage.setItem('studybuddy', JSON.stringify(state));
  }
  
  function loadState() {
    const data = localStorage.getItem('studybuddy');
    if (data) Object.assign(state, JSON.parse(data));
  }
  
  function resetData() {
    if (confirm('Are you sure?')) {
      localStorage.removeItem('studybuddy');
      location.reload();
    }
  }
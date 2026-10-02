async function load() {
  const stats = await fetch('/api/stats').then(r => r.json());

  document.getElementById('att').innerText = stats.totalAttendees;
  document.getElementById('sess').innerText = stats.totalSessions;
  document.getElementById('avg').innerText = stats.avgRating;

  const sessionData = await fetch('/api/session-analytics').then(r => r.json());

  new Chart(document.getElementById('chart'), {
    type: 'bar',
    data: {
      labels: sessionData.map(d => d._id),
      datasets: [{
        label: 'Avg Rating',
        data: sessionData.map(d => d.avg)
      }]
    }
  });
}

load();
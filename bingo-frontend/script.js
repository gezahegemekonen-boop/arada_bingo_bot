async function playBingo() {
  const userId = '123456'; // You can replace this with dynamic user ID later

  try {
    const response = await fetch('https://arada-bingo-bot.onrender.com/api/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    renderCard(data.card);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to start game. Please try again.');
  }
}

function renderCard(card) {
  const container = document.getElementById('bingo-card');
  container.innerHTML = ''; // Clear previous card

  card.forEach(row => {
    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'bingo-cell';
      cellDiv.textContent = cell;

      if (cell === 'FREE') {
        cellDiv.classList.add('free');
      }

      container.appendChild(cellDiv);
    });
  });
}

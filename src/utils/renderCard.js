import { createCanvas } from 'canvas';

export function renderCard(cardData) {
  const canvasSize = 300;
  const cellSize = canvasSize / 5;
  const canvas = createCanvas(canvasSize, canvasSize + 40); // Extra space for headers
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = '#000000';
  for (let i = 0; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 40);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 40 + i * cellSize);
    ctx.lineTo(canvas.width, 40 + i * cellSize);
    ctx.stroke();
  }

  // Column headers: B I N G O
  const headers = ['B', 'I', 'N', 'G', 'O'];
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px Arial';
  headers.forEach((letter, i) => {
    ctx.fillText(letter, i * cellSize + cellSize / 2 - 6, 30);
  });

  // Numbers
  ctx.font = '18px Arial';
  cardData.forEach((num, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = col * cellSize + cellSize / 2 - 10;
    const y = 40 + row * cellSize + cellSize / 2 + 6;

    const text = num === 0 ? '★' : num.toString(); // Free space as star
    ctx.fillText(text, x, y);
  });

  return canvas.toBuffer('image/png');
}

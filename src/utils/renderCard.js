const { createCanvas } = require('canvas');

function renderCard(cardData) {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 300, 300);

  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  cardData.forEach((num, i) => {
    ctx.fillText(num, 50 + (i % 5) * 40, 50 + Math.floor(i / 5) * 40);
  });

  return canvas.toBuffer('image/png');
}

module.exports = renderCard;

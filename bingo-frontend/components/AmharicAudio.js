// components/AmharicAudio.js
export function playAmharicAudio(type) {
  const audio = new Audio();
  if (type === 'win') {
    audio.src = 'assets/sounds/win.mp3';
  } else if (type === 'lose') {
    audio.src = 'assets/sounds/lose.mp3';
  }
  audio.play();
}


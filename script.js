/************************************************
 * script.js - "Sax Hero" with fixed keys in HTML/CSS
 * The canvas only draws scrolling notes
 ***********************************************/

// 1) References to DOM elements
const songDataInput = document.getElementById('songData');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const speedUpButton = document.getElementById('speedUpButton');
const slowDownButton = document.getElementById('slowDownButton');
const rewindButton = document.getElementById('rewindButton');

// We'll declare `songData` so we can reassign it each time "Play" is clicked
let songData = [];

// 2) Parse the song data: "note noteBeats restBeats"
function parseSongData(data) {
  const lines = data.split('\n');
  const song = [];

  let cumulativeTime = 0; // tracks note start times in "beats" (1 beat = 1s at speed=1)

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue;
    }

    const parts = trimmedLine.split(' ');
    if (parts.length !== 3) {
      console.warn('Invalid song data line (must have 3 parts):', line);
      continue;
    }

    const note = parts[0].trim();
    const noteBeats = parseFloat(parts[1]);
    const restBeats = parseFloat(parts[2]);

    if (isNaN(noteBeats) || isNaN(restBeats)) {
      console.warn('Invalid beats or rest in line:', line);
      continue;
    }

    song.push({
      note,
      duration: noteBeats,      // how many beats the note lasts
      rest: restBeats,          // how many beats rest after
      startTime: cumulativeTime // in "song beats"
    });

    // Advance the cumulativeTime by note + rest
    cumulativeTime += (noteBeats + restBeats);
  }

  return song;
}

// 3) Animation variables
let animationFrameId;
let startTime = null;
let currentTime = 0;
let playbackSpeed = 1;
let isPaused = true;

// 4) Note-to-key mapping (for which keys are "depressed" for each note)
const noteToKeyIndex = {
  'D4': [2, 3, 4, 5, 6, 7],
  'E4': [2, 3, 4, 5, 6],
  'F4': [2, 3, 4, 5],
  'G4': [2, 3, 4],
  'A4': [2, 3],
  'B4': [2],
  'C4': [3],
  'D5': [1, 2, 3, 4, 5, 6, 7],
  'E5': [1, 2, 3, 4, 5, 6],
  'F5': [1, 2, 3, 4, 5],
  'G5': [1, 2, 3, 4],
  'A5': [1, 2, 3],
  'B5': [1, 2],
  'C5': [1, 3]
  // Add more as needed
};

// 5) Draw a single note across the depressed keys
function drawNote(noteObject, x) {
  const depressedKeys = noteToKeyIndex[noteObject.note];
  if (!depressedKeys) {
    return; // if no mapping, skip
  }

  // Must match .sax-key in CSS
  const keyHeight = 60;
  const keySpacing = 10;
  const startY = 50; // aligns with .sax-key:first-child { margin-top: 50px; }

  // 1 beat = pxPerBeat pixels wide
  const pxPerBeat = 60;
  const noteWidth = noteObject.duration * pxPerBeat;

  // Draw the rectangle for each depressed key
  depressedKeys.forEach((keyNumber) => {
    // keyNumber is 1-based, convert to 0-based
    const idx = keyNumber - 1;
    const keyY = startY + idx * (keyHeight + keySpacing);

    // Filled rectangle
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.fillRect(x, keyY, noteWidth, keyHeight);

    // 1px black border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, keyY, noteWidth, keyHeight);
  });
}

// 6) Draw all notes in a scrolling style
function drawNotes() {
  const pxPerBeat = 60;
  
  for (let i = 0; i < songData.length; i++) {
    const noteObj = songData[i];
    const timeSinceNoteStart = currentTime - noteObj.startTime; 
    // Each "beat" is 1 second at playbackSpeed=1
    // x offset from right:
    const noteX = canvas.width - (timeSinceNoteStart * pxPerBeat * playbackSpeed);

    const noteWidth = noteObj.duration * pxPerBeat;
    // Skip if it’s off the left
    if ((noteX + noteWidth) < 0) {
      continue;
    }

    drawNote(noteObj, noteX);
  }
}

// 7) Main animation loop
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const progress = timestamp - startTime;
  // Convert ms to seconds => used as "beats" at speed=1
  currentTime = progress / 1000;  

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // We do NOT draw sax keys on the canvas anymore. They are in HTML/CSS.
  // Just draw the scrolling notes:
  drawNotes();

  // Loop
  animationFrameId = requestAnimationFrame(animate);
}

// 8) Playback controls
function startAnimation() {
  // Parse the latest data from the textarea
  songData = parseSongData(songDataInput.value);
  console.log("Re-parsed songData:", songData);

  // Reset the timeline
  startTime = null;
  currentTime = 0;
  isPaused = false;

  animationFrameId = requestAnimationFrame(animate);
}

function stopAnimation() {
  isPaused = true;
  cancelAnimationFrame(animationFrameId);
}

// Button events
playButton.addEventListener('click', () => {
  console.log("Play button clicked!");
  startAnimation();
});
pauseButton.addEventListener('click', () => {
  console.log("Pause button clicked!");
  stopAnimation();
});
speedUpButton.addEventListener('click', () => {
  playbackSpeed += 0.5;
  console.log("Speed Up → playbackSpeed =", playbackSpeed);
});
slowDownButton.addEventListener('click', () => {
  playbackSpeed = Math.max(0.1, playbackSpeed - 0.5);
  console.log("Slow Down → playbackSpeed =", playbackSpeed);
});
rewindButton.addEventListener('click', () => {
  currentTime = 0;
  console.log("Rewind → currentTime reset to 0");
});

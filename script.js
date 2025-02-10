 // Get references to the HTML elements
 const songDataInput = document.getElementById('songData');
 const canvas = document.getElementById('myCanvas');
 const ctx = canvas.getContext('2d'); // Get the 2D rendering context
 
 const playButton = document.getElementById('playButton');
 const pauseButton = document.getElementById('pauseButton');
 const speedUpButton = document.getElementById('speedUpButton');
 const slowDownButton = document.getElementById('slowDownButton');
 const rewindButton = document.getElementById('rewindButton');
 
 // Function to parse the song data from the textarea
 function parseSongData(data) {
     const lines = data.split('\n'); // Split the data into lines
     const song = [];
 
     for (const line of lines) {
         const trimmedLine = line.trim(); // Remove leading/trailing whitespace
         if (trimmedLine === '' || trimmedLine.startsWith('#')) {
             continue; // Skip empty lines and comments
         }
 
         const parts = trimmedLine.split(' '); // Split the line into note and duration
         if (parts.length !== 2) {
             console.warn('Invalid song data line:', line);
             continue; // Skip invalid lines
         }
 
         const note = parts[0].trim();
         const duration = parseFloat(parts[1]); // Convert duration to a number
 
         if (isNaN(duration)) {
             console.warn('Invalid duration:', parts[1]);
             continue; // Skip lines with invalid durations
         }
 
         song.push({ note, duration });
     }
 
     return song;
 }
 
 // Example usage: Parse the song data when the page loads
 const songData = parseSongData(songDataInput.value);
 console.log('Parsed song data:', songData);
 
 // Function to draw the saxophone keys on the canvas
 function drawSaxophoneKeys() {
     const keyCount = 7; // Number of saxophone keys
     const keyWidth = 50;
     const keyHeight = 60;
     const keySpacing = 10;
     const startX = 50;
     const startY = 50;
 
     const keyNames = ["T1", "2", "3", "4", "5", "6", "7"];
 
     for (let i = 0; i < keyCount; i++) {
         const keyX = startX;
         const keyY = startY + i * (keyHeight + keySpacing);
 
         // Draw the key rectangle
         ctx.fillStyle = '#ddd'; // Light gray color
         ctx.fillRect(keyX, keyY, keyWidth, keyHeight);
 
         // Draw the key number
         ctx.fillStyle = 'black';
         ctx.font = '16px sans-serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText(keyNames[i], keyX + keyWidth / 2, keyY + keyHeight / 2);
     }
 }
 
 // Call the function to draw the saxophone keys when the page loads
 drawSaxophoneKeys();
 
 // Animation variables
 let animationFrameId;
 let startTime = null;
 let currentTime = 0;
 let playbackSpeed = 1;
 let isPaused = true;
 
 // Function to draw a single note
 const noteToKeyIndex = {
     'D4': [2 , 3, 4, 5, 6, 7],
     'E4': [2 , 3, 4, 5, 6],
     'F4': [2 , 3, 4, 5],
     'G4': [2 , 3, 4],
     'A4': [2, 3],
     'B4': [2],
     'C4': [3],
     'D5': [1, 2 , 3, 4, 5, 6, 7],
     'E5': [1, 2 , 3, 4, 5, 6],
     'F5': [1, 2 , 3, 4, 5],
     'G5': [1, 2 , 3, 4],
     'A5': [1, 2, 3],
     'B5': [1, 2],
     'C5': [1, 3]
     // Add more mappings as needed
 };
 
 function drawNote(noteIndex, x) {
     const keyCount = 8; // Number of saxophone keys
     const keyWidth = 50;
     const keyHeight = 60;
     const keySpacing = 10;
     const startX = 50;
     const startY = 50;
 
     // In this example, let's assume that the note corresponds to the key number
     // For example, C4 corresponds to key 1, D4 corresponds to key 2, etc.
     // You'll need to map the notes to the correct key indices
 
     const keyIndex = noteIndex - 1; // Adjust for 0-based indexing
 
     if (keyIndex >= 0 && keyIndex < keyCount) {
         const keyY = startY + keyIndex * (keyHeight + keySpacing);
 
         ctx.fillStyle = 'blue'; // Example color for the note
         ctx.fillRect(x, keyY, 30, keyHeight); // Draw a rectangle for the note
     }
 }
 
 // Function to draw the notes
 function drawNotes() {
     const noteXStart = canvas.width; // Starting X position of notes
     const noteSpeed = 100; // Pixels per second
     const timeOffset = 1; // Arbitrary offset for visual timing
 
     for (let i = 0; i < songData.length; i++) {
         const note = songData[i];
 
         // Calculate the x position of the note based on time
         const noteX = noteXStart - (currentTime - timeOffset) * noteSpeed * playbackSpeed;
 
         drawNote(i, noteX);
     }
 }
 
 // Animation loop function
 function animate(timestamp) {
     console.log("Animate called");
     if (!startTime) startTime = timestamp;
     console.log("startTime:", startTime);
     const progress = timestamp - startTime;
     console.log("progress:", progress, "currentTime:", currentTime); // Check if time is running
     currentTime = progress / 1000;  // Convert milliseconds to seconds
 
     // Clear the canvas
     ctx.clearRect(0, 0, canvas.width, canvas.height);
 
     // Redraw the saxophone keys
     drawSaxophoneKeys();
 
     // Draw the notes
     drawNotes();
 
     // Request the next frame of the animation
     animationFrameId = requestAnimationFrame(animate);
 }
 
 // Function to start the animation
 function startAnimation() {
     startTime = null;
     isPaused = false;
     animationFrameId = requestAnimationFrame(animate);
 }
 
 // Function to stop the animation
 function stopAnimation() {
     isPaused = true;
     cancelAnimationFrame(animationFrameId);
 }
 
 // Attach event listeners to the play and pause buttons
 // Attach event listeners to the play and pause buttons
 playButton.addEventListener('click', () => {
     console.log("Play button clicked!"); // Add this line
     startAnimation();
 });
 pauseButton.addEventListener('click', () => {
     console.log("Pause button clicked!"); // Add this line
     stopAnimation();
 });
 
 // Start the animation when the page loads (you might want to remove this for actual use)
 startAnimation();
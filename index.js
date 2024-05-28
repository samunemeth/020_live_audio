// Importing
const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');

const FFPLAY_COMMAND = "ffplay -v 0 -nodisp -autoexit"

// Initialization
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// On new socket connection
io.on('connection', (socket) => {
    console.log('> Client connected.');

    // Getting a new audio file
    socket.on('audio-file', (audioBlob) => {

        // Get current time for the file name
        const current_file_name = Date.now();

        // Get data and save it to a file
        fs.writeFileSync(`./received/${current_file_name}.wav`, audioBlob);

        console.log('> Audio data received and saved.');

        // Play the file with ffplay
        exec(`${FFPLAY_COMMAND} ./received/${current_file_name}.wav`, () => {});

        console.log('> Audio started playing.')

    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('> Client disconnected.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));

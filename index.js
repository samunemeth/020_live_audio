// Importing
const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialization
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// On new socket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Getting a new audio file
    socket.on('audio-file', (audioBlob) => {

        console.log('Audio data received...')

        // Get data and save it to a file
        fs.writeFileSync(`./received/${Date.now()}.wav`, audioBlob);

        console.log('Audio data saved!')
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

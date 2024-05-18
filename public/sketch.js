// Getting DOM elements
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const replayButton = document.getElementById('replay');
const deleteButton = document.getElementById('delete');
const sendButton = document.getElementById('send');

const statusText = document.getElementById('status');

// Create global variables
let recordAudio;
let currentAudioBlob;

// Visual adjustment
function resetButtons() {
    startButton.disabled = false;
    stopButton.disabled = true;
    replayButton.disabled = true;
    deleteButton.disabled = true;
    sendButton.disabled = true;
}
resetButtons();


/*
    HANDLE SOCKET CONNECTION
*/

socket.on('connect', () => {
    statusText.innerText = 'Connected';
});

socket.on('disconnect', () => {
    statusText.innerText = 'Disconnected';
});


/* 
    HANDLE BUTTON CLICKS
*/


startButton.addEventListener('click', () => {

    // Visual adjustment
    startButton.disabled = true;

    // Start the audio recording
    navigator.getUserMedia({ audio: true }, (stream) => {

        // TODO: What is exactly going on here? Figure out the correct starting parameters!
        recordAudio = RecordRTC(stream, {
            type: 'audio',
            sampleRate: 44100,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1
        });
        recordAudio.startRecording();

        // Visual adjustment
        stopButton.disabled = false;

    }, (error) => {
        console.error(JSON.stringify(error));
    });
}, false);

stopButton.addEventListener('click', () => {

    // Visual adjustment
    stopButton.disabled = true;

    // Stop the audio recording
    recordAudio.stopRecording(() => {
        currentAudioBlob = recordAudio.getBlob();

        // Visual adjustment
        replayButton.disabled = false;
        deleteButton.disabled = false;
        sendButton.disabled = false;
    });
}, false);

replayButton.addEventListener('click', () => {

    // Visual adjustment
    replayButton.disabled = true;
    deleteButton.disabled = true;
    sendButton.disabled = true;

    // Create audio player
    let audioPlayer = new Audio();
    let AudioURL = URL.createObjectURL(currentAudioBlob);
    audioPlayer.src = AudioURL;

    // Start the playback
    audioPlayer.play();

    // Free memory when finished
    audioPlayer.onended = () => {

        // Visual adjustment
        replayButton.disabled = false;
        deleteButton.disabled = false;
        sendButton.disabled = false;

        URL.revokeObjectURL(AudioURL);
        audioPlayer.remove();
    };
}, false);

deleteButton.addEventListener('click', () => {

    // Delete the recorded audio
    currentAudioBlob = undefined;

    // Visual adjustment
    resetButtons();
}, false);

sendButton.addEventListener('click', () => {

    // Send audio to the server
    socket.emit('audio-file', currentAudioBlob);
    currentAudioBlob = undefined;

    // Visual adjustment
    resetButtons();
}, false);

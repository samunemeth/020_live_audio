// Getting DOM elements
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const deleteButton = document.getElementById('delete');
const sendButton = document.getElementById('send');

// Create global variables
let recordAudio;
let currentAudioBlob;

// Visual adjustment
function resetButtons() {
    startButton.disabled = false;
    stopButton.disabled = true;
    playButton.disabled = true;
    deleteButton.disabled = true;
    sendButton.disabled = true;
}
resetButtons();

// When the start button is clicked
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

// When the stop button is clicked
stopButton.addEventListener('click', () => {

    // Visual adjustment
    stopButton.disabled = true;

    // Stop the audio recording
    recordAudio.stopRecording(() => {
        currentAudioBlob = recordAudio.getBlob();

        // Visual adjustment
        playButton.disabled = false;
        deleteButton.disabled = false;
        sendButton.disabled = false;
    });
}, false);

playButton.addEventListener('click', () => {

    // Visual adjustment
    playButton.disabled = true;
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
        playButton.disabled = false;
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

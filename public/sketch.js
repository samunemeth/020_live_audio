// Getting DOM elements
const startRecording = document.getElementById('start-recording');
const stopRecording = document.getElementById('stop-recording');

let recordAudio;

// Visual adjustment
startRecording.disabled = false;

// When the start button is clicked
startRecording.onclick = function () {

    // Visual adjustment
    startRecording.disabled = true;

    // Start the audio recording
    navigator.getUserMedia({
        audio: true
    }, function (stream) {
        recordAudio = RecordRTC(stream, {
            type: 'audio',
            sampleRate: 44100,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1
        });
        recordAudio.startRecording();

        // Visual adjustment
        stopRecording.disabled = false;

    }, function (error) {
        console.error(JSON.stringify(error));
    });
};

// When the stop button is clicked
stopRecording.onclick = function () {

    // Visual adjustment
    startRecording.disabled = false;
    stopRecording.disabled = true;

    // Stop the audio recording
    recordAudio.stopRecording(() => {
        recordAudio.getDataURL(() => {
            const audioBlob = recordAudio.getBlob();
            const data = {
                blob: audioBlob,
                type: audioBlob.type || 'audio/wav'
            };
            socket.emit('audio-file', data);
        });
    });
};
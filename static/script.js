const form = document.querySelector('form');
const fileInput = document.getElementById('file-input');
const fileNameSpan = document.getElementById('file-name');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileNameSpan.textContent = e.target.files[0].name;
    } else {
        fileNameSpan.textContent = '';
    }
});

form.onsubmit = async (e) => {
    e.preventDefault();
    const transcribeButton = document.querySelector('button[type="submit"]');
    transcribeButton.disabled = true;
    const messageElement = document.getElementById('message');
    messageElement.style.display = 'block';
    messageElement.innerText = 'Processing...';

    const formData = new FormData(form);
    try {
        const response = await fetch('https://lysoai.com/v1/audio/transcriptions', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const result = await response.json();
            messageElement.innerText = result.message;
            if (result.filepath) {
                const br = document.createElement('br');
                messageElement.appendChild(br);
                const downloadLink = document.createElement('a');
                downloadLink.href = result.filepath;
                downloadLink.download = '';
                downloadLink.innerText = 'Download Transcription';
                downloadLink.className = 'download-link';
                messageElement.appendChild(downloadLink);
            }
        } else {
            messageElement.innerText = 'Failed to process the request';
        }
    } catch (error) {
        messageElement.innerText = 'Network or server error';
    } finally {
        transcribeButton.disabled = false;
    }
};
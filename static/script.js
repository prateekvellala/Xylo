const form = document.querySelector('form');
form.onsubmit = async (e) => {
    e.preventDefault();
    const transcribeButton = document.querySelector('button[type="submit"]');
    transcribeButton.disabled = true;
    document.getElementById('message').innerText = 'Processing...';

    const formData = new FormData(form);
    try {
        const response = await fetch('https://lysoai.com/v1/audio/transcriptions', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const result = await response.json();
            document.getElementById('message').innerText = result.message;
            if (result.filepath) {
                const br = document.createElement('br');
                document.getElementById('message').appendChild(br);
                const downloadLink = document.createElement('a');
                downloadLink.href = result.filepath;
                downloadLink.download = '';
                downloadLink.innerText = 'Download transcription';
                document.getElementById('message').appendChild(downloadLink);
            }
        } else {
            const errorText = await response.text();
            document.getElementById('message').innerText = 'Failed to process the request';
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Network or server error';
    } finally {
        transcribeButton.disabled = false;
    }
};
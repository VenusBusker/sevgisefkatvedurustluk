pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

async function initReader() {
    const statusEl = document.getElementById('status');
    const container = document.getElementById('pages-container');

    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    if (!storyId) {
        statusEl.innerText = 'Öykü bulunamadı.';
        return;
    }

    try {
        const response = await fetch('oykuler.json');
        const stories = await response.json();
        const story = stories.find(s => s.id === storyId);

        if (!story || !story.pdf) {
            statusEl.innerText = 'Öykü dosyası tanımlanmamış.';
            return;
        }

        document.title = `${story.baslik} - Okuyucu`;

        const pdf = await pdfjsLib.getDocument(story.pdf).promise;
        statusEl.style.display = 'none';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.5 });

            const canvas = document.createElement('canvas');
            canvas.className = 'page-canvas';
            const ctx = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            container.appendChild(canvas);
        }

    } catch (error) {
        console.error(error);
        statusEl.innerText = 'Öykü yüklenirken bir sorun oluştu.';
    }
}

document.addEventListener('DOMContentLoaded', initReader);

chrome.action.onClicked.addListener((activeTab) => {
    chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: removeDisablePictureInPictureTags,
    });
    chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: enablePiP,
    });
});

function removeDisablePictureInPictureTags() {
    document.querySelectorAll('video').forEach(video => {
        video.removeAttribute('disablePictureInPicture');
    });
}

function enablePiP() {
    const videoElement = [...document.querySelectorAll('video')]
        .filter(video => video.readyState && !video.disablePictureInPicture)
        .sort((video1, video2) => {
            const [video1Area, video2Area] = [video1, video2].map(video => {
                const { width = 0, height = 0 } = video.getClientRects()[0] || {};
                return width * height;
            });
            return video2Area - video1Area;
        })[0] ?? undefined;

    if (videoElement) {
        videoElement.requestPictureInPicture().catch((err) => {
            console.error('Could not start PictureInPicture:', err);
        });
    } else {
        console.log('No video element found on the page.');
    }
}
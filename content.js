function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function replaceYoutubePlayer() {
    const videoId = getUrlParameter('v');

    if (!videoId) {
        console.error('לא נמצא פרמטר "v" בכתובת האתר');
        return;
    }

    const playerElement = document.querySelector('ytd-player, #container.ytd-player');

    if (!playerElement) {
        console.error('לא נמצא אלמנט הנגן');
        return;
    }

    function checkPlayerReady() {
        const hasContent = playerElement.querySelector('video') ||
            playerElement.querySelector('.html5-video-container') ||
            playerElement.offsetHeight > 100;

        const isVisible = playerElement.offsetWidth > 0 &&
            playerElement.offsetHeight > 0 &&
            window.getComputedStyle(playerElement).display !== 'none';

        return hasContent && isVisible;
    }

    function performReplacement() {
        if (!document.contains(playerElement)) {
            console.error('אלמנט הנגן הוסר מהדף');
            return;
        }

        const rect = playerElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(playerElement);

        const iframe = document.createElement('iframe');

        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1`;

        iframe.style.width = `${rect.width}px`;
        iframe.style.height = `${rect.height}px`;
        iframe.style.position = computedStyle.position !== 'static' ? computedStyle.position : 'relative';
        iframe.style.top = computedStyle.top;
        iframe.style.left = computedStyle.left;
        iframe.style.margin = computedStyle.margin;
        iframe.style.padding = computedStyle.padding;
        iframe.style.display = computedStyle.display;

        iframe.frameBorder = '0';
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        iframe.classList.add('youtube-custom-player');

        const wrapper = document.createElement('div');
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height}px`;
        wrapper.style.position = computedStyle.position !== 'static' ? computedStyle.position : 'relative';
        wrapper.style.top = computedStyle.top;
        wrapper.style.left = computedStyle.left;
        wrapper.style.margin = computedStyle.margin;
        wrapper.style.padding = computedStyle.padding;
        wrapper.style.display = computedStyle.display;

        wrapper.appendChild(iframe);

        playerElement.parentNode.replaceChild(wrapper, playerElement);
    }

    function waitForPlayerReady(attempts = 0) {
        const maxAttempts = 30;
        const interval = 500;

        if (attempts >= maxAttempts) {
            console.warn('הגענו למספר הניסיונות המקסימלי. מנסים להחליף את הנגן בכל מקרה.');
            performReplacement();
            return;
        }

        if (checkPlayerReady()) {
            setTimeout(performReplacement, 500);
        } else {
            setTimeout(() => waitForPlayerReady(attempts + 1), interval);
        }
    }

    waitForPlayerReady();
}

function findAndReplacePlayer(attempts = 0) {
    const maxAttempts = 20;
    const interval = 500;

    if (attempts >= maxAttempts) {
        console.error('לא הצלחנו למצוא את אלמנט הנגן לאחר מספר ניסיונות');
        return;
    }

    const playerElement = document.querySelector('ytd-player, #container.ytd-player');
    if (playerElement) {
        replaceYoutubePlayer();
    } else {
        setTimeout(() => findAndReplacePlayer(attempts + 1), interval);
    }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    findAndReplacePlayer();
} else {
    document.addEventListener("DOMContentLoaded", findAndReplacePlayer);
}
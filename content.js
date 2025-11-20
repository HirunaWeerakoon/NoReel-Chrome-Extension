console.log("Focus Mode Extension: Loaded");

// 1. THE GATEKEEPER
chrome.storage.local.get(['isEnabled'], function(result) {
    // Default to true if undefined
    if (result.isEnabled === false) {
        console.log("Focus Mode is OFF.");
        // CRITICAL: Ensure the class is removed so CSS doesn't fire
        document.body.classList.remove('focus-mode-active');
        return;
    }

    // 2. THE ACTIVATOR
    // Add this class to the body. The CSS will wait for this class before hiding anything.
    document.body.classList.add('focus-mode-active');

    console.log("Focus Mode is ON.");
    removeDistractions();
    startObserver();
});

// ... (Keep your removeDistractions and startObserver functions exactly the same)
function removeDistractions() {
    const currentUrl = window.location.hostname;

    // --- YOUTUBE ---
    if (currentUrl.includes('youtube.com')) {
        const shortsShelves = document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]');
        shortsShelves.forEach(shelf => {
            const section = shelf.closest('ytd-rich-section-renderer');
            if (section) section.style.display = 'none';
        });

        const shortsLinks = document.querySelectorAll('a[title="Shorts"]');
        shortsLinks.forEach(link => {
            const entry = link.closest('ytd-guide-entry-renderer') || link.closest('ytd-mini-guide-entry-renderer');
            if (entry) entry.style.display = 'none';
        });

        const mobileShorts = document.querySelectorAll('ytm-pivot-bar-item-renderer');
        mobileShorts.forEach(item => {
            if (item.innerText.includes('Shorts')) item.style.display = 'none';
        });
    }

    // --- FACEBOOK ---
    if (currentUrl.includes('facebook.com')) {
        const headings = document.querySelectorAll('span, h3, div');
        headings.forEach(el => {
            if (el.innerText === 'Reels' || el.innerText === 'Reels and short videos') {
                const container = el.closest('[data-pagelet^="FeedUnit"]') || el.closest('[data-pagelet^="Stories"]');
                if (container) container.style.display = 'none';
                const sidebarReel = el.closest('[aria-label="Reels"]');
                if (sidebarReel) sidebarReel.style.display = 'none';
            }
        });
    }

    // --- INSTAGRAM ---
    if (currentUrl.includes('instagram.com')) {
        const reelsLinks = document.querySelectorAll('a[href*="/reels/"]');
        reelsLinks.forEach(link => link.style.display = 'none');
    }
}

function startObserver() {
    const observer = new MutationObserver((mutations) => {
        removeDistractions();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
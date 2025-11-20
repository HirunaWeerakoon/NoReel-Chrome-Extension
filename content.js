console.log("Focus Mode Extension: Loaded");

// 1. THE GATEKEEPER
// Check if the user has the extension turned ON or OFF
chrome.storage.local.get(['isEnabled'], function(result) {
    // If 'isEnabled' is undefined, we default to true (ON).
    // If it is explicitly false, we stop the script here.
    if (result.isEnabled === false) {
        console.log("Focus Mode is OFF. Enjoy your scrolling.");
        return;
    }

    // If we passed the gate, start the engine:
    console.log("Focus Mode is ON. Hunting for distractions...");
    removeDistractions();
    startObserver();
});


// 2. THE CLEANING LOGIC
function removeDistractions() {
    const currentUrl = window.location.hostname;

    // --- YOUTUBE ---
    if (currentUrl.includes('youtube.com')) {
        // Hide Shorts shelf on Home (Grid view)
        const shortsShelves = document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]');
        shortsShelves.forEach(shelf => {
            // We need to hide the container section to remove the gap
            const section = shelf.closest('ytd-rich-section-renderer');
            if (section) section.style.display = 'none';
        });

        // Hide Shorts in Sidebar (Backup for CSS)
        const shortsLinks = document.querySelectorAll('a[title="Shorts"]');
        shortsLinks.forEach(link => {
            const entry = link.closest('ytd-guide-entry-renderer') || link.closest('ytd-mini-guide-entry-renderer');
            if (entry) entry.style.display = 'none';
        });

        // Hide Shorts Tab in Mobile/Responsive view
        const mobileShorts = document.querySelectorAll('ytm-pivot-bar-item-renderer');
        mobileShorts.forEach(item => {
            if (item.innerText.includes('Shorts')) item.style.display = 'none';
        });
    }

    // --- FACEBOOK ---
    if (currentUrl.includes('facebook.com')) {
        // Facebook randomizes classes, so we search for text
        const headings = document.querySelectorAll('span, h3, div');

        headings.forEach(el => {
            // Check for the "Reels" header text
            if (el.innerText === 'Reels' || el.innerText === 'Reels and short videos') {
                // Climb up to find the feed unit container
                // data-pagelet is a common attribute for FB feed items
                const container = el.closest('[data-pagelet^="FeedUnit"]') || el.closest('[data-pagelet^="Stories"]');
                if (container) container.style.display = 'none';

                // Also try to catch the sidebar reels block
                const sidebarReel = el.closest('[aria-label="Reels"]');
                if (sidebarReel) sidebarReel.style.display = 'none';
            }
        });
    }

    // --- INSTAGRAM ---
    if (currentUrl.includes('instagram.com')) {
        // Remove Reels icon from sidebar/nav
        const reelsLinks = document.querySelectorAll('a[href*="/reels/"]');
        reelsLinks.forEach(link => link.style.display = 'none');
    }
}


// 3. THE WATCHER (MutationObserver)
function startObserver() {
    const observer = new MutationObserver((mutations) => {
        // When the page changes, run the cleaner again.
        removeDistractions();
    });

    // Start watching the whole body for changes
    observer.observe(document.body, {
        childList: true, // Watch for new elements added
        subtree: true    // Watch inside nested elements
    });
}
const statusSpan = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

// 1. When the popup opens, check the current saved state
chrome.storage.local.get(['isEnabled'], function(result) {
    // Default to true (ON) if not set
    let isEnabled = result.isEnabled !== false;
    updateUI(isEnabled);
});

// 2. Handle button click
toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['isEnabled'], function(result) {
        let isEnabled = result.isEnabled !== false;

        // Flip the boolean (true -> false, or false -> true)
        let newState = !isEnabled;

        // Save the new state
        chrome.storage.local.set({ isEnabled: newState }, function() {
            updateUI(newState);

            // Optional: Reload the active tab to apply changes immediately
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });
});

function updateUI(isEnabled) {
    if (isEnabled) {
        statusSpan.innerText = "ON";
        statusSpan.style.color = "green";
        toggleBtn.innerText = "Turn OFF";
    } else {
        statusSpan.innerText = "OFF";
        statusSpan.style.color = "red";
        toggleBtn.innerText = "Turn ON";
    }
}
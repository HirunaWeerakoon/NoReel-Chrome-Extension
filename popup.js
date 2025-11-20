const toggleSwitch = document.getElementById('toggleSwitch');

// 1. Initialize: Set the switch visual based on saved settings
chrome.storage.local.get(['isEnabled'], function(result) {
    // Default to true (ON) if undefined, otherwise use the saved value
    const isEnabled = result.isEnabled !== false;

    // Set the checkbox state (checked = true/ON, unchecked = false/OFF)
    toggleSwitch.checked = isEnabled;
});

// 2. Listen for changes (When you click the toggle)
toggleSwitch.addEventListener('change', () => {
    const newState = toggleSwitch.checked; // true or false

    // Save the new state
    chrome.storage.local.set({ isEnabled: newState }, function() {
        console.log("Focus Mode is now: " + newState);

        // Reload the active tab to apply changes immediately
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    });
});
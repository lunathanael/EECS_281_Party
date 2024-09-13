function checkAllPass() {
    // Select the first row of the table with class 'eecs281table'
    const tableRow = document.querySelector('.eecs281table tbody tr');

    if (!tableRow) {
        return; // If no rows found, exit early
    }

    // Get all cells (th or td) in the first row
    const cells = tableRow.querySelectorAll('th, td');

    if (cells.length < 4) {
        return; // Ensure there are at least 4 cells in the row
    }

    // Get the name in the first column (for saving the result)
    const firstCell = cells[0];
    const firstCellText = firstCell?.innerText || firstCell?.textContent || '';

    // Check if the first cell ends with '*' or contains "(grading)"
    if (firstCellText.endsWith('*') || firstCellText.includes('(grading)')) {
        return; // Skip if it's a grading row
    }

    // Retrieve the stored result from chrome.storage.sync
    chrome.storage.sync.get([firstCellText], function(result) {
        const existingResult = result[firstCellText];

        // If a "yay" result is already stored for this name, skip further checks
        if (existingResult === 'yay') {
            return; // Already processed this name with a "yay"
        }

        // Start checking from the 4th cell
        let allGreen = true;
        for (let i = 3; i < cells.length; i++) {
            const cell = cells[i];

            // Skip the cell if the text is "N/A"
            const cellText = cell.innerText || cell.textContent || '';
            if (cellText === 'N/A') {
                continue;
            }

            // Check if the background color is green
            const bgColor = window.getComputedStyle(cell).backgroundColor;
            if (bgColor !== 'rgb(47, 133, 90)' && bgColor != 'rgb(104, 211, 145)') { // Assuming this is green
                allGreen = false; // If any cell is not green, set flag to false
            }
        }

        // If all cells are green, store the result in chrome.storage.sync and trigger confetti
        if (allGreen) {
            // Store the result in chrome.storage.sync
            let storeObj = {};
            storeObj[firstCellText] = 'yay';
            chrome.storage.sync.set(storeObj, function() {
                // console.log('Yay result saved for:', firstCellText);

                // Trigger confetti for celebration
                triggerConfetti();
            });
        }
    });
}

function triggerConfetti() {
    chrome.storage.sync.get(['particles', 'spread', 'size', 'duration'], function (data) {
      const particles = data.particles || 150;
      const spread = data.spread || 200;
      const size = data.size || 12;
      const duration = data.duration || 300;
  
      // Call the confetti function with the stored settings
      confetti({
        particleCount: parseInt(particles),
        spread: parseInt(spread),
        origin: { x: 0.5, y: 0.5 },
        scalar: parseFloat(size) / 10,  // Size scalar for confetti size
        ticks: parseInt(duration)       // Duration of confetti
      });
    });
  }
  

// Function to observe table changes
function observeTableChanges(targetElement) {
    if (!targetElement) return;

    const config = { childList: true, subtree: true, characterData: true };
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                checkAllPass();
                break;
            }
        }
    });

    observer.observe(targetElement, config);
}

// Function to watch for the table's appearance or reappearance
function waitForTable() {
    const targetNode = document.body; // Watch the entire body

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            const table = document.querySelector('.eecs281table');
            if (table) {
                checkAllPass();         // Process the table immediately
                observeTableChanges(table); // Start observing the table for updates
            }
        }
    });

    // Watch the body for changes (element being added, removed, etc.)
    observer.observe(targetNode, { childList: true, subtree: true });
}

// Start observing the document for the table's appearance
waitForTable();
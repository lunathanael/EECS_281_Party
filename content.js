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
    chrome.storage.sync.get([firstCellText], function (result) {
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
            chrome.storage.sync.set(storeObj, function () {
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

async function processTableRows() {
    // Get table elements and all submission rows
    const table = document.querySelector(".eecs281table tbody");
    const headerCells = document.querySelectorAll(".eecs281table thead tr th");
    const rows = table.querySelectorAll("tr");

    // Debug logging for row detection
    console.log("rows", rows);
    console.log("rows length", rows.length);

    for (const row of rows) {
        // Find submission timestamp link in row
        const timestampCell = row.querySelector("a.chakra-link");
        if (!timestampCell) continue;

        try {
            // Fetch detailed submission data from background script
            const response = await chrome.runtime.sendMessage({
                action: "fetchSubmissionDetails",
                url: timestampCell.href
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            // Debug logging for response data
            console.log("response.data", response.data);

            // Parse test case results from response
            const testCaseData = extractTestCaseData(response.data);

            // Create new row for detailed test case information
            const newRow = document.createElement("tr");
            newRow.style.height = "20px";
            newRow.style.backgroundColor = "black";

            // Add empty cells for first 3 columns (matching header structure)
            for (let i = 0; i < 3; i++) {
                const cell = document.createElement("td");
                cell.style.backgroundColor = "black";
                newRow.appendChild(cell);
            }

            // Map test case data to corresponding header columns
            const testCaseMap = new Map();
            for (let i = 3; i < headerCells.length; i++) {
                const testCaseName = headerCells[i].textContent.trim();
                if (testCaseData[testCaseName]) {
                    testCaseMap.set(i, testCaseData[testCaseName]);
                }
            }

            // Populate cells with test case details in correct order
            for (let i = 3; i < headerCells.length; i++) {
                const cell = document.createElement("td");
                const data = testCaseMap.get(i);
                if (data) {
                    formatCell(cell, headerCells[i].textContent.trim(), data);
                }
                newRow.appendChild(cell);
            }

            // Insert detailed row after the submission row
            row.after(newRow);
        } catch (error) {
            console.error(`Error fetching submission details:`, error);
        }
    }
}

function formatCell(cell, testCase, data) {
    // Style cell and display runtime/memory information
    cell.style.backgroundColor = "black";
    cell.textContent = `${data.runtime}/${data.timeLimit}s, ${data.memory}/${data.memoryLimit}kb`;
}

function extractTestCaseData(fileText) {
    // Regular expression to match test case results pattern
    const testCaseRegex = /Test case ([\w-]+): (Passed|Failed)\s+Runtime \(sec\): ([\d.]+)\/([\d.]+)\s+Memory \(kb\): (\d+)\/(\d+)/g;
    const data = {};
    let match;

    // Extract and structure all test case results
    while ((match = testCaseRegex.exec(fileText)) !== null) {
        const [_, testCase, status, runtime, timeLimit, memory, memoryLimit] = match;
        data[testCase] = {
            status,
            runtime,
            timeLimit,
            memory,
            memoryLimit
        };
    }
    return data;
}


function waitForTableInitial() {
    const checkForTable = async () => {
        const table = document.querySelector('.eecs281table');
        if (table) {
            clearInterval(intervalId);
            await processTableRows();
            console.log("processed table rows");
        }
    };

    checkForTable();

    const intervalId = setInterval(checkForTable, 100);
}

function waitForTableChanges() {
    const checkForTable = async () => {
        const table = document.querySelector('.eecs281table');
        if (table) {
            checkAllPass();
            observeTableChanges(table);
            clearInterval(intervalId);
        }
    };

    checkForTable();

    const intervalId = setInterval(checkForTable, 100);
}

waitForTableInitial();
waitForTableChanges();
// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle submission detail fetch requests
    if (request.action === "fetchSubmissionDetails") {
        // Create a new tab to load submission details
        chrome.tabs.create({
            url: request.url,
            active: false
        }, async (tab) => {
            try {
                // Wait for page content to fully load
                await new Promise(r => setTimeout(r, 1500));

                // Execute content extraction script in the new tab
                const [response] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        // Try multiple selectors to find submission content
                        const pre = document.querySelector('pre');
                        const submissionContent = document.querySelector('.submission-content');
                        const codeBlock = document.querySelector('code');

                        // Return first available content using priority order
                        if (submissionContent) return submissionContent.textContent;
                        if (pre) return pre.textContent;
                        if (codeBlock) return codeBlock.textContent;

                        // Fallback to body text if no specific elements found
                        return document.body.textContent;
                    }
                });

                // Clean up by removing the temporary tab
                await chrome.tabs.remove(tab.id);

                // Send successful response with extracted data
                sendResponse({ success: true, data: response.result });
            } catch (error) {
                // Handle and report any errors during extraction
                sendResponse({ success: false, error: error.message });
            }
        });
        return true; // Keep message channel open for async response
    }
});

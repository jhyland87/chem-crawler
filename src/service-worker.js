chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const params = new URLSearchParams({
        format: 'json',
        limit: '100',
    });

    const url = `https://www.laboratoriumdiscounter.nl/en/search/${encodeURI(message.query)}/?${params.toString()}`;
    console.log('querying for:', { query: message.query, url })

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => sendResponse({
            event: "onMessage",
            webResponse: data
        }))
        .catch(err => sendResponse({
            event: "ERROR",
            details: err
        }))
    return true
})

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    console.log('Welcome to the onInstalled!', reason, previousVersion)
})

chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started')
})

chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension onSuspend')
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log('onMessage called:', { message, sender })

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
        .then(data => {
            console.log('data:',data)
            return sendResponse({
                event: "onMessage",
                webResponse: data
            })
        })
        .catch(err => {
            return sendResponse({
                event: "ERROR",
                details: err
            })
        })
    return true
})

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    console.log('onMessageExternal called:', { message, sender })
    sendResponse({
        event: "onMessageExternal",
        date: new Date().toISOString()
    })
})

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    console.log('Welcome to the onInstalled!', reason, previousVersion)
})

chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started')
})

chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension onSuspend')
    // See about initiating an unsubscribe for the subscription, but since that’s
    // retrieved asynchronously, we might not be able to. The docs say:
    //
    //   “Note that since the page is unloading, any asynchronous operations
    //   started while handling this event are not guaranteed to complete.”
})


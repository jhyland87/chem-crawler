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
      console.log('data:', data)
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

self.addEventListener("fetch", (event) => {
  console.log("Handling fetch event for", event.request.url);
  event.request.WTF = 'testing'
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // if (event.request.url.match("^(http|https)://")) {
        //   const resp = await networkResponse.clone()
        //   // resp.FOO = 'foobar'
        //   // return resp
        //   // debugger
        //   //const rsptxt = await resp.text()

        //   const h = {}
        //   for (let [k, v] of c.headers.entries())
        //     h[k] = v;

        //   h.FOO = 'bar'
        //   //resp.headers.FOO = 'BAR'
        //   const r = new Response(resp.body, {
        //     headers: h,
        //     status: resp.status,
        //     statusText: resp.statusText
        //   });
        //   console.log('Returning:', r)
        //   return r
        // }
        return networkResponse;
      })
      .catch(() => {
        // Return a default offline response or handle the error appropriately
        return new Response('<h1>Offline</h1>', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
  )
});


// https://www.carolina.com/specialty-chemicals-b-c/c…te-laboratory-grade-100-g/854695.pr?question=acid

// const CACHE_VERSION = 1;
// const CURRENT_CACHES = {
//   query: `query-cache-v${CACHE_VERSION}`,
// };
// caches.open(CURRENT_CACHES.query).then(cache => {
//   cache.keys().then((keys) => {
//     keys.forEach((request, index, array) => {
//       console.log({index, request, array})
//     });
//   });
// })
// self.addEventListener("activate", (event) => {
//   // Delete all caches that aren't named in CURRENT_CACHES.
//   // While there is only one cache in this example, the same logic
//   // will handle the case where there are multiple versioned caches.
//   const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!expectedCacheNamesSet.has(cacheName)) {
//             // If this cache name isn't present in the set of
//             // "expected" cache names, then delete it.
//             console.log("Deleting out of date cache:", cacheName);
//             return caches.delete(cacheName);
//           }
//         }),
//       ),
//     ),
//   );
// });

// self.addEventListener("fetch", (event) => {
//   console.log("Handling fetch event for", event.request.url);

//   event.respondWith(
//     caches.open(CURRENT_CACHES.query).then((cache) => {
//       return cache
//         .match(event.request)
//         .then((response) => {
//           if (response) {
//             // If there is an entry in the cache for event.request,
//             // then response will be defined and we can just return it.
//             // Note that in this example, only font resources are cached.
//             console.log(" Found response in cache:", response);

//             return response;
//           }

//           // Otherwise, if there is no entry in the cache for event.request,
//           // response will be undefined, and we need to fetch() the resource.
//           console.log(
//             " No response for %s found in cache. About to fetch " +
//             "from network…",
//             event.request.url,
//           );

//           // We call .clone() on the request since we might use it
//           // in a call to cache.put() later on.
//           // Both fetch() and cache.put() "consume" the request,
//           // so we need to make a copy.
//           // (see https://developer.mozilla.org/en-US/docs/Web/API/Request/clone)
//           return fetch(event.request.clone()).then((response) => {
//             console.log(
//               "  Response for %s from network is: %O",
//               event.request.url,
//               response,
//             );
//             if (event.request.url.match("^(http|https)://")) {
//               cache.put(event.request, response.clone());
//             }

//             // Return the original response object, which will be used to
//             // fulfill the resource request.
//             return response;
//           });
//         })
//         .catch((error) => {
//           // This catch() will handle exceptions that arise from the match()
//           // or fetch() operations.
//           // Note that a HTTP error response (e.g. 404) will NOT trigger
//           // an exception.
//           // It will return a normal response object that has the appropriate
//           // error code set.
//           console.error("  Error in fetch handler:", error);

//           throw error;
//         });
//     }),
//   );
// });
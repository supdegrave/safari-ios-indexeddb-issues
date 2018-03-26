# Safari iOS - IndexedDB instability

This page was built to demonstrate instability in the implementation of IndexedDB in Safari/iOS (iPad 2, iOS 11.2.6 (15D100)), which can be seen either by pushing data too rapidly, or by pushing too much data. 

_Unfortunately, this results in the application's IndexedDB data being lost._

---

### Implementation

* Create strings of random size > 1MB, until reaching execution size. 
* In immediate mode, push each into an array, then loop the array to insert.
* In interval mode, insert on timer (bypassing the intermediate array).

---

The crash results in a forced page reload, displaying a header with "This web page was reloaded because a problem occurred."

This reload is silent and can't be easily tracked.

* If debugging on a USB-connected computer, the Safari debugger window disappears on page reload.
* Nothing appears in the device logs (as seen in XCode) since it doesn't cause an actual app crash.

On my device, the page almost always crashes if I add as little as 100MB without interval. It always crashes if I add 500MB with any interval between writes. Repeatedly adding 100MB or 250MB with various intervals eventually crashes.


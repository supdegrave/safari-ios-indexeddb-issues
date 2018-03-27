# Browser Comparison

Here are the results of running the same sequence of tests on various (non-iOS) browsers, on one computer. 

The sequence is: 

* Clear IndexedDB
* Add 100MB without interval
* Add 100MB with 100ms interval
* Add 100MB with 200ms interval
* Add 100MB with 500ms interval
* Add 500MB with 100ms interval

All browsers passed the sequence, except Safari which suffered a forced page reload on "Add 100MB without interval".

## Chrome - MacOS 
(Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36)

```
Cleared IndexedDB
Adding 100MB without interval
-> Completed in 3.915 seconds
Adding 100MB with 100ms interval
-> Completed in 22.081 seconds
Adding 100MB with 200ms interval
-> Completed in 44.129 seconds
Adding 100MB with 500ms interval
-> Completed in 156.2 seconds
Adding 500MB with 100ms interval
-> Completed in 204.989 seconds
```

## Chrome Canary - MacOS 
(Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3379.0 Safari/537.36)

```
Cleared IndexedDB
Adding 100MB without interval
-> Completed in 20.675 seconds
Adding 100MB with 100ms interval
-> Completed in 86.995 seconds
Adding 100MB with 200ms interval
-> Completed in 142.219 seconds
Adding 100MB with 500ms interval
-> Completed in 196.434 seconds
Adding 500MB with 100ms interval
-> Completed in 223.571 seconds
```

## Safari - MacOS 
(Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6)

```
Cleared IndexedDB
Adding 100MB without interval
-> Forced page reload: "This webpage was reloaded because it was using significant memory."
Adding 100MB with 100ms interval
-> Completed in 72.116 seconds
Adding 100MB with 200ms interval
-> Completed in 116.481 seconds
Adding 100MB with 500ms interval
-> Completed in 900.999 seconds
Adding 500MB with 100ms interval
-> Completed in 267.327 seconds
## And then because that 900sec run seemed anomalous: 
Adding 100MB with 500ms interval
-> Completed in 127.902 seconds
Adding 100MB with 500ms interval
-> Completed in 129.577 seconds
```

## Firefox - MacOS 
(Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:59.0) Gecko/20100101 Firefox/59.0)

```
Cleared IndexedDB
Adding 100MB without interval
-> Completed in 20.484 seconds
Adding 100MB with 100ms interval
-> Completed in 28.998 seconds
Adding 100MB with 200ms interval
-> Completed in 44.876 seconds
Adding 100MB with 500ms interval
-> Completed in 208.504 seconds
Adding 500MB with 100ms interval
-> Completed in 856.02 seconds
```

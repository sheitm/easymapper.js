# easymapper.js
A library providing simple functionality for mapping data between objects. The main
use case is for developers working in with a server language having a different casing
convention than JavaScript, for instance C#.

* No dependencies
* Small footprint
* MIT License

## Usage
**Pascal case to Camel case
```javascript
var source = { FirstName: "James" };
var dest = {};
easymapper.upperToLower(src, dest);
dest.firstName // returns "James"
```
**Camel case to Pascal case
```javascript
var source = { firstName: "Sally" };
var dest = {};
easymapper.upperToLower(src, dest);
dest.FirstName // returns "lowerToUpper"
```


## Tests
Launch test page in browser: file://./easymapper/test/tests.html
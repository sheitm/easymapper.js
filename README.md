# easymapper.js
A library providing simple functionality for mapping data between objects. The main
use case is for developers working in with a server language having a different casing
convention than JavaScript, for instance C#.

* No dependencies
* Small footprint
* MIT License

## Usage
**Pascal case to Camel case**
```javascript
// Arrange
var id = 123;
var name = "John Doe";
var src = { Id: id, Name: name };
var dest = {};

// Act
easymapper.upperToLower(src, dest);

// Assert
equal(id, dest.id);
equal(name, dest.name);
```
**Camel case to Pascal case**
```javascript
// Arrange
var id = 654;
var name = "Betsy Doe";
var src = { id: id, name: name };
var dest = {};

// Act
easymapper.lowerToUpper(src, dest);

// Assert
equal(id, dest.Id, "Value copied as expected");
equal(name, dest.Name, "Value copied as expected");
```
**If the source property is a function**
```javascript
// Arrange
var src = { Name: function() { return "Sally"; } };
var dest = {};

// Act
easymapper.upperToLower(src, dest);

// Assert
equal("Sally", dest.name);
```
**If the destination property is a function**
```javascript
// Arrange
var src = { Name: "Benny" };
var dest = { name: function(n) {
	var self = this;
	if (n) self.nm = n;
	return self.nm;
}};

// Act
easymapper.upperToLower(src, dest);

// Assert
equal("Benny", dest.name());
```
**Transforming data with custom maps**
```javascript
// Arrange
var map = {
	valueTransformers: {
		sex: function(n) { return n + " transformed"; }
	}
};

var src = { Sex: "M" };
var dest = {};

// Act
easymapper.map(src, dest, map);

// Assert
equal("M transformed", dest.sex);
```
**Maps can be predefined and named**
```javascript
// Arrange
var mapName = "MAP1";
var map = {
	valueTransformers: {
		sex: function(n) { return n + " transformed"; }
	}
};

easymapper.registerNamedMap(mapName, map);

var src = { Sex: "M" };
var dest = {};

// Act
easymapper.map(src, dest, mapName);

// Assert
equal("M transformed", dest.sex);
```

## Tests
Launch test page in browser: file://./easymapper/test/tests.html
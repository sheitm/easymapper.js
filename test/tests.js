module("Basic functionality");

test("Load script - Happy days - global variable set", function () {
	// Arrange

	// Act

	// Assert
	ok(easymapper, "Global variable is set");
});

test("upperToLower - No named map - Maps values as expected", function() {
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
});

test("lowerToUpper - No named map - Maps values as expected", function() {
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
});

test("map - source getter is function - Maps values as expected", function() {
	// Arrange
	var src = { Name: function() { return "Sally"; } };
	var dest = {};

	// Act
	easymapper.upperToLower(src, dest);

	// Assert
	equal("Sally", dest.name);
});

test("map - dest setter is function - Maps values as expected", function() {
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
});

module("Value transformers, sourceGetterConvention");
test("map - With value transformer - Maps values as expected", function() {
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
});
test("map - With value transformer and named map - Maps values as expected", function() {
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
});

module("Mapping object graphs");
test("upperToLower - nested objects - maps whole structure", function() {
	// Arrange
	var src = { Name: "Joe", Address: { Street: "Main street", Zip: "234234", Country: { Name: "United States of America", Code: "USA" } }};
	var dest = {};

	// Act
	easymapper.upperToLower(src, dest);

	// Assert
	ok(dest.address, "Address exists");
	equal("Main street", dest.address.street, "street set correctly");
	equal("234234", dest.address.zip, "zip set correctly");
	ok(dest.address.country, "Country exists");
	equal("United States of America", dest.address.country.name, "country name set");
	equal("USA", dest.address.country.code, "country code set");
});

module("Mapping arrays");
test("upperToLower - with array of values - array is copied directoy", function() {
	// Arrange
	var src = { Pets: ["Dog", "Cat", "Tiger"]};
	var dest = {};

	// Act
	easymapper.upperToLower(src, dest);

	// Assert
	ok(dest.pets, "has copied array");
	equal(3, dest.pets.length, "array has correct length");
	equal("Dog", dest.pets[0], "it's a dog!");
	equal("Cat", dest.pets[1], "it's a cat!");
	equal("Tiger", dest.pets[2], "it's a tiger!");
});

test("upperToLower - with array of objects - array is copied directoy", function() {
	// Arrange
	var src = { Pets: [{ Species: "Dog", Name: "Fido"}, { Species: "Cat", Name: "Mr. Cat"}]};
	var dest = {};

	// Act
	easymapper.upperToLower(src, dest);

	// Assert
	ok(dest.pets, "has copied array");
	equal(2, dest.pets.length, "array has correct length");
	equal("Dog", dest.pets[0].species, "it's a dog!");
	equal("Fido", dest.pets[0].name, "and it's called Fido!");
	equal("Cat", dest.pets[1].species, "it's a cat!");
	equal("Mr. Cat", dest.pets[1].name, "and it's called Mr. Cat!");
});
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
TestDomain = {};

TestDomain.Address = (function () {
	var a = function() {
		var self = this;

		self.street = null;
		self.zip = function(z) {
			var self = this;
			if (z) self.zp = z;
			return self.zp;
		};
	};

	return a;
})();

TestDomain.Person = (function() {
	var p = function() {
		var self = this;

		self.firstName = null;
		self.lastName = null;
		self.address = null;

		self.name = function() { return self.firstName + " " + self.lastName; };
	};

	return p;
})();
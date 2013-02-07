(function(global){
	// Attaching easymapper to the global variable
	var _easymapper = global.easymapper = {};
	_easymapper.__Maps = { };
	_easymapper.__Synonyms = { };

	var capitaliseFirstLetter = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	var loweriseFirstLetter = function (string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	};

	// If getterName is a function, we invoke it
	// else we get the property value
	var getVal = function(src, getterName, map) {
		return (typeof src[getterName] === "function") ? src[getterName].call() : src[getterName];
	};

	var addDefaultsToMap = function (map) {
		if (!map.nameTransformer) { map.nameTransformer = loweriseFirstLetter; }
		if (!map.valueTransformers) { map.valueTransformers = {}; }
		if (!map.synonyms) { map.synonyms = []; }
	};

	// If nameOrMap is a string, we'll look up the map
	// amoung the predfined, named maps (__Maps), else
	// it's an object and we'll assume that it is a valid
	// map. Defaults will be added.
	var getMap = function(nameOrMap) {
		var map = (typeof nameOrMap === "string") ? global.easymapper.__Maps[nameOrMap] : nameOrMap;
		addDefaultsToMap(map);
		return map;
	};

	var getDestinationObjectAndMap = function(parentMapName, destProp) {
		var map = null;

		var key = parentMapName ? parentMapName + "." + destProp : null;
		if (key && _easymapper.__Synonyms[key]) {
			map = global.easymapper.__Maps[_easymapper.__Synonyms[key]];
			var d = map.constructor ? new map.constructor() : {};
			return { map: map, destination: d, name: key };
		}

		map = {};
		addDefaultsToMap(map);
		return { map: map, destination: {}, name: null };
	};

	// The main motor of the mapper
	var mapFuncCore = function(src, dest, map, name) {
		for (var srcProperty in src) {
			// Compute the name of the property as it
			// should be on the destination object
			var destProp = map.nameTransformer(srcProperty);

			// Get the value from the destination object
			var nextName = name ? name + destProp : null;
			var val = getVal(src, srcProperty, map);
			if (val instanceof Array) {
				if (val.length > 0 && typeof val[0] === "object") {
					var newArray = [];
					for (var i = 0; i < val.length; i++) {
						var objAndMap = getDestinationObjectAndMap(name, destProp);
						mapFuncCore(val[i], objAndMap.destination, objAndMap.map, objAndMap.name);
						newArray.push(objAndMap.destination);
					}

					val = newArray;
				}
			}
			else if (typeof val === "object") {
				var om = getDestinationObjectAndMap(name, destProp);
				mapFuncCore(val, om.destination, om.map, om.name);
				val = om.destination;
			}

			// Transform the value if a value trasformer is
			// defined, else leave it as it is
			val = (map.valueTransformers[destProp]) ? map.valueTransformers[destProp](val) : val;

			// Determine whether the property already is defined
			// on the destination, and if so whether it is a
			// function
			if (typeof dest[destProp] === "function") {
				dest[destProp](val);
			}
			else {
				dest[destProp] = val;
			}
		}
	};

	var mapFunc = function(src, dest, nameOrMap) {
		var map = getMap(nameOrMap);
		var name = (typeof nameOrMap === "string") ? nameOrMap : null;
		var d = dest ? dest : new map.constructor();
		mapFuncCore(src, d, map, name);
		return d;
	};

	var mapFromUpperToLowerFunc = function(src, dest) {
		mapFunc(src, dest, "__UPPER_TO_LOWER__");
	};

	var mapFromLowerToUpperFunc = function(src, dest) {
		mapFunc(src, dest, "__LOWER_TO_UPPER__");
	};

	// Public API for registering named maps
	var registerNamedMap = function(name, map) {
		addDefaultsToMap(map);
		global.easymapper.__Maps[name] = map;
		for (var i = 0; i < map.synonyms.length; i++) {
			_easymapper.__Synonyms[map.synonyms[i]] = name;
		}
	};

	registerNamedMap("__UPPER_TO_LOWER__", {
		nameTransformer: loweriseFirstLetter,
		valueTransformers: {}
	});

	registerNamedMap("__LOWER_TO_UPPER__", {
		nameTransformer: capitaliseFirstLetter,
		valueTransformers: {}
	});

	// Expose whatever should be exposed
	_easymapper.map = mapFunc;
	_easymapper.upperToLower = mapFromUpperToLowerFunc;
	_easymapper.lowerToUpper = mapFromLowerToUpperFunc;
	_easymapper.registerNamedMap = registerNamedMap;
})(this);
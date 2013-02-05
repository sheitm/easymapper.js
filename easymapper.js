(function(global){
	var _easymapper = global.easymapper = {};
	_easymapper.__Maps = { };

	var capitaliseFirstLetter = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	var loweriseFirstLetter = function (string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	};

	var getVal = function(src, getterName, map) {
		return (typeof src[getterName] === "function") ? src[getterName].call() : src[getterName];
	};

	var addDefaultsToMap = function (map) {
		if (!map.nameTransformer) { map.nameTransformer = loweriseFirstLetter; }
		if (!map.valueTransformers) { map.valueTransformers = {}; }
	};

	var getMap = function(nameOrMap) {
		var map = (typeof nameOrMap === "string") ? global.easymapper.__Maps[nameOrMap] : nameOrMap;
		addDefaultsToMap(map);
		return map;
	};

	var mapFunc = function(src, dest, nameOrMap) {
		var map = getMap(nameOrMap);
		for (var srcProperty in src) {
			var destProp = map.nameTransformer(srcProperty);
			var val = getVal(src, srcProperty, map);
			val = (map.valueTransformers[destProp]) ? map.valueTransformers[destProp](val) : val;
			if (typeof dest[destProp] === "function") {
				dest[destProp](val);
			}
			else {
				dest[destProp] = val;
			}
		}
	};

	var mapFromUpperToLowerFunc = function(src, dest) {
		mapFunc(src, dest, "__UPPER_TO_LOWER__");
	};

	var mapFromLowerToUpperFunc = function(src, dest) {
		mapFunc(src, dest, "__LOWER_TO_UPPER__");
	};

	var registerNamedMap = function(name, map) {
		addDefaultsToMap(map);
		global.easymapper.__Maps[name] = map;
	};

	registerNamedMap("__UPPER_TO_LOWER__", {
		nameTransformer: loweriseFirstLetter,
		valueTransformers: {}
	});

	registerNamedMap("__LOWER_TO_UPPER__", {
		nameTransformer: capitaliseFirstLetter,
		valueTransformers: {}
	});

	_easymapper.map = mapFunc;
	_easymapper.upperToLower = mapFromUpperToLowerFunc;
	_easymapper.lowerToUpper = mapFromLowerToUpperFunc;
	_easymapper.registerNamedMap = registerNamedMap;
})(this);
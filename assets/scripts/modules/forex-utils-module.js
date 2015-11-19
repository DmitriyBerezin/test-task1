
'use strict';

var ForexApp = ForexApp || {};

ForexApp.Utils = (function (module) {
	var numberFormatRegex = /(\d+)(\d{3})/;

	// Private functions
	function formatNumber(n) {
		while (numberFormatRegex.test(n)) {
			n = n.toString().replace(numberFormatRegex, '$1' + ',' + '$2');
		}

		return n;
	}

	// forms [
	// 		0: (1 билет, 21 билет, 101 билет...)
	// 		1: (2-4 билета, 22-24 билета...)
	// 		2: (11-19 билетов) + остальное
	// ]
	function getWordForm(n, forms) {
		var cases = [2, 0, 1, 1, 1, 2];

		if (typeof n === 'string') {
			n = parseInt(n, 10);
		}
		return forms[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5]]
	}

	// Public API
	module.formatNumber = formatNumber;
	module.getWordForm = getWordForm;

	return module;
}(ForexApp.Utils || {}));

'use strict';

var ForexApp = ForexApp || {};

ForexApp.Settings = (function (module) {
	// Кэшируем наличие фич браузера
	var localStorageEnabled = !!localStorage,
		sessionStorageEnabled = !!sessionStorage;

	// Private functions
	function getGlobalSettings(name) {
		if (localStorageEnabled) {
			return localStorage.getItem(name);
		}
		else {
			return docCookies.getItem(name)
		}
	}

	function setGlobalSettigs(name, value) {
		if (localStorageEnabled) {
			localStorage.setItem(name, value);
		}
		else {
			docCookies.setItem(name, value, Infinity);
		}
	}

	function getSessionSettings(name) {
		if (sessionStorageEnabled) {
			return sessionStorage.getItem(name);
		}
		else {
			return docCookies.getItem(name)
		}
	}

	function setSessionSettings(name, value) {
		if (sessionStorageEnabled) {
			sessionStorage.setItem(name, value);
		}
		else {
			// Create a session cookie
			docCookies.setItem(name, value);
		}
	}

	// Public API
	module.getGlobalSettings = getGlobalSettings;
	module.setGlobalSettigs = setGlobalSettigs;
	module.getSessionSettings = getSessionSettings;
	module.setSessionSettings = setSessionSettings;

	return module;
}(ForexApp.Settings || {}));
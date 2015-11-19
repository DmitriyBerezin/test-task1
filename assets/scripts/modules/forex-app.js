
'use strict';

var ForexApp = (function(module) {
	// Private functions
	function init() {
		this.membersCount = parseInt(this.Settings.getSessionSettings(this.Consts.MEMBERS_COUNT), 10) || 4570;
	}

	// Public API
	module.init = init;

	return module; 

}(ForexApp || {}));

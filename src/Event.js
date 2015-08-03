Miniscroll.Event = {
	on: function(element, eventType, callback, r) {
		var self = r;
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	},
	
	off: function(element, eventType, callback, r) {
		var self = r;
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	},
	
	mousewheel: function(element, callback, r) {
	}
};
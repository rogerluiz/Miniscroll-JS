	(function () {
		if (window.jQuery) {
			jQuery.fn.miniscroll = function (options) {
				return new Miniscroll.Scroll(this, options);
			};
		}
	}());
	
	window.Miniscroll = Miniscroll;
})(window, document);
	(function () {
		if (window.jQuery) {
			jQuery.fn.miniscroll = function (options) {
				return new Miniscroll.Scroll(this, options);
			};
		}
	}());
	
	window.Miniscroll = Miniscroll.Scroll;
})(window, document);

// verifica se require existe
if (typeof require === "function" && typeof require.specified === "function") {
    /*define(function () {
        return Miniscroll.Scroll;
    });*/
}
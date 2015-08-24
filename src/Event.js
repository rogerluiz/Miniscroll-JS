

	/**
	 * @class Miniscroll.Event
	 * @static
	 */
	Miniscroll.Event = {
		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.on
		 * @param  {element} element HTMLElement to be call the event listener
		 * @param  {string} type The type of event
		 * @param  {function} callback Function that contains the codes
		 * @param  {Miniscroll} root Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.on(element, eventType, callback, this);
		 */
		on: function(element, type, callback, root) {
			var self = root;
			var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

			if (element.addEventListener)
			{
				if (type === "mousewheel" )
				{
					element.addEventListener(mousewheel, function(event) {
						callback.call(self, event, this);
					}, false);
				}
				else
				{
					element.addEventListener(type, function(event) {
						callback.call(self, event, this);
					}, false);
				}
			}
			else if (element.attachEvent)
			{
				element.attachEvent('on' + type, function(event) {
					callback.call(self, event, this);
				});
			}
			else
			{
				element['on' + type] = function(event) {
					callback.call(self, event, this);
				};
			}
		},

		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.off
		 * @param  {element} element HTMLElement to be call the event listener
		 * @param  {string} type The type of event
		 * @param  {function} callback Function that contains the codes
		 * @param  {Miniscroll} r Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.off(element, eventType, callback, r);
		 */
		off: function(element, type, callback, r) {
			var self = r;
			var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

			if (element.addEventListener)
			{
				if(type === "mousewheel") {
					element.removeEventListener(mousewheel, function(event) {
						callback.call(self, event, this);
					}, false);
				} else {
					element.removeEventListener(type, function(event) {
						callback.call(self, event, this);
					}, false);
				}
			}
			else if (element.attachEvent)
			{
				element.detachEvent('on' + type, function(event) {
					callback.call(self, event, this);
				});
			}
			else
			{
				element['on' + type] = null;
			}
		},

		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},

		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.mousewheel
		 * @param  {element} element HTMLElement to be call the event listener
		 * @param  {function} callback Function that contains the codes
		 * @param  {Miniscroll} root Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.mousewheel(element, callback, this);
		 */
		mousewheel: function(element, callback, root) {
		}
	};
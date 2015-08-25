	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */

	/**
	 * @class Miniscroll.Utils
	 * @static
	 */
	Miniscroll.Utils = {
		/**
		 * Gets the value of a css property
		 * 
		 * @method Miniscroll.Utils#getCss
		 * @param  {HTMLElement} element - HTMLElement to be call
		 * @param  {string} property - CSS property to search
		 * @return {*} Returns the value of the css property searched
		 *
		 * @example Miniscroll.Utils.getCss(element, property);
		 */
		getCss: function(element, property) {
			var result;
			
			if (!window.getComputedStyle) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					result = document.defaultView.getComputedStyle.getPropertyValue(property);
				} else {
					result = (element.currentStyle) ? element.currentStyle[property] : element.style[property];
				}
			} else {
				
				//result = window.getComputedStyle(element, null).getPropertyValue(property);
				result = window.getComputedStyle(element).getPropertyValue(property);
			}

			return result;
		},

		/**
		 * Add css inline in the element
		 * 
		 * @method Miniscroll.Utils#setCss
		 * @param  {HTMLElement} element - HTMLElement to be call
		 * @param  {object} arguments - Group of parameters that defines the style element
		 * @return {void}
		 * 
		 * @example Miniscroll.Utils.setCss({ width : '200px' });
		 */
		setCss: function(element, property) {
			for (var prop in property) {
				// the popacity hack
				if (prop === 'opacity') {
					element.style.filter = 'alpha(opacity=' + (property[prop] * 100) + ')';
					element.style.KhtmlOpacity = property[prop];
					element.style.MozOpacity = property[prop];
					element.style.opacity = property[prop];
				} else {
					if (prop === "marginLeft" || prop === "marginTop" || prop === "left" || prop === "top" || prop === "width" || prop === "height") {
						element.style[prop] = (typeof property[prop] === "string") ? property[prop] : property[prop] + "px";
					} else {
						element.style[prop] = property[prop];
					}
				}
			}
		},

		/**
		 * Get Element
		 * 
		 * @method Miniscroll.Utils#get
		 * @param  {string|element} selector - Query string or a element
		 * @return {HTMLElement} get the element usign a query selector
		 */
		get: function(selector) {
			var element = null;
			var self = this;

			if (selector === window || selector === document || selector === "body" || selector === "body, html") {
				return document.body;
			}

			// if the browser support querySelectorAll usign this
			if (document.querySelectorAll && typeof selector == "string") {
				return document.querySelectorAll(selector)[0];
			} else { // else the browser not support using a custom selector
				if (typeof selector === 'string' || selector instanceof String) {
					var token = selector.replace(/^\s+/, '').replace(/\s+$/, '');

					if (token.indexOf("#") > -1) {
						this.type = 'id';
						var match = token.split('#');

						element = document.getElementById(match[1]);
					}

					if (token.indexOf(".") > -1) {
						this.type = 'class';

						var match = token.split('.');
						var tags = document.getElementsByTagName('*');
						var len = tags.length;
						var found = [];
						var count = 0;

						for (var i = 0; i < len; i++) {
							if (tags[i].className && tags[i].className.match(new RegExp("(^|\\s)" + match[1] + "(\\s|$)"))) {
								element = tags[i];
							}
						}
					}

					return element;
				} else {
					return selector;
				}
			}
		},
		
		/**
		 * Create an element and add attributes
		 * 
		 * @method Miniscroll.Utils#create
		 * @param  {HTMLElement} element - container for the new element
		 * @param  {string} tagName - Type of the new element ex: (div, article, etc..)
		 * @param  {object} attrs - Atributes for the new element
		 * @return {HTMLElement} New HTMLElement
		 */
		create: function(element, tagName, attrs) {
			
			var tag = document.createElement(tagName);

			if (attrs) {
				for (var key in attrs) {
					if (attrs.hasOwnProperty(key)) {
						tag.setAttribute(key, attrs[key]);
					}
				}

				element.appendChild(tag);
			}

			return tag;
		},


		/**
		 * Offset
		 * 
		 * @method Miniscroll.Utils#offset
		 * param {HTMLElement} element - HTMLElement to be call
		 * 
		 */
		offset: function(element) {
			var positionType = Miniscroll.Utils.getCss(element, 'position');

			var style = new Miniscroll.Point(
				(element.style.left == "") ? 0 : parseInt(element.style.left),
				(element.style.top == "") ? 0 : parseInt(element.style.top)
			);

			var top = (positionType == "relative") ? style.y : element.offsetTop;
			var left = (positionType == "relative") ? style.x : element.offsetLeft;
			var height = element.offsetHeight;
			var width = element.offsetWidth;

			if (typeof element.offsetHeight === "undefined") {
				height = parseInt(Miniscroll.Utils.getCss(element, "height"));
			}

			if (typeof element.offsetWidth === "undefined") {
				width = parseInt(Miniscroll.Utils.getCss(element, "width"));
			}

			return {
				top: top,
				left: left,
				width: width,
				height: height
			};
		},

		/**
		 * Returns the current mouse position
		 * 
		 * @method Miniscroll.Utils#pointer
		 * @param  {event} event - String type to event
		 * @return {Miniscroll.Point} Pair of coordinates
		 */
		pointer: function(event) {
			var posx = 0, posy = 0;

			if (event.pageX || event.pageY)
			{
				posx = event.pageX;
				posy = event.pageY;
			}
			else if (event.clientX || event.clientY)
			{
				posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}

			return new Miniscroll.Point(posx, posy);
		},
		
		/**
		 * Extend a object to other
		 * 
		 * @method Miniscroll.Utils#extend
		 * @return {object} list of parameters
		 */
		concat: function() {
			for (var i = 1; i < arguments.length; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						arguments[0][key] = arguments[i][key];
					}
				}
			}

			return arguments[0];
		},
		
		/**
		 * Get the highest z-index
		 * 
		 * @method Miniscroll.Utils#getZindex
		 * @return {intiger} the highest z-index
		 */
		getZindex: function(target) {
			/**
			 * @property {interger} topZIndex - the highest 'z-index'
			 * @protected
			 */
			var topZIndex = 0;
			
			/**
			 * @property {interger} zIndex - the z-index
			 * @protected
			 */
			var zIndex = 0;
			
			/**
			 * @property {interger} scroll - Get original 'position' property
			 * @protected
			 */
			var pos = 0;
			
			/**
			 * @property {HTMLElement|Array} tags - Get all HTMLElements inside the 'target'
			 * @protected
			 */
			var tags = target.getElementsByTagName('*');
			
			for (var i = 0; i < tags.length; i++) {
				// Get the original 'position' property
				pos = Miniscroll.Utils.getCss(tags[i], "position");
				
				// Set it temporarily to 'relative'
				tags[i].style.position = "relative";
				
				// Grab the z-index
				zIndex = Number(Miniscroll.Utils.getCss(tags[i], "z-index"));
				
				// Reset the 'position'
				tags[i].style.position = pos;
				
				if (zIndex > topZIndex) {
					topZIndex = zIndex + 1;
				}
			}
			
			return topZIndex;
		}
		
	};


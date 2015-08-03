/**
 * @author       Roger Luiz <rogerluizm@gmail.com>
 * @copyright    2015 Roger Luiz Ltd.
 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
 */

/**
 * @class Miniscroll.Utils
 * @static
 */
var Miniscroll.Utils = {
	/**
	 * Gets the value of a css property
	 * 
	 * @method Miniscroll.Utils.getCss
	 * @param  {element} element - HTMLElement to be call
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
			result = window.getComputedStyle(element).getPropertyValue(property);
		}

		return result;
	},
	
	/**
	 * Add css inline in the element
	 * 
	 * @method Miniscroll.Utils.setCss
	 * @param  {element} element  - HTMLElement to be call
	 * @param  {object} arguments - Group of parameters that defines the style element
	 * @return {void}
	 * 
	 * @example Miniscroll.Utils.setCss({ width : '200px' });
	 */
	setCss: function(element, arguments) {
		for (var prop in arguments) {
			// the popacity hack
			if (prop === 'opacity') {
				element.style.filter = 'alpha(opacity=' + (arguments[prop] * 100) + ')';
				element.style.KhtmlOpacity = arguments[prop];
				element.style.MozOpacity = arguments[prop];
				element.style.opacity = arguments[prop];
			} else {
				if (prop === "marginLeft" || prop === "marginTop" || prop === "left" || prop === "top" || prop === "width" || prop === "height") {
					element.style[prop] = (typeof arguments[prop] === "string") ? arguments[prop] : arguments[prop] + "px";
				} else {
					element.style[prop] = arguments[prop];
				}
			}
		}
	},
	
	/**
	 * Get Element
	 * 
	 * @method Miniscroll.Utils.get
	 * @param  {string|element} selector Query string or a element
	 * @return {element} get the element usign a query selector
	 */
	get: function(selector) {
		var element = null;
		var self = this;


		if (selector === window || selector === document || selector === "body" || selector === "body, html")
		{
			return document.body;
		}

		// if the browser support querySelectorAll usign this
		if (document.querySelectorAll && typeof selector == "string")
		{
			return document.querySelectorAll(selector)[0];
		}

		// else the browser not support using a custom selector
		else
		{
			if (typeof selector === 'string' || selector instanceof String)
			{
				var token = selector.replace(/^\s+/, '').replace(/\s+$/, '');

				if (token.indexOf("#") > -1)
				{
					this.type = 'id';
					var match = token.split('#');

					element = document.getElementById(match[1]);
				}

				if (token.indexOf(".") > -1)
				{
					this.type = 'class';

					var match = token.split('.');
					var tags = document.getElementsByTagName('*');
					var len = tags.length;
					var found = [];
					var count = 0;

					for (var i = 0; i < len; i++)
					{
						if (tags[i].className && tags[i].className.match(new RegExp("(^|\\s)" + match[1] + "(\\s|$)")))
						{
							element = tags[i];
						}
					}
				}

				return element;
			}
			else
			{
				return selector;
			}
		}
	},
	
	/**
	 * Returns the current mouse position
	 * 
	 * @method Miniscroll.Utils.pointer
	 * @param  {event} event String type to event
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
	}
};
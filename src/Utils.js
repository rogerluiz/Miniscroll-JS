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
	
	
};
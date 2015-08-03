/**
 * @author       Roger Luiz <rogerluizm@gmail.com>
 * @copyright    2015 Roger Luiz Ltd.
 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
 */
(function() {
	"use strict";
	
    var root = this;

	/**
	 * @namespace Miniscroll
	 */	
	var Miniscroll = Miniscroll || {
		/**
		 * The Miniscroll version number.
		 * @constant
		 * @type {string}
		 */
		VERSION: '2.0.0',
	};
	
	Miniscroll.Scroll = function(element, options) {
		root = this;
		
	};
	
	Miniscroll.Scroll.prototype.constructor = Miniscroll.Scroll;
	
	window.Miniscroll = Miniscroll;
})();
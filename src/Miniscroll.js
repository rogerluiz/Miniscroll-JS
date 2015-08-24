/**
 * @author       Roger Luiz <rogerluizm@gmail.com>
 * @copyright    2015 Roger Luiz Ltd.
 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
 */
(function(window, document) {
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
	
	/**
	 * Scrollbar constructor
	 * 
	 * @class Miniscroll.Scroll
	 * @constructor
	 * @param {string|element} selector
	 * @param {object} options 
	 */
	Miniscroll.Scroll = function(selector, options) {
		
		/**
		 * set a variable to get this
		 * 
		 * @constant
		 * @type {Class}
		 */
		root = this;
		
		/**
		 * get the div he ought to contain the scrollbar
		 * 
		 * @constant
		 * @type {element}
		 */
		this.target = Miniscroll.Utils.get(selector);

		/**
		 * The container of scrollbar
		 * 
		 * @constant
		 * @type {element}
		 */
		this.container = null;

		/**
		 * The thumb of scrollbar
		 * 
		 * @constant
		 * @type {element}
		 */
		this.thumb = null;

		/**
		 * The tracker of scrollbar
		 * 
		 * @constant
		 * @type {element}
		 */
		this.tracker = null;
		
		// concat options and settings
		Miniscroll.Utils.concat(root.settings, options);
		
		this.create = new Miniscroll.Create(this);
		this.create.init();
		
	};
	
	/**
     * Settigns of scrollbar
     * 
     * @constant
     * @property {string} axis of the scrollbar
     * @property {number} size the width of the scrollbar
     * @property {number|string} sizethumb the width or height of the thumb
     * @property {number|string} scrollbarSize size of scrollbar, you can set a size fix to scrollbar
     * @property {string} thumbColor background color of the thumb
     * @property {string} trackerColor background color of the tracker
     * @property {bolean} isKeyEvent Add arrow key event
     * @property {bolean} turnOffWheel toggle on or off a mousewheel event
     * @property {function} onScroll
     * @static
     */
	Miniscroll.Scroll.settings = {
		axis: "y",
		size: 10,
		sizethumb: "auto",
		scrollbarSize: "auto",
		thumbColor: "#e74c3c",
		trackerColor: "#e6e9ed",
		isKeyEvent: false,
		turnOffWheel: false,
		onScroll: function() {}
	};
	
	
	
	// add a constructor name
	//Miniscroll.Scroll.prototype.constructor = Miniscroll.Scroll;
	
	
	
	
	
	
	
	
	
	
	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */


	/**
	 * Miniscroll.Mouse The Mouse class is responsible for handling all aspects of mouse interaction with the browser.
	 *
	 * @class Miniscroll.Input
	 * @constructor
	 * @param {Miniscroll.Scroll} scroll - A reference to the currently running game.
	 */
	Miniscroll.Mouse = function(scroll) {
		/**
		 * @property {Miniscroll.Scroll} scroll - Reference to the scroll.
		 */
		this.scroll = scroll;
		
		/**
		 * @property {HTMLElement} _container - Reference to the container of scrollbar
		 * @private
		 */
		this._container = this.scroll.container;
		
		/**
		 * @property {HTMLElement} _thumb - Reference to the thumb of scrollbar
		 * @private
		 */
		this._thumb = this.scroll.thumb;
		
		/**
		 * @property {HTMLElement} _tracker - Reference to the tracker of scrollbar
		 * @private
		 */
		this._tracker = this.scroll.tracker;
		
	};
	
	Miniscroll.Mouse.prototype = {
		/**
		 * Starts the event listeners running.
		 * 
		 * @method Miniscroll.Mouse#start
		 */
		start: function () {
			
		},
		
		onMousePress: function(event) {},
		
		onMouseMove: function(event) {},
		
		onMouseRelease: function(event) {},
		
		/**
		 * Destroy all events
		 * 
		 * @method Miniscroll.Mouse#destroy
		 */
		destroy: function() {
		}
	};

	Miniscroll.Mouse.prototype.constructor = Miniscroll.Mouse;

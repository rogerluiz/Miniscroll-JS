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
	};
	
	Miniscroll.Mouse.prototype = {
		/**
		 * Starts the event listeners running.
		 * 
		 * @method Miniscroll.Mouse#start
		 */
		start: function () {},
		
		/**
		 * Destroy all events
		 * 
		 * @method Miniscroll.Mouse#destroy
		 */
		destroy: function() {
		}
	};

	Miniscroll.Mouse.prototype.constructor = Miniscroll.Mouse;

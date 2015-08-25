	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */


	/**
	 * Miniscroll.Input is the Input Manager for all types of Input, including mouse, keyboard and touch.
	 *
	 * @class Miniscroll.Input
	 * @constructor
	 * @param {Miniscroll.Scroll} scroll - A reference to the currently running game.
	 */
	Miniscroll.Input = function(scroll) {
		/**
		 * @property {Miniscroll.Scroll} scroll - Reference to the scroll.
		 */
		this.scroll = scroll;
		
		this.mouse = new Miniscroll.Mouse(this.scroll);
		this.touch = new Miniscroll.Touch(this.scroll);
	};

	Miniscroll.Input.prototype = {
		
		/**
		 * Initialize.
		 *
		 * @method Miniscroll.Input#init
		 * @protected
		 */
		init: function () {
			if (!Miniscroll.TOUCH_EVENTS) {
				this.mouse.start();
			} else {
				this.touch.start();
			}
		},
		
		update: function() {
		},
		
		/**
		 * Destroy all events
		 * 
		 * @method Miniscroll.Input#destroy
		 */
		destroy: function() {
			if (!Miniscroll.TOUCH_EVENTS) {
				this.mouse.destroy();
			} else {
				this.touch.destroy();
			}
		}
	};
	
	Miniscroll.Input.prototype.constructor = Miniscroll.Input;


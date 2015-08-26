	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */


	/**
	 * Miniscroll.Touch handles touch events with scroll.
	 *
	 * @class Miniscroll.Touch
	 * @constructor
	 * @param {Miniscroll.Scroll} scroll - A reference to the currently running game.
	 */
	Miniscroll.Touch = function(scroll) {
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

	Miniscroll.Touch.prototype = {
		 /**
		  * Starts the event listeners running.
		  * 
		  * @method Miniscroll.Touch#start
		  */
		 start: function () {},
		
		/**
		 * Destroy all events
		 * 
		 * @method Miniscroll.Touch#destroy
		 */
		destroy: function() {
		}
	};
	
	Miniscroll.Touch.prototype.constructor = Miniscroll.Touch;

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
	Miniscroll.Mouse = function(scroll)
    {
		/**
		 * @property {Miniscroll.Scroll} scroll - Reference to the scroll.
		 */
		this.scroll = scroll;

		this._settings = scroll.settings;

		this._target = scroll.target;

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

		/**
		 * @property {HTMLElement} _isScrolling - Check if is scrolling
		 */
		this.isScrolling = false;

		this.thumbDelta = new Miniscroll.Point(0, 0);
		this.thumbPos = new Miniscroll.Point(0, 0);
		this.percent = new Miniscroll.Point(0, 0);
	};
	
	Miniscroll.Mouse.prototype =
    {
		/**
		 * Starts the event listeners running.
		 * 
		 * @method Miniscroll.Mouse#start
		 */
		start: function ()
        {
			// Removing event listener whose callback function uses .bind
			// add this private function for working
			this._onMousePress = this.onMousePress.bind(this);
			this._onMouseMove = this.onMouseMove.bind(this);
			this._onMouseRelease = this.onMouseRelease.bind(this);

			//(/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
			this._thumb.addEventListener('mousedown', this._onMousePress, true);
		},
		
		onMousePress: function(event)
        {
			Miniscroll.Event.fix(event);
			Miniscroll.Event.preventDefault(event);

			//this._thumb.removeEventListener('mousedown', this._onMousePress, true);
			this.isScrolling = true;
			var mousePos = Miniscroll.Utils.pointer(event);
			
			this.thumbDelta = new Miniscroll.Point(this.thumbPos.x - mousePos.x, this.thumbPos.y - mousePos.y);
			
			document.addEventListener('mousemove', this._onMouseMove, false);
			document.addEventListener('mouseup', this._onMouseRelease, false);
		},
		
		onMouseMove: function(event)
        {
			Miniscroll.Event.fix(event);
			Miniscroll.Event.preventDefault(event);

			if (!this.isScrolling)
            {
				return false;
			}

			var mousePos = Miniscroll.Utils.pointer(event);

			this.thumbPos = new Miniscroll.Point(mousePos.x + this.thumbDelta.x, mousePos.y + this.thumbDelta.y);
			this.thumbPos = this.getMaxAndMin(this._container, this._thumb, this.thumbPos);

			this.percent = new Miniscroll.Point(
				this.thumbPos.x / (this._container.offsetWidth - this._thumb.offsetWidth),
				this.thumbPos.y / (this._container.offsetHeight - this._thumb.offsetHeight)
			);

			this.percent = new Miniscroll.Point(
				Math.max(0, Math.min(1, this.percent.x)),
				Math.max(0, Math.min(1, this.percent.y))
			);
			
			if (this._settings.axis === "y")
            {
				Miniscroll.Utils.setCss(this._thumb, { top: this.thumbPos.y });
				this._target.scrollTop = Math.round((this._target.scrollHeight - this._target.offsetHeight) * this.percent.y);
			}
            else
            {
				Miniscroll.Utils.setCss(this._thumb, { left: this.thumbPos.x });
				this._target.scrollLeft = Math.round((this._target.scrollWidth - this._target.offsetWidth) * this.percent.x);
			}
		},
		
		onMouseRelease: function(event)
        {
			Miniscroll.Event.fix(event);
			Miniscroll.Event.preventDefault(event);

			this.isScrolling = false;

			document.removeEventListener('mouseup', this._onMouseRelease, false);
			document.removeEventListener('mousemove', this._onMouseMove, false);
		},

		onMouseWheel: function(event)
		{
		},

		getMaxAndMin: function(container, thumb, pos)
		{
			var x = Math.max(0, Math.min(container.offsetWidth - thumb.offsetWidth, pos.x));
			var y = Math.max(0, Math.min(container.offsetHeight - thumb.offsetHeight, pos.y));
			return new Miniscroll.Point(x, y);
		},
		
		move: function(element, dir)
		{
		},

		normalizeWheelSpeed: function(event)
		{
			var normalized;

			if (event.wheelDelta)
			{
                normalized = (event.wheelDelta % 120)
            }
		},

		/**
		 * Destroy all events
		 * 
		 * @method Miniscroll.Mouse#destroy
		 */
		destroy: function()
        {
			this._thumb.removeEventListener('mousedown', this._onMousePress, false);
			document.removeEventListener('mouseup', this._onMouseRelease, false);
			document.removeEventListener('mousemove', this._onMouseMove, false);
		}
	};

	/*Object.defineProperty(Miniscroll.Mouse.prototype, "isScrolling", {
		get: function() {
			return this._isScrolling;
		},
		
		set: function(value) {
			if (value == false) {

			}
		}
	});*/

	Miniscroll.Mouse.prototype.constructor = Miniscroll.Mouse;

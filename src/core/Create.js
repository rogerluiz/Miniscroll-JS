	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */

	/**
	 * Destroy
	 * 
	 * @class Miniscroll.Destroy
	 * @constructor
	 */
	Miniscroll.Create = function(scroll) {
		/**
		 * @property {Miniscroll.Scroll} scroll - Reference to the scroll.
		 */
		this.scroll = scroll;
		//scroll.thumb = "asas";
		
		
		/**
		 * @property {string} prefix - Prefix name.
		 * @protected
		 */
		this.prefix = "miniscroll-";
		
		/**
		 * The id or class name od scrollbar target
		 * 
		 * @property {string} scrollName - Reference to the math helper.
		 */
		this.scrollName = "miniscroll";
		
		 /**
		  * @property {Miniscroll.Point} _scrollSize - Private internal var.
		  * @private
		  */
		this._scrollSize = new Miniscroll.Point(0, 0);
		
		/**
		 * @property {Miniscroll.Point} _scrollPos - Private internal var.
		 * @private
		 */
		this._scrollPos = new Miniscroll.Point(0, 0);
		
		/**
		 * @property {Miniscroll.Point} _trackerSize - Private internal var.
		 * @private
		 */
		this._trackerSize = new Miniscroll.Point(0, 0);
		
		/**
		  * @property {Miniscroll.Point} _thumbSize - Private internal var.
		  * @private
		  */
		this._thumbSize = new Miniscroll.Point(0, 0);
		
		/**
		 * @property {Miniscroll.Point} _offset - Private internal var.
		 * @private
		 */
		this._offset = new Miniscroll.Point(0, 0);
		
		/**
		 * @property {object} _settings - Reference to the 'Miniscroll.Scroll.settings'.
		 * @private
		 */
		this._settings = scroll.settings;
		
		/**
		 * @property {intiger} _topZindex - The top zindex.
		 * @private
		 */
		this._topZindex = Miniscroll.Utils.getZindex(scroll.target);
		
		return this;
	};
	
	Miniscroll.Create.prototype = {
		/**
		 * Initialize.
		 *
		 * @method Miniscroll.Create#boot
		 * @protected
		 */
		init: function (scroll) {
			this.addContainer();
			this.addTracker();
			this.addThumb();
		},
		
		/**
		 * Create a HTMLElement for the thumb and tracker.
		 *
		 * @method Miniscroll.Create#addContainer
		 * @protected
		 */
		addContainer: function() {
			/**
			 * Check if id exist
			 */
			var typeId = (this.scroll.target.getAttribute("id") !== null) ? true : false;
			
			/**
			 * Check if class exist
			 */
			var typeClass = (this.scroll.target.getAttribute("class") !== null) ? true : false;
			
			if (typeId) {
				this.scrollName = this.scroll.target.getAttribute("id");
			} else if (typeClass) {
				this.scrollName = this.scroll.target.getAttribute("class");
			}
			
			// create a empty HTMLElement for the scrollbar elements
			this.scroll.container = new Miniscroll.Utils.create(this.scroll.target, "div", {
				"id": this.prefix + this.scrollName,
				"class": this.prefix + "container"
			});
			
			// get the scrollbar width
			this._scrollSize.x = (this._settings.scrollbarSize != "auto") ? this._settings.scrollbarSize : new Miniscroll.Utils.offset(this.scroll.target).width;
			
			// get the scrollbar height
			this._scrollSize.y = (this._settings.scrollbarSize != "auto") ? this._settings.scrollbarSize : new Miniscroll.Utils.offset(this.scroll.target).height;
			
			// set the position X of scrollbar for default is on right
			this._scrollPos.x = new Miniscroll.Utils.offset(this.scroll.target).left + (this._scrollSize.x - this._settings.size);
			
			// set the position Y of scrollbar for default is on bottom
			this._scrollPos.y = new Miniscroll.Utils.offset(this.scroll.target).top + (this._scrollSize.y - this._settings.size);			
			
			Miniscroll.Utils.setCss(this.scroll.container, {
				position: "absolute",
				width: ((this._settings.axis == "x") ? this._scrollSize.x : this._settings.size) + "px",
				height: ((this._settings.axis == "y") ? this._scrollSize.y : this._settings.size) + "px",
				top: ((this._settings.axis == "y") ? new Miniscroll.Utils.offset(this.scroll.target).top : this._scrollPos.y) + "px",
				left: ((this._settings.axis == "x") ? new Miniscroll.Utils.offset(this.scroll.target).left : this._scrollPos.x) + "px",
				zIndex: this._topZindex
			});
		},
		
		/**
		 * Create tracker.
		 *
		 * @method Miniscroll.Create#addTracker
		 * @protected
		 */
		addTracker: function() {
			
			// create a empty HTMLElement for the scrollbar elements
			this.scroll.tracker = new Miniscroll.Utils.create(this.scroll.container, "div", {
				"class": this.prefix + "tracker"
			});
			
			this._trackerSize.x = (this._settings.axis === "x") ? Miniscroll.Utils.offset(this.scroll.container).width : this._settings.size;
			this._trackerSize.y = (this._settings.axis === "y") ? Miniscroll.Utils.offset(this.scroll.container).height : this._settings.size;
			
			Miniscroll.Utils.setCss(this.scroll.tracker, {
				width: this._trackerSize.x + "px",
				height: this._trackerSize.y + "px",
				backgroundColor: this._settings.trackerColor
			});
		},
		
		/**
		 * Create thumb.
		 *
		 * @method Miniscroll.Create#addThumb
		 * @protected
		 */
		addThumb: function() {
			
			// create a empty HTMLElement for the scrollbar elements
			this.scroll.thumb = new Miniscroll.Utils.create(this.scroll.container, "div", {
				"class": this.prefix + "thumb"
			});
			
			var containerOffset = Miniscroll.Utils.offset(this.scroll.container);
			var trackerOffset = Miniscroll.Utils.offset(this.scroll.tracker);
			
			this._offset.x = (containerOffset.width * trackerOffset.width) / this.scroll.target.scrollWidth;
			this._offset.y = (containerOffset.height * trackerOffset.height) / this.scroll.target.scrollHeight;
			
			this._thumbSize.x = (this._settings.sizethumb === 'auto') ? this._offset.x : this._settings.sizethumb;
			this._thumbSize.y = (this._settings.sizethumb === 'auto') ? this._offset.y : this._settings.sizethumb;
			
			Miniscroll.Utils.setCss(this.scroll.thumb, {
				position: "absolute",
				top: "0px",
				left: "0px",
				width: ((this._settings.axis === "x") ? this._thumbSize.x : this._settings.size) + "px",
				height: ((this._settings.axis === "y") ? this._thumbSize.y : this._settings.size) + "px",
				backgroundColor: this._settings.thumbColor
			});
			
		}
	};
	
	Miniscroll.Create.prototype.constructor = Miniscroll.Create;

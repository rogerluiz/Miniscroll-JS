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
		 * @property {object} _settings - Reference to the 'Miniscroll.Scroll.settings'.
		 * @private
		 */
		this._settings = this.scroll.settings;
		
		/**
		 * @property {intiger} _topZindex - The top zindex.
		 * @private
		 */
		this._topZindex = new Miniscroll.Utils.getZindex(this.scroll.target);
		
		return this;
	};
	
	Miniscroll.Create.prototype = {
		/**
		 * Initialize.
		 *
		 * @method Miniscroll.Create#boot
		 * @protected
		 */
		init: function () {
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
			this.scrollPos.x = new Miniscroll.Utils.offset(this.scroll.target).left + (this._scrollSize.x - this._settings.size);
			
			// set the position Y of scrollbar for default is on bottom
			this.scrollPos.y = new Miniscroll.Utils.offset(this.scroll.target).top + (this._scrollSize.y - this._settings.size);
			
			console.log(this._topZindex);
		},
		
		/**
		 * Create a HTMLElement for the thumb and tracker.
		 *
		 * @method Miniscroll.Create#addContainer
		 * @protected
		 */
		addTracker: function() {
			console.log("addTracker");
		},
		
		/**
		 * Create a HTMLElement for the thumb and tracker.
		 *
		 * @method Miniscroll.Create#addContainer
		 * @protected
		 */
		addThumb: function() {
			console.log("addThumb");
		}
	};

	/*
    	

    	this.setCss(this.container, {
			position: "absolute",
			//visibility: "hidden",
			width: ((this.settings.axis == "x") ? scrollWidth : this.settings.size) + "px",
			height: ((this.settings.axis == "y") ? scrollHeight : this.settings.size) + "px",
			top: ((this.settings.axis == "y") ? this.offset(this.target).top : scrollY) + "px",
			left: ((this.settings.axis == "x") ? this.offset(this.target).left : scrollX) + "px",
			zIndex: 999
    	});*/
	
	// add a constructor name
	//Miniscroll.Create.prototype.constructor = Miniscroll.Create;
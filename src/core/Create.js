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
		this.scroll = scroll;
		this.prefix = "miniscroll-";
		this.scrollName = "miniscroll";
		
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
			var typeId = (this.scroll.target.getAttribute("id") !== null) ? true : false;
			var typeClass = (this.scroll.target.getAttribute("class") !== null) ? true : false;
			
			if (typeId) {
				this.scrollName = this.scroll.target.getAttribute("id");
			} else if (typeClass) {
				this.scrollName = this.scroll.target.getAttribute("class");
			}
			
			this.scroll.container = new Miniscroll.Utils.create(this.scroll.target, "div", {
				"id": this.prefix + this.scrollName,
				"class": this.prefix + "container"
			});
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

	/*var miniscrollId = "mini";

    	if (this.target.getAttribute("id") != null) {
    		miniscrollId = this.target.getAttribute("id");
    	} else if (this.target.getAttribute("class") != null) {
    		miniscrollId = this.target.getAttribute("class");
    	}

    	this.container = this.create(this.target, "div", {
    		"class": "miniscroll-container",
    		"id": "miniscroll-" + miniscrollId
    	});


    	var scrollHeight = (this.settings.scrollbarSize != "auto") ? this.settings.scrollbarSize : this.offset(this.target).height;
    	var scrollWidth = (this.settings.scrollbarSize != "auto") ? this.settings.scrollbarSize : this.offset(this.target).width;
    	var scrollX = this.offset(this.target).left + (scrollWidth - this.settings.size);
    	var scrollY = this.offset(this.target).top + (scrollHeight - this.settings.size);

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
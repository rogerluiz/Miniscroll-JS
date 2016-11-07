/*!
 * Miniscroll small plugin of scrollbar desktop and mobile
 *
 * @author Roger Luiz <http://rogerluizm.com.br/>
 *                                          <http://miniscroll.rogerluizm.com.br>
 *
 * @copyright (c) 2011, 2012 <http://rogerluizm.com.br/>
 *
 * @version 1.3.0
 *       update 1.2.9 | 10/09/2013 - fix multidimensional scrollwheel
 *       update 1.2.9 | 10/09/2013 - fix error in the scroll when the position is relative or absolute
 *       update 1.2.9 | 10/09/2013 - fix updating on the x axis
 *       update 1.2.8 | 03/09/2013 - add turn off mousewheel, ex: { mousewheel: true }
 *       update 1.2.7 | 03/09/2013 - add scrollTo, now its posible scroll to a custom position
 *       update 1.2.6 | 21/06/2013 - fix bug the whole scrollbar (not just the handler part) moves down when I drag it.
 *       update 1.2.5 | 18/05/2013 - fix bug thumb position with arrow keys
 *       update 1.2.4 | 18/05/2013 - fix error it's time to catching the width and height
 *       update 1.2.3 | 18/05/2013 - fix scrollbar position "x"
 *       update 1.2.2 | 17/05/2013 - Key event added, now you can press the key down and key up for scrolling
 *       update 1.2.1 | 15/05/2013 - Touch event added, now works for ipad, iphone and android
 */

/**
TODO:
TODO:
TODO:
TODO:
*/
(function (window, document, prototype) {

	/**
	 * [ description]
	 * 
	 * @param  {Object}   obj - lista de um array
	 * @param  {Function} callback - função de retorno
	 * @return {void}
	 */
	Object.prototype.forEach = function (obj, callback) {
		for (prop in obj) {
			if (obj.hasOwnProperty(prop) && typeof obj[prop] !== "function") {
				callback(prop);
			}
		}
	};

	/**
	 * 
	 */
	if (typeof Array.prototype.indexOf !== "function") {
       Array.prototype.indexOf = function (item) {
          for(var i = 0; i < this.length; i++) {
             if (this[i] === item) {
                return i;
             }
          }
          return -1;
       };
    }

    /**
     * @constructor
     * 
     * @param {String || Element} selector Class, id ou elemento html ex: ".scroller", "#scroller"
     * @param {Object} options Lista de parametros
     *     options: {
     *         axis: "y",
     *         size: 5,
     *         sizethumb: "auto",
     *         thumbColor: "#0e5066",
     *         trackerColor: "#1a8bb2",
     *         isKeyEvent: false // default is true
     *     }
     */
	var Miniscroll = function (selector, options) {
		this.settings = {
			// axis of the scrollbar
			axis: "y",

			// the width of the scrollbar
			size: 10,

			// the width or height of the thumb
			sizethumb: "auto",

			// size of scrollbar, you can set a size fix to scrollbar
			scrollbarSize: "auto",

			// background color of the thumb
			thumbColor: "#e74c3c",

			// background color of the tracker
			trackerColor: "#e6e9ed",

			// Add arrow key event
			isKeyEvent: false,

			// toggle on or off a mousewheel event
			turnOffWheel: false
		};

		this.extend(this.settings, options);
		
		// scrollbar div element target
		this.target = this.getElement(selector);
		
		// scrollbar container
		this.container;
		// scrollbar tracker
		this.tracker;
		// scrollbar thumb
		this.thumb;
		
		//
		this.isScrolling = false;
		this.thumb_delta = new Point(0, 0);
		this.thumb_pos = new Point(0, 0);
		this.percent = new Point(0, 0);
		
		//
		this.positionType = this.getCss(this.target, 'position');

		this.init();
	},
        
    /**
     * Defines a cartesian pair of coordinates
     * 
     * @param  {[type]} x represents the horizontal axis
     * @param  {[type]} y represents the vertical axis
     * @return {[type]}   [description]
     */
    Point = function (x, y) {
        if (!(this instanceof Point)) {
			return new Point(x,y);
		}
		
		this.x = (!!x) ? x : 0;
		this.y = (!!y) ? y : 0;
        
        this.distance = function (p1, p2) {
			var xs = 0, ys = 0;

			xs = p2.x - p1.x;
			xs = xs * xs;

			ys = p2.y - p1.y;
			ys = ys * ys;

			return Math.sqrt(xs + ys);
        }

        return this;
    };

    // --------------------------------------------------------------
    // 
    // INIT
    // 
    // --------------------------------------------------------------


    /**
     * Start the scrollbar
     *
     * @see this.buildScrollbar();
     * @see this.buildScrollbarTracker();
     * @see this.buildScrolbarThumb();
     * @see this.setupHandlerEvent();
     * @see this.setupTouchEvent();
     * @see this.addKeyBoardEvent();
     * 
     * @return {void}
     */
	Miniscroll[prototype].init = function () {
		this.buildScrollbar();
		this.buildScrollbarTracker();
		this.buildScrolbarThumb();
		
		// add event handler
		this.setupHandlerEvent();
	};


	Miniscroll[prototype].destroy = function () 
	{
		// remove events and destroy 
	}
    
    
    // --------------------------------------------------------------
    // 
    // BUILD METHODS
    // 
    // --------------------------------------------------------------

    Miniscroll[prototype].buildScrollbar = function ()
    {
    	var miniscrollId = "mini";

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
    	});
    };

    /**
     * create scrollbar track
     * @return {[type]} [description]
     */
    Miniscroll[prototype].buildScrollbarTracker = function ()
    {
		this.tracker = this.create(this.container, "div", {
			"class" : "miniscroll-tracker"
		});

		var trackerWidth = (this.settings.axis === "x") ? this.offset(this.container).width : this.settings.size;
		var trackerHeight = (this.settings.axis === "y") ? this.offset(this.container).height : this.settings.size;

		this.setCss(this.tracker, {
			width: trackerWidth + "px",
			height: trackerHeight + "px",
			backgroundColor: this.settings.trackerColor
		});
    };

    /**
     * Create thumb for scrollbar
     * 
     * @return {void}
     */
    Miniscroll[prototype].buildScrolbarThumb = function ()
    {
		this.thumb = this.create(this.container, "div", {
			"class" : "miniscroll-thumb"
		});

		var offset = new Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var offset = new Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var thumbSize = new Point(
			(this.settings.sizethumb === 'auto') ? offset.x : this.settings.sizethumb,
			(this.settings.sizethumb === 'auto') ? offset.y : this.settings.sizethumb
		);

		this.setCss(this.thumb, {
			position: "absolute",
			top: "0px",
			left: "0px",
			width: ((this.settings.axis === "x") ? thumbSize.x : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? thumbSize.y : this.settings.size) + "px",
			backgroundColor: this.settings.thumbColor
		});
    };

    /**
     * Added 
     * 
     * @return {void}
     */
    Miniscroll[prototype].setupHandlerEvent = function ()
    {
		// add hanlder event
    	this.bind(this.thumb, "mousedown", this.onScrollPress);
    }

    // --------------------------------------------------------------
    // 
    // EVENT HANDLER METHODS
    // 
    // --------------------------------------------------------------
    

    Miniscroll[prototype].onScrollPress = function (event)
    {
    	event = event ? event : window.event;
    	this.preventEvent(event);

    	this.isScrolling = true;
		
		this.thumb_delta = Point(this.thumb_pos.x - this.mouse(event).x, this.thumb_pos.y - this.mouse(event).y);
		
		this.bind(document, "mousemove", this.onScrollMove);
		this.bind(document, "mouseup", this.onScrollRelease);
    }
	
	Miniscroll[prototype].onScrollMove = function (event)
    {
    	event = event ? event : window.event;
    	this.preventEvent(event);

    	if (!this.isScrolling) {
			return false;
		}
		
		this.thumb_pos = Point(this.mouse(event).x + this.thumb_delta.x, this.mouse(event).y + this.thumb_delta.y);

		this.thumb_pos = Point(
			Math.max( 0, Math.min(this.container.offsetWidth - this.thumb.offsetWidth, this.thumb_pos.x) ),
			Math.max( 0, Math.min(this.container.offsetHeight - this.thumb.offsetHeight, this.thumb_pos.y) )
		);

		this.percent = Point(
			this.thumb_pos.x / (this.container.offsetWidth - this.thumb.offsetWidth),
			this.thumb_pos.y / (this.container.offsetHeight - this.thumb.offsetHeight)
		);

		this.percent = Point(
			Math.max(0, Math.min(1, this.percent.x)),
			Math.max(0, Math.min(1, this.percent.y))
		);
		
		if (this.settings.axis === "y") {
			this.thumb.style.top = Math.round(this.thumb_pos.y) + 'px';
			this.target.scrollTop = Math.round((this.target.scrollHeight - this.target.offsetHeight) * this.percent.y);
		} else {
			this.thumb.style.left = Math.round(this.thumb_pos.x) + 'px';
			this.target.scrollLeft = Math.round((this.target.scrollWidth - this.target.offsetWidth) * this.percent.x);
		}
    }
	
	Miniscroll[prototype].onScrollRelease = function (event)
    {
    	event = event ? event : window.event;
    	this.preventEvent(event);
		
		this.isScrolling = false;
		
		this.unbind(document, "mousemove", this.onScrollMove);
		this.unbind(document, "mouseup", this.onScrollRelease);
    }


	// --------------------------------------------------------------
    // 
    // UTILS METHODS
    // 
    // --------------------------------------------------------------

	/**
	 * get the element usign a query selector
	 * 
	 * @param  {string|Element} selector  Query string or a element
	 * @return {Element}
	 */
	Miniscroll[prototype].getElement = function (selector)
	{
		var element = null;
		var $$ = this;


		if (selector === window || selector === document || selector === "body" || selector === "body, html")
		{
			return document.body;
		}

		// if the browser support querySelectorAll usign this
		if (document.querySelectorAll && typeof selector == "string")
		{
			return document.querySelectorAll(selector)[0];
		}

		// else the browser not support using a custom selector
		else
		{
			if (typeof selector === 'string' || selector instanceof String)
			{
				var token = selector.replace(/^\s+/, '').replace(/\s+$/, '');

				if (token.indexOf("#") > -1)
				{
					this.type = 'id';
					var match = token.split('#');

					element = document.getElementById(match[1]);
				}

				if (token.indexOf(".") > -1)
				{
					this.type = 'class';

					var match = token.split('.');
					var tags = document.getElementsByTagName('*');
					var len = tags.length;
					var found = [];
					var count = 0;

					for (var i = 0; i < len; i++)
					{
						if (tags[i].className && tags[i].className.match(new RegExp("(^|\\s)" + match[1] + "(\\s|$)")))
						{
							element = tags[i];
						}
					}
				}

				return element;
			}
			else
			{
				return selector;
			}
		}
	};

	/**
	 * Extend an object to another
	 * 
	 * @return {Object}
	 */
	Miniscroll[prototype].extend = function ()
	{
		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		
		return arguments[0];
	};

	/**
	 * Create an element and add attributes
	 * 
	 * @param  {Element} element - container for the new element
	 * @param  {string}  tagName - Type of the new element ex: (div, article, etc..)
	 * @param  {object}  attrs   - Atributes for the new element
	 * @return {Element}         - New element
	 */
	Miniscroll[prototype].create = function (element, tagName, attrs)
	{
		var tag = document.createElement(tagName);

		if (attrs) {
			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					tag.setAttribute(key, attrs[key]);
				}
			}

			element.appendChild(tag);
		}

		return tag;
	};

	/**
	 * Add css inline in the element
	 * 
	 * @param  {Element} element  - HTMLElement to be call
	 * @param  {Object} arguments - Group of parameters that defines the style element
	 * @return {void}
	 * 
	 * @example Miniscroll.css({ width : '200px' });
	 */
	Miniscroll[prototype].setCss = function (element, arguments)
	{
		for (var prop in arguments) {
			// the popacity hack
			if (prop === 'opacity') {
				element.style.filter = 'alpha(opacity=' + (arguments[prop] * 100) + ')';
				element.style.KhtmlOpacity = arguments[prop];
				element.style.MozOpacity = arguments[prop];
				element.style.opacity = arguments[prop];
			} else {
				element.style[prop] = arguments[prop];
			}
		}
	};

	/**
	 * Gets the value of a css property
	 * 
	 * @param  {Element} element - HTMLElement to be call
	 * @param  {string} property - CSS property to search
	 * @return {string|number}   - Returns the value of the css property searched
	 *
	 * @example Miniscroll.getCss(mydiv, "width");
	 */
	Miniscroll[prototype].getCss = function (element, property)
	{
		var result;

		if (!window.getComputedStyle) {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				result = document.defaultView.getComputedStyle.getPropertyValue(property);
			} else {
				if (element.currentStyle) {
					result = element.currentStyle[property];
				} else {
					result = element.style[property];
				}
			}
		} else {
			result = window.getComputedStyle(element).getPropertyValue(property);
		}

		return result;
	};

	/**
	 * Get the off values of the elemet, top, left, width and height
	 * 
	 * @param  {Element} element - HTMLElement to be call
	 * @return {Object}
	 *
	 * @example Miniscroll.offset(myele).top;
	 */
	Miniscroll[prototype].offset = function (element)
	{
		this.positionType = this.getCss(this.target, 'position');

		var style = new Point(
			(element.style.left == "") ? 0 : parseInt(element.style.left),
			(element.style.top == "") ? 0 : parseInt(element.style.top)
		);

		var top = (this.positionType == "relative") ? style.y : element.offsetTop;
		var left = (this.positionType == "relative") ? style.x : element.offsetLeft;
		var height = element.offsetHeight;
		var width = element.offsetWidth;

		if (typeof element.offsetHeight === "undefined")
		{
			height = parseInt(this.getCss(element, "height"));
		}
		
		if (typeof element.offsetWidth === "undefined")
		{
			width = parseInt(this.getCss(element, "width"));
		}

		return {
			top: top,
			left: left,
			width: width,
			height: height
		};
	};

	/**
	 * Returns the current mouse position
	 * 
	 * @param  {[type]} event - String type to event
	 * @return {Object}		  - Pair of coordinates
	 */
	Miniscroll[prototype].mouse = function (event)
	{
		var posx = 0, posy = 0;

		if (event.pageX || event.pageY)
		{
			posx = event.pageX;
			posy = event.pageY;
		}
		else if (event.clientX || event.clientY)
		{
			posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return new Point(posx, posy);
	};

	/**
	 * cross browser DOM event, check if you have the addEventListener property,
	 * if you add the event using the addEventListener method or goes to next check.
	 * if the method does not exist addEventListener us used attachEvent
	 * or elemeto.on[type]
	 * 
	 * @param  {Element}   element   - HTMLElement to be call the event listener
	 * @param  {String}    eventType - String type to event
	 * @param  {Function}  callback  - Function that contains the codes
	 * @return {void}
	 */
	Miniscroll[prototype].bind = function(element, eventType, callback)
	{
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		var $$ = this;

		if(element.addEventListener) {
			if( eventType === "mousewheel" ) {
				element.addEventListener(mousewheel, function(event) {
					callback.call($$, event, this);
				}, false);
			} else {
				element.addEventListener(eventType, function(event) {
					callback.call($$, event, this);
				}, false);
			}
		} else if (element.attachEvent) {
			element.attachEvent('on' + eventType, function(event) {
				callback.call($$, event, this);
			});
		} else {
			element['on' + eventType] = function(event) {
				callback.call($$, event, this);
			};
		}
	};

	/**
	 * cross browser DOM event, check if you have the addEventListener property,
	 * if you remove the event using the removeEventListener method or goes to next check.
	 * if the method does not exist addEventListener is used detachEvent 
	 * or elemeto.on[type] = null
	 * 
	 * @param  {Element}   element   - HTMLElement to be call the event listener
	 * @param  {String}    eventType - String type to event
	 * @param  {Function}  callback  - Function that contains the codes
	 * @return {void}
	 */
	Miniscroll[prototype].unbind = function(element, eventType, callback)
	{
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		var $$ = this;

		if (element.addEventListener) {
			if(eventType === "mousewheel") {
				element.removeEventListener(mousewheel, function(event) {
					callback.call($$, event, this);
				}, false);
			} else {
				element.removeEventListener(eventType, function(event) {
					callback.call($$, event, this);
				}, false);
			}
		} else if (element.attachEvent) {
			element.detachEvent('on' + eventType, function(event) {
				callback.call($$, event, this);
			});
		} else {
			element['on' + eventType] = null;
		}
	};

	/**
	 * Prevent default events
	 * 
	 * @param  {string} event - String type to event
	 * @return {void}
	 */
	Miniscroll[prototype].preventEvent = function (event)
	{
		if (event.preventDefault)
		{
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	};

	
	(function () {
		if (window.jQuery) {
			jQuery.fn.miniscroll = function (options) {
				return new Miniscroll(this, options);
			};
		}
	}());

	window.Miniscroll = Miniscroll;
})(window, document, "prototype");
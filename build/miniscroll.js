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
		
		/**
		 * Settigns of scrollbar
		 * 
		 * @constant
		 * @property {string} axis - of the scrollbar
		 * @property {number} size - the width of the scrollbar
		 * @property {number|string} sizethumb - the width or height of the thumb
		 * @property {number|string} scrollbarSize-  size of scrollbar, you can set a size fix to scrollbar
		 * @property {string} thumbColor - background color of the thumb
		 * @property {string} trackerColor - background color of the tracker
		 * @property {bolean} isKeyEvent - Add arrow key event
		 * @property {bolean} turnOffWheel - toggle on or off a mousewheel event
		 * @property {function} onScroll - function called on scroll event
		 * @static
		 */
		settings: {
			axis: "y",
			size: 10,
			sizethumb: "auto",
			scrollbarSize: "auto",
			thumbColor: "#e74c3c",
			trackerColor: "#e6e9ed",
			isKeyEvent: false,
			turnOffWheel: false,
			onScroll: function() {}
		}
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
		 * @type {HTMLElement}
		 */
		this.target = Miniscroll.Utils.get(selector);

		/**
		 * The container of scrollbar
		 * 
		 * @constant
		 * @type {HTMLElement}
		 */
		this.container = null;

		/**
		 * The thumb of scrollbar
		 * 
		 * @constant
		 * @type {HTMLElement}
		 */
		this.thumb = null;

		/**
		 * The tracker of scrollbar
		 * 
		 * @constant
		 * @type {HTMLElement}
		 */
		this.tracker = null;
		
		this.settings = Miniscroll.settings;
		
		// concat options and settings
		Miniscroll.Utils.concat(this.settings, options);
		console.log(this.target);
		
		this.create = new Miniscroll.Create(this);
		this.create.init();
		
	};
	
	
	
	// add a constructor name
	Miniscroll.Scroll.prototype.constructor = Miniscroll.Scroll;
	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */

	/**
	 * @class Miniscroll.Utils
	 * @static
	 */
	Miniscroll.Utils = {
		/**
		 * Gets the value of a css property
		 * 
		 * @method Miniscroll.Utils#getCss
		 * @param  {HTMLElement} element - HTMLElement to be call
		 * @param  {string} property - CSS property to search
		 * @return {*} Returns the value of the css property searched
		 *
		 * @example Miniscroll.Utils.getCss(element, property);
		 */
		getCss: function(element, property) {
			var result;
			
			if (!window.getComputedStyle) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					result = document.defaultView.getComputedStyle.getPropertyValue(property);
				} else {
					result = (element.currentStyle) ? element.currentStyle[property] : element.style[property];
				}
			} else {
				
				//result = window.getComputedStyle(element, null).getPropertyValue(property);
				result = window.getComputedStyle(element).getPropertyValue(property);
			}

			return result;
		},

		/**
		 * Add css inline in the element
		 * 
		 * @method Miniscroll.Utils#setCss
		 * @param  {HTMLElement} element - HTMLElement to be call
		 * @param  {object} arguments - Group of parameters that defines the style element
		 * @return {void}
		 * 
		 * @example Miniscroll.Utils.setCss({ width : '200px' });
		 */
		setCss: function(element, property) {
			for (var prop in property) {
				// the popacity hack
				if (prop === 'opacity') {
					element.style.filter = 'alpha(opacity=' + (property[prop] * 100) + ')';
					element.style.KhtmlOpacity = property[prop];
					element.style.MozOpacity = property[prop];
					element.style.opacity = property[prop];
				} else {
					if (prop === "marginLeft" || prop === "marginTop" || prop === "left" || prop === "top" || prop === "width" || prop === "height") {
						element.style[prop] = (typeof property[prop] === "string") ? property[prop] : property[prop] + "px";
					} else {
						element.style[prop] = property[prop];
					}
				}
			}
		},

		/**
		 * Get Element
		 * 
		 * @method Miniscroll.Utils#get
		 * @param  {string|element} selector - Query string or a element
		 * @return {HTMLElement} get the element usign a query selector
		 */
		get: function(selector) {
			var element = null;
			var self = this;

			if (selector === window || selector === document || selector === "body" || selector === "body, html") {
				return document.body;
			}

			// if the browser support querySelectorAll usign this
			if (document.querySelectorAll && typeof selector == "string") {
				return document.querySelectorAll(selector)[0];
			} else { // else the browser not support using a custom selector
				if (typeof selector === 'string' || selector instanceof String) {
					var token = selector.replace(/^\s+/, '').replace(/\s+$/, '');

					if (token.indexOf("#") > -1) {
						this.type = 'id';
						var match = token.split('#');

						element = document.getElementById(match[1]);
					}

					if (token.indexOf(".") > -1) {
						this.type = 'class';

						var match = token.split('.');
						var tags = document.getElementsByTagName('*');
						var len = tags.length;
						var found = [];
						var count = 0;

						for (var i = 0; i < len; i++) {
							if (tags[i].className && tags[i].className.match(new RegExp("(^|\\s)" + match[1] + "(\\s|$)"))) {
								element = tags[i];
							}
						}
					}

					return element;
				} else {
					return selector;
				}
			}
		},
		
		/**
		 * Create an element and add attributes
		 * 
		 * @method Miniscroll.Utils#create
		 * @param  {HTMLElement} element - container for the new element
		 * @param  {string} tagName - Type of the new element ex: (div, article, etc..)
		 * @param  {object} attrs - Atributes for the new element
		 * @return {HTMLElement} New HTMLElement
		 */
		create: function(element, tagName, attrs) {
			
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
		},


		/**
		 * Offset
		 * 
		 * @method Miniscroll.Utils#offset
		 * param {HTMLElement} element - HTMLElement to be call
		 * 
		 */
		offset: function(element) {
			var positionType = Miniscroll.Utils.getCss(element, 'position');

			var style = new Miniscroll.Point(
				(element.style.left == "") ? 0 : parseInt(element.style.left),
				(element.style.top == "") ? 0 : parseInt(element.style.top)
			);

			var top = (positionType == "relative") ? style.y : element.offsetTop;
			var left = (positionType == "relative") ? style.x : element.offsetLeft;
			var height = element.offsetHeight;
			var width = element.offsetWidth;

			if (typeof element.offsetHeight === "undefined") {
				height = parseInt(Miniscroll.Utils.getCss(element, "height"));
			}

			if (typeof element.offsetWidth === "undefined") {
				width = parseInt(Miniscroll.Utils.getCss(element, "width"));
			}

			return {
				top: top,
				left: left,
				width: width,
				height: height
			};
		},

		/**
		 * Returns the current mouse position
		 * 
		 * @method Miniscroll.Utils#pointer
		 * @param  {event} event - String type to event
		 * @return {Miniscroll.Point} Pair of coordinates
		 */
		pointer: function(event) {
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

			return new Miniscroll.Point(posx, posy);
		},
		
		/**
		 * Extend a object to other
		 * 
		 * @method Miniscroll.Utils#extend
		 * @return {object} list of parameters
		 */
		concat: function() {
			for (var i = 1; i < arguments.length; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						arguments[0][key] = arguments[i][key];
					}
				}
			}

			return arguments[0];
		},
		
		/**
		 * Get the highest z-index
		 * 
		 * @method Miniscroll.Utils#getZindex
		 * @return {intiger} the highest z-index
		 */
		getZindex: function(target) {
			/**
			 * @property {interger} topZIndex - the highest 'z-index'
			 * @protected
			 */
			var topZIndex = 0;
			
			/**
			 * @property {interger} zIndex - the z-index
			 * @protected
			 */
			var zIndex = 0;
			
			/**
			 * @property {interger} scroll - Get original 'position' property
			 * @protected
			 */
			var pos = 0;
			
			/**
			 * @property {HTMLElement|Array} tags - Get all HTMLElements inside the 'target'
			 * @protected
			 */
			var tags = target.getElementsByTagName('*');
			
			for (var i = 0; i < tags.length; i++) {
				// Get the original 'position' property
				pos = Miniscroll.Utils.getCss(tags[i], "position");
				
				// Set it temporarily to 'relative'
				tags[i].style.position = "relative";
				
				// Grab the z-index
				zIndex = Number(Miniscroll.Utils.getCss(tags[i], "z-index"));
				
				// Reset the 'position'
				tags[i].style.position = pos;
				
				if (zIndex > topZIndex) {
					topZIndex = zIndex + 1;
				}
			}
			
			return topZIndex;
		}
		
	};



	/**
	 * @class Miniscroll.Point
	 * 
	 * @param  {number} x represents the horizontal axis
	 * @param  {number} y represents the vertical axis
	 * @return {object}   Defines a cartesian pair of coordinates
	 * 
	 * @use new Miniscroll.Point(x, y)
	 */
	Miniscroll.Point = function (x, y) {
		if (!(this instanceof Miniscroll.Point)) {
			return new Miniscroll.Point(x,y);
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

	Miniscroll.Point.prototype.constructor = Miniscroll.Point;
	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */

	/**
	 * @class Miniscroll.Event
	 * @static
	 */
	Miniscroll.Event = {
		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.on
		 * @param  {HTMLElement} element - HTMLElement to be call the event listener
		 * @param  {string} type - The type of event
		 * @param  {function} callback - Function that contains the codes
		 * @param  {Miniscroll} root - Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.on(element, eventType, callback, this);
		 */
		on: function(element, type, callback, root) {
			var self = root;
			var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

			if (element.addEventListener)
			{
				if (type === "mousewheel" )
				{
					element.addEventListener(mousewheel, function(event) {
						callback.call(self, event, this);
					}, false);
				}
				else
				{
					element.addEventListener(type, function(event) {
						callback.call(self, event, this);
					}, false);
				}
			}
			else if (element.attachEvent)
			{
				element.attachEvent('on' + type, function(event) {
					callback.call(self, event, this);
				});
			}
			else
			{
				element['on' + type] = function(event) {
					callback.call(self, event, this);
				};
			}
		},

		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.off
		 * @param  {HTMLElement} element - HTMLElement to be call the event listener
		 * @param  {string} type - The type of event
		 * @param  {function} callback - Function that contains the codes
		 * @param  {Miniscroll} root - Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.off(element, eventType, callback, root);
		 */
		off: function(element, type, callback, root) {
			var self = root;
			var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

			if (element.addEventListener)
			{
				if(type === "mousewheel") {
					element.removeEventListener(mousewheel, function(event) {
						callback.call(self, event, this);
					}, false);
				} else {
					element.removeEventListener(type, function(event) {
						callback.call(self, event, this);
					}, false);
				}
			}
			else if (element.attachEvent)
			{
				element.detachEvent('on' + type, function(event) {
					callback.call(self, event, this);
				});
			}
			else
			{
				element['on' + type] = null;
			}
		},

		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},

		/**
		 * Name
		 * 
		 * @method Miniscroll.Event.mousewheel
		 * @param  {HTMLElement} element - HTMLElement to be call the event listener
		 * @param  {function} callback - Function that contains the codes
		 * @param  {Miniscroll} root - Reference to the current miniscroll instance
		 * @return {void}
		 *
		 * @example Miniscroll.Event.mousewheel(element, callback, this);
		 */
		mousewheel: function(element, callback, root) {
		}
	};
	/**
	 * @author       Roger Luiz <rogerluizm@gmail.com>
	 * @copyright    2015 Roger Luiz Ltd.
	 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
	 */

	/**
	 * Update
	 * 
	 * @class Miniscroll.Update
	 * @constructor
	 */
	Miniscroll.Update = function() {
		// code here for update staffs
	};
	
	// add a constructor name
	//Miniscroll.Update.prototype.constructor = Miniscroll.Update;
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
	Miniscroll.Destroy = function() {
		// code here for destroy/cancel/remove staffs
	};
	
	// add a constructor name
	Miniscroll.Destroy.prototype.constructor = Miniscroll.Destroy;
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
		this._topZindex = Miniscroll.Utils.getZindex(this.scroll.target);
		
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
	
	// add a constructor name
	//Miniscroll.Create.prototype.constructor = Miniscroll.Create;
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
		this.scroll = scroll;
	};
	
	Miniscroll.Mouse.prototype = {
		 /**
		  * Starts the event listeners running.
		  * 
		  * @method Miniscroll.Mouse#start
		  */
		 start: function () {}
	};

	Miniscroll.Mouse.prototype.constructor = Miniscroll.Mouse;
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
		this.scroll = scroll;
	};

	Miniscroll.Touch.prototype = {
		 /**
		  * Starts the event listeners running.
		  * 
		  * @method Miniscroll.Touch#start
		  */
		 start: function () {}
	};
	
	Miniscroll.Touch.prototype.constructor = Miniscroll.Touch;
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
		this.scroll = scroll;
	};
	
	Miniscroll.Input.prototype.constructor = Miniscroll.Input;
	(function () {
		if (window.jQuery) {
			jQuery.fn.miniscroll = function (options) {
				return new Miniscroll.Scroll(this, options);
			};
		}
	}());
	
	window.Miniscroll = Miniscroll;
})(window, document);
/**
 * @copyright    2015 Roger Luiz Ltd.
 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
 */

// ES6 Math.trunc - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
if (!Math.trunc) {
    Math.trunc = function trunc(x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    };
}

/**
 * A polyfill for Function.prototype.bind
 */
if (!Function.prototype.bind) {

    /* jshint freeze: false */
    Function.prototype.bind = (function () {

        var slice = Array.prototype.slice;

        return function (thisArg) {

            var target = this, boundArgs = slice.call(arguments, 1);

            if (typeof target !== 'function') {
                throw new TypeError();
            }

            function bound() {
                var args = boundArgs.concat(slice.call(arguments));
                target.apply(this instanceof bound ? this : thisArg, args);
            }

            bound.prototype = (function F(proto) {
                if (proto)  {
                    F.prototype = proto;
                }

                if (!(this instanceof F)) {
                    /* jshint supernew: true */
                    return new F;
                }
            })(target.prototype);

            return bound;
        };
    })();
}

/**
 * A polyfill for Array.isArray
 */
if (!Array.isArray)
{
    Array.isArray = function (arg)
    {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}

/**
 * A polyfill for Array.forEach
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisArg */)
    {
        "use strict";

        if (this === void 0 || this === null)
        {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        if (typeof fun !== "function")
        {
            throw new TypeError();
        }

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

        for (var i = 0; i < len; i++)
        {
            if (i in t)
            {
                fun.call(thisArg, t[i], i, t);
            }
        }
    };
}

/**
 * A polyfill for Array.indexOf
 */
if (typeof Array.prototype.indexOf !== "function")
{
   Array.prototype.indexOf = function (item)
   {
	   "use strict";

		for(var i = 0; i < this.length; i++)
		{
			if (this[i] === item)
			{
				return i;
			}
		}
	   
		return -1;
   };
}

/**
 * Also fix for the absent console in IE9
 */
if (!window.console)
{
    window.console = {};
    window.console.log = window.console.assert = function(){};
    window.console.warn = window.console.assert = function(){};
}
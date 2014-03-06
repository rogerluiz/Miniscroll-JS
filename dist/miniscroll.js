/*!
 * Miniscroll small plugin of scrollbar desktop and mobile
 *
 * @author Roger Luiz <http://rogerluizm.com.br/>
 *					  <http://miniscroll.rogerluizm.com.br>
 *
 * @copyright (c) 2011, 2012 <http://rogerluizm.com.br/>
 *
 * @version 1.2.9
 *		update 1.2.9 | 10/09/2013 - fix multidimensional scrollwheel
 *		update 1.2.9 | 10/09/2013 - fix error in the scroll when the position is relative or absolute
 *		update 1.2.9 | 10/09/2013 - fix updating on the x axis
 *		update 1.2.8 | 03/09/2013 - add turn off mousewheel, ex: { mousewheel: true }
 *		update 1.2.7 | 03/09/2013 - add scrollTo, now its posible scroll to a custom position
 *		update 1.2.6 | 21/06/2013 - fix bug the whole scrollbar (not just the handler part) moves down when I drag it.
 *		update 1.2.5 | 18/05/2013 - fix bug thumb position with arrow keys
 * 		update 1.2.4 | 18/05/2013 - fix error it's time to catching the width and height
 * 		update 1.2.3 | 18/05/2013 - fix scrollbar position "x"
 * 		update 1.2.2 | 17/05/2013 - Key event added, now you can press the key down and key up for scrolling
 * 		update 1.2.1 | 15/05/2013 - Touch event added, now works for ipad, iphone and android
 */
(function(window, document, prototype) {
	var config = {
		touchEvents: ('ontouchstart' in document.documentElement)
	},
	
	/**
	 * @constructor
	 * 
	 * @param { String || Element } selector Class, id ou elemento html ex: ".scroller", "#scroller"
	 * @param { Object } options Lista de parametros
	 *     options: {
     *         axis: "y",
	 *		   size: 5,
	 *		   sizethumb: "auto",
	 *		   thumbColor: "#0e5066",
	 *		   trackerColor: "#1a8bb2",
	 *		   isKeyEvent: false // default is true
	 *	   }
	 */
	Miniscroll = function (selector, options) {
		this.type = "";
		this.is = "static";
		this.target = this.getElement(selector);
		this.container;
		this.tracker;
		this.thumb;
		this.thumb_delta = Point(0, 0);
		this.thumb_pos = Point(0, 0);
		this.touch = Point(0, 0);
		this.settings = options;
		this.percent;
		this.keypos_thumb = Point(0, 0);
		this.scrolling = false;
		this.preventScrolling = false;
		this.turnOffWheel = true;

		this.initializing();
	},
	
	/**
	 * Point
	 * https://github.com/jbmonroe
	 * 
	 * @param  {number} x - [description]
	 * @param  {number} y - [description]
	 * @return {number}   Return an object with 2 points
	 */
	Point = function (x, y) {
		if (!(this instanceof Point)) {
			return new Point(x,y);
		}
		
		this.x = (!!x) ? x : 0;
		this.y = (!!y) ? y : 0;
		
		return this;
	};

	/**
	 * Inicia o miniscroll
	 *
	 * @see this.buildScrollbar();
	 * @see this.buildScrollbarTracker();
	 * @see this.buildScrolbarThumb();
	 * @see this.setupEventHandler();
	 * @see this.setupTouchEvent();
	 * @see this.addKeyBoardEvent();
	 */
	Miniscroll[prototype].initializing = function () {
		// Cria o container do scrollbar
		this.buildScrollbar();

		// Cria o tracker do scrollbar
		this.buildScrollbarTracker();

		// Cria o thumb do scrollbar
		this.buildScrolbarThumb();

		// Verifica se isKeyEvent é true ou false ou se foi setado, caso não adiciona o default
		this.settings.isKeyEvent = (typeof this.settings.isKeyEvent === "undefined") ? true : this.settings.isKeyEvent;
		
		this.turnOffWheel = (typeof this.settings.turnOffWheel === "undefined") ? this.turnOffWheel : this.settings.turnOffWheel;

		// Se isKeyEvent for true então configura e adiciona o evento de tecla (keypress)
		if (this.settings.isKeyEvent) this.addKeyBoardEvent();

		// Verifica se o device atual suporta touch event e adiciona o evento adequado
		(!config.touchEvents) ? this.setupEventHandler() : this.setupTouchEvent();

		// verifica as mudanças no scroll
		var _this = this;
		window.setInterval(function() {
			_this.update();
		}, 10);
	};

	/**
	 * Create the scrollbar container
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].buildScrollbar = function () {
		
		// Verifico se existe um id no target ou classe para o id do container
		var idname = (this.target.id) ? this.target.id : this.target.className;

		// Cria o container e adiciona a classe e o id
		this.container = this.create(this.target, "div", {
			"class" : "miniscroll-container",
			"id" : "miniscroll-" + idname
		});

		var scrollHeight = (this.settings.scrollbarSize) ? this.settings.scrollbarSize : this.offset(this.target).height;
		var scrollWidth = (this.settings.scrollbarSize) ? this.settings.scrollbarSize : this.offset(this.target).width;
		var scrollX = this.offset(this.target).left + (this.offset(this.target).width - this.settings.size);
		var scrollY = this.offset(this.target).top + (this.offset(this.target).height - this.settings.size);


		// Adiciona o css
		this.css(this.container, {
			position: "absolute",
			visibility: "hidden",
			width: ((this.settings.axis === "x") ? scrollWidth : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? scrollHeight : this.settings.size) + "px",
			top: ((this.settings.axis === "y") ? this.offset(this.target).top : scrollY) + "px",
			left: ((this.settings.axis === "x") ? this.offset(this.target).left : scrollX) + "px",
			zIndex: 999
		});
	};

	/**
	 * Create the tracker and added to scrollbar container
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].buildScrollbarTracker = function () {
		this.tracker = this.create(this.container, "div", {
			"class" : "miniscroll-tracker"
		});

		var trackerWidth = (this.settings.axis === "x") ? this.offset(this.container).width : this.settings.size;
		var trackerHeight = (this.settings.axis === "y") ? this.offset(this.container).height : this.settings.size;
		
		this.css(this.tracker, {
			width: trackerWidth + "px",
			height: trackerHeight + "px",
			backgroundColor: this.settings.trackerColor ? this.settings.trackerColor : "#067f41"
		});
	};

	/**
	 * Create the thumb and added to scrollbar container
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].buildScrolbarThumb = function () {
		this.thumb = this.create(this.container, "div", {
			"class" : "miniscroll-thumb"
		});

		var offset = Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var offset = Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var thumbSize = Point(
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.x : this.settings.sizethumb,
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.y : this.settings.sizethumb
		);

		this.css(this.thumb, {
			position: "absolute",
			top: 0 + "px",
			left: 0 + "px",
			width: ((this.settings.axis === "x") ? thumbSize.x : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? thumbSize.y : this.settings.size) + "px",
			backgroundColor: this.settings.thumbColor ? this.settings.thumbColor : "#2AD47D"
		});
	};

	/**
	 * Setup the handler events
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].setupEventHandler = function () {
		this.bind(this.thumb, "mousedown", this.onScrollThumbPress);
        this.bind(this.tracker, 'mousedown', this.onScrollTrackerPress);

        if (this.turnOffWheel)
        {
        	this.bind(this.target, 'mousewheel', this.onScrollThumbWheel);
        }
	};

	/**
	 * Setup touch events
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].setupTouchEvent = function () {
		this.bind(this.target, "touchstart", this.onScrollTouchStart);
		this.bind(this.target, "touchmove", this.onScrollTouchMove);
	};

	/**
	 * Check if the target is static, relative or absolute
	 * and update the position of the container
	 *
	 * @this {Miniscroll}
	 */
	Miniscroll[prototype].updateContainerPosition = function () {
		this.is = this.getCss(this.target, 'position');
        //console.log(this.is)
		if (this.is === "relative" || this.is === "absolute") {
			if (this.settings.axis === "y") {
				this.container.style.top = this.target.scrollTop + "px";
				this.container.style.left = (this.offset(this.target).width - this.settings.size) + "px";
			} else {
				this.container.style.top = (this.offset(this.target).height - this.settings.size) + "px";
				this.container.style.left = this.target.scrollLeft + "px";
			}
		} else {
            if (this.settings.axis === "y") {
				this.container.style.top = this.offset(this.target).top + "px";
			} else {
				this.container.style.left = this.offset(this.target).left + "px";
			}
		}
	}

	/**
	 * Update thumb position
	 *
	 * @this {Miniscroll}
	 * @param {number} percent - value of the percent position of scrollTop
	 */
	Miniscroll[prototype].setScrubPosition = function(percent) {
		var container_width = this.offset(this.container).width,
			container_height = this.offset(this.container).height;

		var thumb_width = this.offset(this.thumb).width,
			thumb_height = this.offset(this.thumb).height;

		this.thumb_pos = Point( 
			Math.round((container_width - thumb_width) * percent), 
			Math.round((container_height - thumb_height) * percent)
		);

		if(this.settings.axis === 'y') {
			this.thumb.style.top = Math.round(this.thumb_pos.y) + 'px';
		} else {
			this.thumb.style.left = Math.round(this.thumb_pos.x) + 'px';
		}
	}


	//=============================
	// EVENT HANDLERS
	//=============================
    
    /**
     * Add keyboard event
     *
     * @this {Miniscroll}
     */
	Miniscroll[prototype].addKeyBoardEvent = function () {
		this.target.setAttribute("tabindex", "-1");
		this.css(this.target, { "outline": "none" });
		
		this.bind(this.target, "focus", function (event, el) {
            if (!('onkeydown' in el) && ('onkeydown' in document)) {
                el = document;
            }
			this.bind(el, "keydown", function (event) {
				if (event.target != this.target) {return;} // Avoid to block form related elements

				var keyCode = event.keyCode || event.which,
     				arrow = { left: 37, up: 38, right: 39, down: 40 },
     				arrowPressed = true,
     				finalKey;

				switch (keyCode) {
					case arrow.up:
						if (this.percent !== 0) this.keypos_thumb.y -= 10;
						break;

					case arrow.down:
						if (this.percent !== 1) this.keypos_thumb.y += 10;
						break;

					case arrow.left:
						if (this.percent !== 0) this.keypos_thumb.x -= 10;
						break;

					case arrow.right:
						if (this.percent !== 1) this.keypos_thumb.x += 10;
						break;

					default:
						arrowPressed = false;
				}

				if(this.settings.axis === 'y') {
					this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
					this.setScrubPosition(this.percent);
					this.target.scrollTop = this.keypos_thumb.y;
					finalKey = [38,40]
				} else {
					this.percent = this.target.scrollLeft / (this.target.scrollWidth - this.target.offsetWidth);
					this.setScrubPosition(this.percent);
					this.target.scrollLeft = this.keypos_thumb.x;
					finalKey = [37,39]
				}

				if ((this.percent >= 1 && keyCode == finalKey[1]) || (this.percent <= 0 && keyCode == finalKey[0])) {
					this.preventScrolling = true;
				} else {
					this.preventScrolling = false;
				}

				if (!this.preventScrolling && arrowPressed) this.stopEvent(event);

				this.updateContainerPosition();
			});
		});

		this.bind(this.target, "click", function (event, el) {
			if (event.target != this.target) {return;} // Avoid to block form related elements

            try {
                document.activeElement = el;
            } catch (err) {}			
			el.focus();
		});
	};
    
    
    /**
     * Add touch start event
     * set the start position and bind the touch end event
     *
     * @this {Miniscroll}
     */
	Miniscroll[prototype].onScrollTouchStart = function (event) {
		var touches = event.touches[0];

		this.scrolling = true;
		this.touch = Point(touches.pageX, touches.pageY);

		this.bind(this.target, "touchend", this.onScrollTouchEnd);
	};
    
    /**
     * Add touch move event
     * uodate the position and the end value of the position
     *
     * @this {Miniscroll}
     */
	Miniscroll[prototype].onScrollTouchMove = function (event) {
		var touches = event.touches[0];

		// override the touch event’s normal functionality
		event.preventDefault();

		var touchMoved = Point(this.touch.x - touches.pageX, this.touch.y - touches.pageY);
		this.touch = Point(touches.pageX, touches.pageY);


		if (this.settings.axis === "y") {
			this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
			this.setScrubPosition(this.percent);
			this.target.scrollTop = this.target.scrollTop + touchMoved.y;
		} else {
			this.percent = this.target.scrollLeft / (this.target.scrollWidth - this.target.offsetWidth);
			this.setScrubPosition(this.percent);
			this.target.scrollLeft = this.target.scrollLeft + touchMoved.x;
		}

		this.updateContainerPosition();
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].onScrollTouchEnd = function (event) {
		this.scrolling = false;
		this.unbind(this.target, "touchend", this.onScrollTouchEnd);
	};
    
    /**
     * [ description]
     * 
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
	Miniscroll[prototype].onScrollThumbPress = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		this.scrolling = true;
		this.thumb_delta = Point(this.thumb_pos.x - this.mouse(event).x, this.thumb_pos.y - this.mouse(event).y);

		this.bind(document, "mousemove", this.onScrollThumbUpdate);
		this.bind(document, "mouseup", this.onScrollThumbRelease);

		this.updateContainerPosition();
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].onScrollThumbUpdate = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		if (!this.scrolling) return false;

		this.thumb_pos = Point(
			this.mouse(event).x + this.thumb_delta.x,
			this.mouse(event).y + this.thumb_delta.y
		);

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

		this.keypos_thumb = Point(this.target.scrollLeft, this.target.scrollTop);

		this.updateContainerPosition();
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].onScrollThumbWheel = function (event) {
		event = event ? event : window.event;
		
		// if (!this.preventScrolling) this.stopEvent(event);

		var orgEvent = event || window.event, 
			args = [].slice.call(arguments, 1), 
			delta = 0, 
			returnValue = true, 
			deltaX = 0, 
			deltaY = 0,
			finalDelta;
		
		// Old school scrollwheel delta
		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta/120;
		}

		if (orgEvent.detail) {
			delta = -orgEvent.detail/3;
		}
		
		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;
		deltaX = delta;
		
		// Gecko (17 and above)
		if (!!orgEvent.deltaMode) {
		    deltaY = -orgEvent.deltaY/3;
		    deltaX = -orgEvent.deltaX/3;
		}

		// Gecko (16 and earlier)
		if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
		    deltaY = 0;
		    deltaX = -1 * delta;
		}
		
		// Webkit
		if (orgEvent.wheelDeltaY !== undefined) {
			deltaY = orgEvent.wheelDeltaY / 120;
		}
		
		if (orgEvent.wheelDeltaX !== undefined) {
			deltaX = -1 * orgEvent.wheelDeltaX / 120;
		}

		if (this.settings.axis === 'y') {
			this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
			this.setScrubPosition(this.percent);
			this.target.scrollTop = Math.round(this.target.scrollTop - (deltaY * 10));
			finalDelta = deltaY;
		} else {
			this.percent = this.target.scrollLeft / (this.target.scrollWidth - this.target.offsetWidth);
			this.setScrubPosition(this.percent);
			this.target.scrollLeft = Math.round(this.target.scrollLeft - (deltaX * 10));
			finalDelta = deltaX;
		}
		
		if ((this.percent >= 1 && finalDelta < 0) || (this.percent <= 0 && finalDelta > 0) || finalDelta == 0) {
			this.preventScrolling = true;
		} else {
			this.preventScrolling = false;
		}
		
		// caso seja multidimensional adiciona o prevent scroll
		// if (orgEvent.wheelDeltaY !== undefined) {
        	// this.preventScrolling = true;
        // }

        if (!this.preventScrolling) this.stopEvent(event);

		this.keypos_thumb = Point(this.target.scrollLeft, this.target.scrollTop);

		this.updateContainerPosition();
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].onScrollThumbRelease = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		this.scrolling = false;

		this.unbind(document, "mousemove", this.onScrollThumbUpdate);
		this.unbind(document, "mouseup", this.onScrollThumbRelease);
	};
	
	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].onScrollTrackerPress = function (event) {
	    var mouseY = this.mouse(event).y - this.offset(this.container).top;
	    //console.log("as");
        this.scrolling = true;

	    this.scrollTo(mouseY);
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].scrollTo = function (value) {
	     var scrollY =  Math.max(0, Math.min(this.offset(this.target).height - this.offset(this.thumb).height, value));

         if(this.settings.axis === 'y') {
			this.thumb_pos.y = scrollY; 
			this.thumb.style.top = Math.round(this.thumb_pos.y) + "px";

			this.target.scrollTop = scrollY;

			this.scrolling = false;
         }
	};

	/**
	 * Update the scrollbar
	 * 
	 * @return {void}
	 */
	Miniscroll[prototype].update = function () {
		if (this.settings.axis === 'y') {
        	if (this.target.scrollHeight === this.offset(this.target).height) {
                this.css(this.container, { "visibility": "hidden" });
            } else {
                this.css(this.container, { "visibility": "visible" })
            }
        } else {
        	if (this.target.scrollWidth === this.offset(this.target).width) {
                this.css(this.container, { "visibility": "hidden" });
            } else {
                this.css(this.container, { "visibility": "visible" })
            }
        }

		// Atualiza o tamanho e a posição do container do scrollbar
		var scrollHeight = (this.settings.scrollbarSize) ? this.settings.scrollbarSize : this.offset(this.target).height;
		var scrollWidth = (this.settings.scrollbarSize) ? this.settings.scrollbarSize : this.offset(this.target).width;
		var scrollX = this.offset(this.target).left + (this.offset(this.target).width - this.settings.size);
		var scrollY = this.offset(this.target).top + (this.offset(this.target).height - this.settings.size);


		// Adiciona o css
		this.css(this.container, {
			width: ((this.settings.axis === "x") ? scrollWidth : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? scrollHeight : this.settings.size) + "px",
			top: ((this.settings.axis === "y") ? this.offset(this.target).top : scrollY) + "px",
			left: ((this.settings.axis === "x") ? this.offset(this.target).left : scrollX) + "px",
		});

		// Atualiza o tamanho do tracker
		var trackerWidth = (this.settings.axis === "x") ? this.offset(this.container).width : this.settings.size;
		var trackerHeight = (this.settings.axis === "y") ? this.offset(this.container).height : this.settings.size;

		this.css(this.tracker, {
			width: trackerWidth + "px",
			height: trackerHeight + "px"
		});

		// Atualiza o tamanho do thumb
		var offset = Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var thumbSize = Point(
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.x : this.settings.sizethumb,
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.y : this.settings.sizethumb
		);
		this.css(this.thumb, {
			width: ((this.settings.axis === "x") ? thumbSize.x : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? thumbSize.y : this.settings.size) + "px"
		});

		// Reposiciona o thumb de acordo com o a posição scrollTop ou scrollLeft
		if (this.settings.axis === 'y') {
			this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
			
			if (!this.scrolling) {
				this.setScrubPosition(this.percent);
			}
		} else {
			this.percent = this.target.scrollLeft / (this.target.scrollWidth - this.target.offsetWidth);
			
			if (!this.scrolling) {
				this.setScrubPosition(this.percent);
			}
		}

		this.updateContainerPosition();
	};

	//=============================
	// UTILS METHODS
	//=============================

   
	/**
	 * Pega um seletor css e retorna um elemento html
	 * 
	 * @param  {String|Element} selector [description]
	 * @return {Element}
	 */
	Miniscroll[prototype].getElement = function (selector) {
		var element, $ = this;

		// Verifica se o seletor é window, document ou body caso seja retorna document.body
		if (selector === window || selector === document || selector === "body" || selector === "body, html") {
			return document.body;
		}

		// Se o seletor for uma string verifica se essa string é um id ou uma classe
		// e retorna um elemento html
		if (typeof selector === 'string' || selector instanceof String) {
			var token = selector.replace(/^\s+/, '').replace(/\s+$/, ''), element;
			
			if (token.indexOf("#") > -1) {
				this.type = 'id';
				var match = token.split('#');
				element = document.getElementById( match[1] );
			}
			
			if (token.indexOf(".") > -1) {
				this.type = 'class';
				var match = token.split('.'),
					tags = document.getElementsByTagName('*'),
					len = tags.length, found = [], count = 0;
					
				
				for (var i = 0; i < len; i++) {
					if (tags[i].className && tags[i].className.match(new RegExp("(^|\\s)" + match[1] + "(\\s|$)"))) {
						element = tags[i];
					}
				}
			}
			
			return element;
		}
		// Se o seletor for um elemento html retorno ele mesmo
		else {
			return selector;
		}
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} element [description]
	 * @param  {[type]} tagName [description]
	 * @param  {[type]} attrs   [description]
	 * @return {[type]}         [description]
	 */
	Miniscroll[prototype].create = function (element, tagName, attrs) {
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
     * Adiciona style inline ao elemento
     *
     * @param { object } arguments Grupo de paramentros que define o estilo do elemento
     * @example Miniscroll.css({ width : '200px' });
     */
	Miniscroll[prototype].css = function (element, arguments) {
        for (var prop in arguments) {
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
     * Pega o valor de uma propriedade css
     *
     * @param { Element } element Element html
     * @param { String } Propriedade css
     *
     * @example Miniscroll.getCss(mydiv, "width");
     *
     * @return Retorna o valor de uma propriedade css
     */
    Miniscroll[prototype].getCss = function (element, property) {
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
     * [ description]
     * 
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    Miniscroll[prototype].offset = function (element) {
		var top = element.offsetTop,
		left = element.offsetLeft;

		var height = element.offsetHeight;
		if (typeof element.offsetHeight === "undefined") {
			height = parseInt(this.getCss(element, "height"));
		}

		var width = element.offsetWidth;
		if (typeof element.offsetWidth === "undefined") {
			width = parseInt(this.getCss(element, "width"));
		}
		
		return { top: top, left: left, width: width, height: height };
	};

    /**
	 * Returna a posição atual do mouse
	 *
	 * @param { Event } event Evento de mouse
	 * @return Retorna a posição x e y do mouse
	 */
	Miniscroll[prototype].mouse = function (event) {
		var posx = 0, posy = 0;

		if (event.pageX || event.pageY) {
			posx = event.pageX;
			posy = event.pageY;
		}
		else if (event.clientX || event.clientY) {
			posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		
		return { x: posx, y: posy };
	};


    /**
	 * Bind Event
	 *
	 * cross browser DOM evento, verifica se tem a propriedade addEventListener, se tiver
	 * adiciona o evento usando o metodo addEventListener ou segue para proxima 
	 * verificação. se não existir o metodo addEventListener é utilizado o attachEvent ou elemeto.on[type]
	 *
	 * @this {Miniscroll}
	 *
	 * @param {Element} selector HTMLElement to be call the event listener
	 * @param {string} type String type to event
	 * @param {Function} callBack Function that contains the codes
	 */
	Miniscroll[prototype].bind = function(element, eventType, callback) {
		var mousewheel = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
						 document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
						 "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
		var _this = this;

		
		//callback.call(this, event, $);
		if(element.addEventListener) {
			if( eventType === "mousewheel" ) {
				element.addEventListener(mousewheel, function(event) {
					callback.call(_this, event, this);
				}, false);
			} else {
				element.addEventListener(eventType, function(event) {
					callback.call(_this, event, this);
				}, false);
			}
		} else if (element.attachEvent) {
			element.attachEvent('on' + eventType, function(event) {
				callback.call(_this, event, this);
			});
		} else {
			element['on' + eventType] = function(event) {
				callback.call(_this, event, this);
			};
		}
	};
	
	/**
	 * Unbind Event 
	 * cross browser DOM evento, verifica se tem a propriedade addEventListener se tiver
	 * remove o evento usando o metodo removeEventListener ou segue para a próxima 
	 * verificação. se não existir o metodo addEventListener é utilizado o detachEvent ou elemeto.on[type] = null
	 *
	 * @this {Miniscroll}
	 *
	 * @param {Element} selector HTMLElement to be call the event listener
	 * @param {string} type String type to event
	 * @param {Function} callBack Function that contains the codes
	 */
	Miniscroll[prototype].unbind = function(element, eventType, callback) {
		var mousewheel = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
						 document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
						 "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
		
		if (element.addEventListener) {
			if(eventType === "mousewheel") {
				element.removeEventListener(mousewheel, function(event) {
					callback.call(_this, event, this);
				}, false);
			} else {
				element.removeEventListener(eventType, function(event) {
					callback.call(_this, event, this);
				}, false);
			}
		} else if (element.attachEvent) {
			element.detachEvent('on' + eventType, function(event) {
				callback.call(_this, event, this);
			});
		} else {
			element['on' + eventType] = null;
		}
	};

	/**
	 * [ description]
	 * 
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Miniscroll[prototype].stopEvent = function (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	};

	window.Miniscroll = Miniscroll;
})(window, document, "prototype");

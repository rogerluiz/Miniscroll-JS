/*!
 * Miniscroll small plugin of scrollbar desktop and mobile
 *
 * @author Roger Luiz <http://rogerluizm.com.br/>
 *					  <http://miniscroll.rogerluizm.com.br>
 *
 * @copyright (c) 2011, 2012 <http://rogerluizm.com.br/>
 *
 * @version 1.2.4
 * 		update 1.2.1 | 15/05/2013 - Touch evento adicionado, agora funciona para ipad, iphone e android 
 * 		update 1.2.2 | 17/05/2013 - Adicionado key event, setas do teclado tanto para cima quando para baixo
 * 		update 1.2.3 | 18/05/2013 - scrollbar horizontal e vertical atualizado fixbug posição "x"
 * 		update 1.2.4 | 18/05/2013 - fixbug scrollbar, estava dando um erro na hora de pegar a altura ou largura
 */
(function(window, document) {
	var config = {
		touchEvents: ('ontouchstart' in document.documentElement)
	},
	
	/**
	 * @constructor
	 * 
	 * @param { String || Element } selector Class, id ou elemento html ex: ".scroller", "#scroller"
	 * @param { Object } options Lista de parametros
	 *					 { axis: "y",
	 *		               size: 5,
	 *		               sizethumb: "auto",
	 *		               thumbColor: "#0e5066",
	 *		               trackerColor: "#1a8bb2",
	 *		               isKeyEvent: false // default is true
	 *		             }
	 */
	Miniscroll = function (selector, options) {
		this.type = "";
		this.is = "static";
		this.target = this.getElement(selector);
		this.container;
		this.tracker;
		this.thumb;
		this.thumb_delta = new Point(0, 0);
		this.thumb_pos = new Point(0, 0);
		this.touch = new Point(0, 0);
		this.settings = options;
		this.percent;
		this.keypos_thumb = new Point(0, 0);
		this.scrolling = false;
		this.preventScrolling = false;

		this.initializing();
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
	Miniscroll.prototype.initializing = function () {
		// Cria o container do scrollbar
		this.buildScrollbar();

		// Cria o tracker do scrollbar
		this.buildScrollbarTracker();

		// Cria o thumb do thumb
		this.buildScrolbarThumb();

		// Verifica se keyEvent é true ou false ou se foi setado, caso não adiciona o default
		this.settings.isKeyEvent = (typeof this.settings.isKeyEvent === "undefined") ? true : this.settings.isKeyEvent;
		
		// Se isKeyEvent for true então configura e adiciona o evento de tecla (keypress)
		if (this.settings.isKeyEvent) this.addKeyBoardEvent();

		// Verifica se o device atual suporta touch event e adiciona o evento adequado
		(!config.touchEvents) ? this.setupEventHandler() : this.setupTouchEvent();

		// inicia o update do scrollbar, faz um interval e verifica as mudanças no scroll
		var _this = this;
		window.setInterval(function() {
			_this.update();
		}, 10);
	};

	/**
	 * Cria o conteiner do scrollbar
	 */
	Miniscroll.prototype.buildScrollbar = function () {
		
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
	 * Cria o tracker do scrollbar e adiciona no container
	 */
	Miniscroll.prototype.buildScrollbarTracker = function () {
		this.tracker = this.create(this.container, "div", {
			"class" : "miniscroll-tracker"
		});

		var trackerWidth = (this.settings.axis === "x") ? this.offset(this.container).width : this.settings.size;
		var trackerHeight = (this.settings.axis === "y") ? this.offset(this.container).height : this.settings.size;
		console.log(this.offset(this.target).height)
		this.css(this.tracker, {
			width: trackerWidth + "px",
			height: trackerHeight + "px",
			backgroundColor: this.settings.trackerColor ? this.settings.trackerColor : "#067f41"
		});
	};

	/**
	 * Cria o thumb do scrollbar e adiciona no container
	 */
	Miniscroll.prototype.buildScrolbarThumb = function () {
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
	 * Inicia o evento do scrollbar adiciona "mousedown" e "mousewheel"
	 */
	Miniscroll.prototype.setupEventHandler = function () {
		this.bind(this.thumb, "mousedown", this.onScrollThumbPress);
		this.bind(this.target, 'mousewheel', this.onScrollThumbWheel);
	};

	/**
	 * Inicia dos eventos de touch "touchstart" e "touchmove"
	 */
	Miniscroll.prototype.setupTouchEvent = function () {
		this.bind(this.target, "touchstart", this.onScrollTouchStart);
		this.bind(this.target, "touchmove", this.onScrollTouchMove);
	};

	/**
	 * Verifica se a posição do target é statica, relativa ou absoluta
	 */
	Miniscroll.prototype.updateContainerPosition = function () {
		this.is = this.getCss(this.target, 'position');

		if (this.is === "relative" || this.is === "absolute") {
			if (this.settings.axis === "y") {
				this.container.style.top = this.target.scrollTop + "px";
			} else {
				this.container.style.left = this.target.scrollLeft + "px";
			}
		}
	}

	/**
	 * Adiciona a posição em que o scrub tem que esta
	 *
	 * @param { Number } percent Valor que diz qual a porcentagem atual da rolagem
	 */
	Miniscroll.prototype.setScrubPosition = function(percent) {
		var container_width = this.offset(this.container).width,
			container_height = this.offset(this.container).height;

		var thumb_width = this.offset(this.thumb).width,
			thumb_height = this.offset(this.thumb).height;

		this.thumb_pos = new Point( 
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

	Miniscroll.prototype.addKeyBoardEvent = function () {
		this.target.setAttribute("tabindex", "-1");
		this.css(this.target, { "outline": "none" });
		
		this.bind(this.target, "focus", function (event, el) {
			var delta = 0;
			this.bind(el, "keydown", function (event) {
				var keyCode = event.keyCode || event.which,
     				arrow = { left: 37, up: 38, right: 39, down: 40 };

				switch (keyCode) {
					case arrow.up:
						if (this.percent !== 0) delta -= 10;
						break;

					case arrow.down:
						if (this.percent !== 1) delta += 10;
						break;
				}

				if(this.settings.axis === 'y') {
					this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
					this.setScrubPosition(this.percent);
					this.target.scrollTop = delta;
				}

				if (this.percent >= 1 || this.percent <= 0) {
					this.preventScrolling = true;
				} else {
					this.preventScrolling = false;
				}

				this.updateContainerPosition();
			});
		});

		this.bind(this.target, "click", function (event, el) {
			document.activeElement = el;
			
			el.focus();
		});
	};

	Miniscroll.prototype.onScrollTouchStart = function (event) {
		var touches = event.touches[0];

		this.scrolling = true;
		this.touch = new Point(touches.pageX, touches.pageY);

		this.bind(this.target, "touchend", this.onScrollTouchEnd);
	};

	Miniscroll.prototype.onScrollTouchMove = function (event) {
		var touches = event.touches[0];

		// override the touch event’s normal functionality
		event.preventDefault();

		var touchMoved = new Point(this.touch.x - touches.pageX, this.touch.y - touches.pageY);
		this.touch = new Point(touches.pageX, touches.pageY);


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

	Miniscroll.prototype.onScrollTouchEnd = function (event) {
		this.scrolling = false;
		this.unbind(this.target, "touchend", this.onScrollTouchEnd);
	};

	Miniscroll.prototype.onScrollThumbPress = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		this.scrolling = true;
		this.thumb_delta = new Point(this.thumb_pos.x - this.mouse(event).x, this.thumb_pos.y - this.mouse(event).y);

		this.bind(document, "mousemove", this.onScrollThumbUpdate);
		this.bind(document, "mouseup", this.onScrollThumbRelease);

		this.updateContainerPosition();
	};

	Miniscroll.prototype.onScrollThumbUpdate = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		if (!this.scrolling) return false;

		this.thumb_pos = new Point(
			this.mouse(event).x + this.thumb_delta.x,
			this.mouse(event).y + this.thumb_delta.y
		);

		this.thumb_pos = new Point(
			Math.max( 0, Math.min(this.container.offsetWidth - this.thumb.offsetWidth, this.thumb_pos.x) ),
			Math.max( 0, Math.min(this.container.offsetHeight - this.thumb.offsetHeight, this.thumb_pos.y) )
		);

		this.percent = new Point(
			this.thumb_pos.x / (this.container.offsetWidth - this.thumb.offsetWidth),
			this.thumb_pos.y / (this.container.offsetHeight - this.thumb.offsetHeight)
		);

		this.percent = new Point(
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

		this.updateContainerPosition();
	};

	Miniscroll.prototype.onScrollThumbWheel = function (event) {
		event = event ? event : window.event;
		
		if (!this.preventScrolling) this.stopEvent(event);

		var orgEvent = event || window.event, 
			args = [].slice.call(arguments, 1), 
			delta = 0, 
			returnValue = true, 
			deltaX = 0, 
			deltaY = 0;
		
		// Old school scrollwheel delta
		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta/120;
		}

		if (orgEvent.detail) {
			delta = -orgEvent.detail/3;
		}
		
		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;
		
		// Gecko
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

		if(this.settings.axis === 'y') {
			this.percent = this.target.scrollTop / (this.target.scrollHeight - this.target.offsetHeight);
			this.setScrubPosition(this.percent);
			this.target.scrollTop = Math.round(this.target.scrollTop - (delta * 10));
		} else {
			this.percent = this.target.scrollLeft / (this.target.scrollWidth - this.target.offsetWidth);
			this.setScrubPosition(this.percent);
			this.target.scrollLeft = Math.round(this.target.scrollLeft - (delta * 10));
		}

		if (this.percent >= 1 || this.percent <= 0) {
			this.preventScrolling = true;
		} else {
			this.preventScrolling = false;
		}

		this.updateContainerPosition();
	};

	Miniscroll.prototype.onScrollThumbRelease = function (event) {
		event = event ? event : window.event;
		this.stopEvent(event);

		this.scrolling = false;

		this.unbind(document, "mousemove", this.onScrollThumbUpdate);
		this.unbind(document, "mouseup", this.onScrollThumbRelease);
	};

	Miniscroll.prototype.update = function () {
		
		if (this.target.scrollHeight === this.offset(this.target).height) {
			this.css(this.container, { "visibility": "hidden" });
		} else {
			this.css(this.container, { "visibility": "visible" })
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
		var offset = new Point(
			(this.offset(this.container).width * this.offset(this.tracker).width) / this.target.scrollWidth,
			(this.offset(this.container).height * this.offset(this.tracker).height) / this.target.scrollHeight
		);

		var thumbSize = new Point(
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.x : this.settings.sizethumb,
			(this.settings.sizethumb === undefined || this.settings.sizethumb === 'auto') ? offset.y : this.settings.sizethumb
		);
		this.css(this.thumb, {
			width: ((this.settings.axis === "x") ? thumbSize.x : this.settings.size) + "px",
			height: ((this.settings.axis === "y") ? thumbSize.y : this.settings.size) + "px"
		});

		// Reposiciona o thumb de acordo com o a posição scrollTop ou scrollLeft
		if(this.settings.axis === 'y') {
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
	}

	//=============================
	// UTILS METHODS
	//=============================

	/**
	 * Pega um seletor css e retorna um elemento html
	 *
	 * @param { String | Element } selector
	 */
	Miniscroll.prototype.getElement = function (selector) {
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
		// Aqui verifico se o seletor é um objeto jQuery se for retorno um objeto html
		else if (selector instanceof jQuery) {
			return selector[0];
		} 
		// Se o seletor for um elemento html retorno ele mesmo
		else {
			return selector;
		}
	};

	Miniscroll.prototype.create = function (element, tagName, attrs) {
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
     *
     */
	Miniscroll.prototype.css = function (element, arguments) {
        for ( var prop in arguments) {
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
    Miniscroll.prototype.getCss = function (element, property) {
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

    Miniscroll.prototype.offset = function (element) {
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
	Miniscroll.prototype.mouse = function (event) {
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
	Miniscroll.prototype.bind = function(element, eventType, callback) {
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
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
	Miniscroll.prototype.unbind = function(element, eventType, callback) {
		var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		
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

	Miniscroll.prototype.stopEvent = function (event) {
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
})(window, document);


var Point = (function() {
		
	Point.prototype.x = 0;
	Point.prototype.y = 0;


	function Point(x, y) {
		this.x = x != null ? x : 0;
		this.y = y != null ? y : 0;
	}


	Point.prototype.reset = function() {
		this.x = 0;
		this.y = 0;

		return this;
	};

	/**
	 * Pega a distancia entre dois items diferentes
	 *
	 * @param { Element } b Item para a comparação
	 */
	Point.prototype.distanceTo = function( b ) {
		var x;
			x = b.x - this.x;
			x = x * x;
		var y;
			y = b.y - this.y;
			y = y * y;

		return Math.sqrt( x + y ); 
	};

	/**
	 * Pega a angle entre dois items diferentes
	 *
	 * @param { Element } b Item para a comparação
	 */
	Point.prototype.angleTo = function( b ) {
		var x = this.x - b.x,
			y = this.y - b.y;
		
		return Math.atan2( x, y );
	};

	return Point;
})();
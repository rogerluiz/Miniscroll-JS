/**
 * Scrollbar javascript
 *
 * @author	Roger Luiz (mail@rogerluizm.com.br);
 *			miniscroll.rogerluizm.com.br
 *			miniscroll.rogerluizm.com.br/docs/index.html
 *
 * @size 22.11.2011
 *		24.11.2011 (added hide and show scrollbar)
 *		06.12.2011 (bug touchEvent corrected)
 *		06.12.2011 (added easing animation of touch scroll)
 * 		12.01.2012 (added cross browser parentElem)
 *		09.02.2012 (update plugin and remove bugs of IE)
 *
 * @version	1.1v
 * @copyright (c) 2011
 */
var miniscroll = {
    /**
     * Content hold to element
     * @type {Element}
     */
    content:null,
    
    /**
     * Current element selection
     * @type {Element}
     */
    current:null,
    
    /**
     * Tracker element scrollbar
     * @type {Element}
     */
    tracker:null,
    
    /**
     * Scrub element scrollbar
     * @type {Element}
     */
    scrub:null,
    
    /**
     * Contains all argumments
     * @type {Element}
     */
    args:{},
    
    /**
     * Axis direction for the scrollbar
     * @type {string}
     */
    axis:"",
    
    /**
     * Contains the positon min and max the x, y, width, height
     * @type {Object}
     */
    scrollRect:{},
    
    /**
     * If drag stop false else true
     */
    dragging:false,
    
    /**
     * Positon x and y
     * @type {Object}
     */
    startPos:{},
    
    /**
     * Positon x and y of the touch scroll
     * @type {Object}
     */
    touchPos:{},
    
    /**
     * Set the interval of animation
     * @type {Function}
     */
    setTimeInterval:null,
    
    /**
     * Function the animation init
     * @type {Function}
     */
    animInt:null,
    
    /**
     * Size of the scrub and tracker bar, the size is width or height
     * @type {number}
     */
    size:10,
    
    /**
     * Contains the target of current touch element
     * @type {Element}
     */
    targetTouch:null,
    
    /**
     * Set the interval of a update scroll
     * @type {Function}
     */
    interval:null,
    
    /**
     * Time counter
     * @type {number}
     */
    count:0,
    
    /**
     * Start position of the animation scroll x and y
     * @type {Object}
     */
    startPos: {},
    
    /**
     * The last position of the animation scroll x and y
     * @type {Object}
     */
    lastPos: {},
    
    /**
     * Speed of the animation of scroll
     * @type {number}
     */
    speed: 0,

    /**
    * Initializing scrollbar
    *
    * @type {Element} el Content hold to element
    * @type {Object} args It contains the all argumments for de scrollbar
    */
    init: function (el, args) {
        this.content = get_id(el);
        this.args = args;
        this.size = (args.size === undefined) ? 10 : args.size;
        this.addMiniScroll(this.content);
        
        if(this.isMiniTouchDevice()) {
        	this.addMiniEvent(this.content, 'touchstart', this.startTouch);
        } else {
        	this.addMiniEvent(this.content, 'mousewheel', this.wheelEvent);
        	this.addMiniEvent(this.scrub, 'mousedown', this.startEvent);
        }
        
        var eles = [this.content, this.tracker, this.scrub];
        this.setTimeInterval = window.setInterval(function(){
        	miniscroll.updateScroll(miniscroll.args.scroll, eles, miniscroll.size);
        }, 100);
    },
    
    /**
     * Update the scrollbar
     *
     * @type {Element} axis Position move of the scrollbar
     * @type {Element} obj Content hold to elements
     * @type {Element} size Size of width and height
     */
    updateScroll:function(axis, obj, size){
    	if(axis == "x"){
    		miniscroll.updateMiniScroll(obj, "x", size);
    		
    		(obj[1].offsetWidth == obj[2].offsetWidth) ? miniscroll.hide(obj[1], obj[2]) : miniscroll.show(obj[1], obj[2]);
    	} else {
    		miniscroll.updateMiniScroll(obj, "y", size);
    		
    		(obj[1].offsetHeight == obj[2].offsetHeight) ? miniscroll.hide(obj[1], obj[2]) : miniscroll.show(obj[1], obj[2]);
    	}
    },
   	
    /**
     * Hide the scroll when the scrub and tracker they will be equal
     *
     * @type {Element} tracker Elements tracker
     * @type {Element} scrub Elements scrub
     */
    hide:function(tracker, scrub){
    	tracker.style.visibility = "hidden";
    	scrub.style.visibility = "hidden";
    },
    
    /**
     * Show the scroll when the scrub will be different of tracker
     *
     * @type {Element} tracker Elements tracker
     * @type {Element} scrub Elements scrub
     */
    show:function(tracker, scrub){
    	tracker.style.visibility="visible";
    	scrub.style.visibility="visible";
    },
    
    //-------------------------------------------
    // EVENTS TOUCH
    //-------------------------------------------
    
    /**
     * Start touch event
     */
    startTouch:function(e){
    	var mini = miniscroll;
    	
    	if(mini.animInt != null) clearInterval(mini.animInt);
    	
    	mini.touchPos = {x:this.scrollLeft + e.touches[0].clientX, y:this.scrollTop + e.touches[0].clientY};
    	
    	mini.getCurrent(this);
    	mini.getAxis(mini.tracker);
    	mini.targetTouch = e.targetTouches[0].target;
    	
    	count = 0;
    	interval = setInterval(function(){ count++; }, 200);
    	
    	mini.addMiniEvent(this, 'touchmove', mini.moveTouch);
    	mini.addMiniEvent(this, 'touchend', mini.stopTouch);
    	mini.preventEvent(e);
    },
    
    /**
     * Move touch event
     */
    moveTouch:function(e){
    	var mini = miniscroll;
    	var offset = {x:this.scrollWidth - this.offsetWidth, y:this.scrollHeight - this.offsetHeight};
    	var scrollOffset = {x:mini.tracker.offsetWidth - mini.scrub.offsetWidth, y:mini.tracker.offsetHeight - mini.scrub.offsetHeight};
    	var pos = {x:(this.scrollLeft / offset.x) * scrollOffset.x, y:(this.scrollTop / offset.y) * scrollOffset.y};
    	
    	mini.lastPos = {x:mini.startPos.x, y:mini.startPos.y};
    	mini.startPos = {x:mini.touchPos.x - e.touches[0].clientX, y:mini.touchPos.y - e.touches[0].clientY};
    	mini.speed = {x:mini.startPos.x - mini.lastPos.x, y:mini.startPos.y - mini.lastPos.y};
    	
    	if(mini.axis == "x"){
    		this.scrollLeft = mini.touchPos.x - e.touches[0].clientX;
    		mini.scrub.style.left = (pos.x+this.offsetLeft) + "px";
    	} else {
    		this.scrollTop = mini.touchPos.y - e.touches[0].clientY;
    		mini.scrub.style.top = (pos.y+this.offsetTop) + "px";
    	}
    	
    	mini.preventEvent(e);
    },
    
    /**
     * Stop touches events
     */
    stopTouch:function(e){
    	var mini = miniscroll;
    	mini.animInt = setInterval(function() {
    		var offset = {x:mini.current.scrollWidth - mini.current.offsetWidth, y:mini.current.scrollHeight - mini.current.offsetHeight};
    		var scrollOffset = {x:mini.tracker.offsetWidth - mini.scrub.offsetWidth, y:mini.tracker.offsetHeight - mini.scrub.offsetHeight};
    		var pos = {x:(mini.current.scrollLeft / offset.x) * scrollOffset.x, y:(mini.current.scrollTop / offset.y) * scrollOffset.y};
    		
    		var old = {x:mini.current.scrollLeft, y:mini.current.scrollTop};
    		var currentPos = {x:old.x + mini.speed.x, y:old.y + mini.speed.y};
    		mini.speed = {x:mini.speed.x * .96, y:mini.speed.y * .96};
    		
    		if(mini.axis == "x"){
    			mini.current.scrollLeft = currentPos.x;
    			mini.scrub.style.left = (pos.x+mini.current.offsetLeft) + "px";
    			
    			if(mini.speed == 0) {
    				clearInterval(mini.animInt);
    			}
    		} else {
    			mini.current.scrollTop = currentPos.y;
    			document.getElementById("trace").innerHTML = mini.current.scrollTop;
    			mini.scrub.style.top = (pos.y+mini.current.offsetTop) + "px";
    			
    			if(mini.speed == 0) {
    				clearInterval(mini.animInt);
    			}
    		}
    	}, 30);
    	
    	mini.removeMiniEvent(this, 'touchmove', mini.moveTouch);
    	mini.removeMiniEvent(this, 'touchend', mini.moveTouch);
    	
    	clearInterval(interval);
    	if(count < 1) { mini.dispatchMiniEvent(e, mini.targetTouch); }
    },

    //-------------------------------------------
    // EVENTS HANDLER
    //-------------------------------------------

    /**
    * Start event the scrollbar
    */
    startEvent: function (e) {
        var mini = miniscroll;
        var evt = window.event ? window.event : e;
        var obj = window.event ? e.srcElement : e.target;

        var parentElem = obj.parentElement;
        if (!parentElem) { parentElem = obj.parentNode; }

        mini.getCurrent(parentElem);
        mini.getAxis(mini.tracker);
        mini.dragging = true;

        var o = mini.current;
        var s = mini.scrub;
        var t = mini.tracker;
        var pos = mini.getMouseCords(e);

        mini.startPos = { x: pos.x - parseInt(s.style.left), y: pos.y - parseInt(s.style.top) };

        if (mini.axis === "x") {
            mini.scrollRect = { x: o.offsetLeft, y: 0, width: t.offsetWidth + o.offsetLeft - s.offsetWidth, height: 0 };
        } else {
            mini.scrollRect = { x: 0, y: o.offsetTop, width: 0, height: t.offsetHeight + o.offsetTop - s.offsetHeight };
        }

        mini.addMiniEvent(document, 'mousemove', mini.moveEvent);
        mini.addMiniEvent(document, 'mouseup', mini.stopEvent);

        mini.preventEvent(evt);
    },

    /**
    * Move event
    */
    moveEvent: function (e) {
        var mini = miniscroll;

        if (mini.dragging) {
            var evt = window.event ? window.event : e;
            var pos = mini.getMouseCords(e);
            var o = mini.current; 
            var s = mini.scrub; 
            var t = mini.tracker;
            var value = { x: pos.x - mini.startPos.x, y: pos.y - mini.startPos.y };
            var offset = { x: (value.x / s.offsetWidth) * s.offsetWidth, y: (value.y / s.offsetHeight) * s.offsetHeight };
            var maxOffset = { x: (t.offsetWidth - s.offsetWidth) + o.offsetLeft, y: (t.offsetHeight - s.offsetHeight) + o.offsetTop };

            if (mini.axis === "x") {
                if (offset.x <= o.offsetLeft) {
                    s.style.left = o.offsetLeft + 'px';
                } else if (offset.x >= maxOffset.x) {
                    s.style.left = maxOffset.x + 'px';
                } else {
                    s.style.left = offset.x + 'px';
                }

                o.scrollLeft = mini.getScrollTo("x");
            } else {
				
                if (offset.y <= o.offsetTop) {
                    s.style.top = o.offsetTop + 'px';
                } else if (offset.y >= maxOffset.y) {
                    s.style.top = maxOffset.y + 'px';
                } else {
                    s.style.top = offset.y + 'px';
                }
                
                o.scrollTop = mini.getScrollTo("y");
            }

            mini.preventEvent(evt);
        }
    },
    
    /**
     * Wheel event
     */
    wheelEvent:function(e){
    	var mini = miniscroll;
    	var evt = window.event ? window.event : e;
    	var delta = -(evt.detail ? evt.detail * (-120) : evt.wheelDelta);
    	
    	(delta == 0) ? mini.dragging = false : mini.dragging = true;
    	
    	mini.getCurrent(this);
    	var s = mini.scrub;var t = mini.tracker;
    	
    	var scroll = {x:this.scrollWidth - this.offsetWidth, y:this.scrollHeight - this.offsetHeight};
    	var offset = {x:t.offsetWidth - s.offsetWidth, y:t.offsetHeight - s.offsetHeight};
    	
    	if(mini.axis == "x"){
    		this.scrollLeft += delta;
    		s.style.left = this.offsetLeft + ((this.scrollLeft / scroll.x) * offset.x) + 'px';
    	} else {
    		this.scrollTop += delta;
    		s.style.top = this.offsetTop + ((this.scrollTop / scroll.y) * offset.y) + 'px';
    	}
    	
    	mini.preventEvent(evt);
    },
	
	/**
	 * Stop the event
	 */
	stopEvent:function(e){
		var mini = miniscroll;
		var evt = window.event ? window.event : e;
		
		mini.dragging = false;
		mini.removeMiniEvent(document, 'mousemove', mini.moveEvent);
		mini.removeMiniEvent(document, 'mouseup', mini.stopEvent);
	},
	
	/**
	 * Prevent default event
	 */
	preventEvent:function(e){
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		
		e.cancelBubble = true;
		e.cancel = true;
		e.returnValue = false;
		return false;
	},
	
	/**
	 * Update scrollbar components
	 *
	 * @type {Element} obj
	 * @type {number} axis
	 * @type {number} size
	 */
	updateMiniScroll:function(obj, axis, size){
		switch(axis){
			case "x":
				var x = obj[0].offsetLeft;
				var y = (obj[0].offsetTop + obj[0].offsetHeight)-size;
				var width = obj[0].offsetWidth;
				var height = size;
				
				var scrub_x = obj[2].offsetLeft;
				var scrub_width = (obj[0].offsetWidth * obj[1].offsetWidth) / obj[0].scrollWidth;
				
				miniscroll.updateMiniCss(obj[1], [x, y, width, height]);
				miniscroll.updateMiniCss(obj[2], [scrub_x, y, scrub_width, height]);
				break;
			
			case "y":
				var x = (obj[0].offsetLeft + obj[0].offsetWidth)-size;
				var y = obj[0].offsetTop;
				var width = size;
				var height = obj[0].offsetHeight;
				
				var scrub_y = obj[2].offsetTop;
				var scrub_height = (obj[0].offsetHeight * obj[1].offsetHeight) / obj[0].scrollHeight;
				
				miniscroll.updateMiniCss(obj[1], [x, y, width, height]);
				miniscroll.updateMiniCss(obj[2], [x, scrub_y, width, scrub_height]);
				break;
		}
	},
	
	
	/**
	 * Update css scrollbar
	 *
	 * @type {Element} e
	 * @type {Array} p
	 */
	updateMiniCss: function (e, p) {
		e.style.top = p[1] + "px";
		e.style.left = p[0] + "px";
		e.style.width = p[2] + "px";
		e.style.height = p[3] + "px";
	},

    //-------------------------------------------
    // GETTERS / SETTERS
    //-------------------------------------------

    /**
    * Get the current element selected
    *
    * @type {Element} obj
    */
    getCurrent: function (obj) {
        var mini = miniscroll;
        mini.current = obj;
        mini.tracker = get_id("tracker_" + mini.current.id);
        mini.scrub = get_id("scrub_" + mini.current.id);
    },

    /**
    * Get the vertical or horizontal axis
    *
    * @type {Element} tracker
    */
    getAxis: function (tracker) {
        this.axis = (tracker.offsetWidth < tracker.offsetHeight) ? "y" : "x";
    },

    /**
    * Get the position mouse
    *
    * @type {string} e
    * @return Return the position mouse x and y
    */
    getMouseCords: function (e) {
        var evt = e || window.event;
        var cursor = {x:0, y:0};
        
	    if (e.pageX || e.pageY) {
	        cursor.x = e.pageX;
	        cursor.y = e.pageY;
	    } else {
	        cursor.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
	        cursor.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
	    }
        
        return cursor;
    },

    /**
    * Get the position scroll
    *
    * @type {string} axis
    * @return Return the position scroll x or y
    */
    getScrollTo: function (axis) {
        var o = this.current; 
        var s = this.scrub; 
        var t = this.tracker;
        if (axis === "x") {
            var px = (s.offsetLeft - o.offsetLeft) / (t.offsetWidth - s.offsetWidth);
            return px * (o.scrollWidth - o.offsetWidth);
        } else {
            var py = (s.offsetTop - o.offsetTop) / (t.offsetHeight - s.offsetHeight);
            return py * (o.scrollHeight - o.offsetHeight);
        }
    },

    //-------------------------------------------
    // CREATE SCROLLBAR
    //-------------------------------------------

    /**
    * Create the scrollbar
    *
    * @type {Element} obj
    */
    addMiniScroll: function (obj) {
        var mini = miniscroll;
        var size = (mini.args.size === undefined) ? 10 : mini.args.size;

        switch (mini.args.scroll) {
            case "x":
                var posy = (obj.offsetTop + obj.offsetHeight) - size;
                mini.addMiniTracker(obj, obj.offsetLeft, posy, obj.offsetWidth, size);

                var w = (obj.offsetWidth * mini.tracker.offsetWidth) / obj.scrollWidth
                mini.addMiniScrub(obj, obj.offsetLeft, posy, obj.offsetWidth, size);
                break;

            case "y":
                var posx = (obj.offsetLeft + obj.offsetWidth) - size;
                mini.addMiniTracker(obj, posx, obj.offsetTop, size, obj.offsetHeight);

                var h = (obj.offsetHeight * mini.tracker.offsetHeight) / obj.scrollHeight
                mini.addMiniScrub(obj, posx, obj.offsetTop, size, h);
                break;
        }
    },

    /**
    * Added tracker in the scrollbar
    *
    * @type {Element} obj
    * @type {number} x
    * @type {number} y
    * @type {number} w
    * @type {number} h
    */
    addMiniTracker: function (obj, x, y, w, h) {
        var mini = miniscroll;
        var alpha = (mini.args.alpha === undefined) ? 0.6 : mini.args.alpha;
        var id = 'tracker_' + obj.id;
        var t = document.createElement('div');
        t.setAttribute('id', id);
        obj.appendChild(t);

        mini.tracker = get_id(id);
        mini.addCss(mini.tracker, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', position: 'absolute', background: mini.args.color });
        mini.addOpacity(mini.tracker, alpha);

        if (mini.args.radius !== undefined)
            mini.addRadius(mini.tracker, mini.args.radius);
    },

    /**
    * Added scrub in the scrollbar
    *
    * @type {Element} obj
    * @type {number} x
    * @type {number} y
    * @type {number} w
    * @type {number} h
    */
    addMiniScrub: function (obj, x, y, w, h) {
        var mini = miniscroll;
        var alpha = (mini.args.scrubAlpha === undefined) ? 1 : mini.args.scrubAlpha;
        var id = 'scrub_' + obj.id;
        var s = document.createElement('div');
        s.setAttribute('id', id);
        obj.appendChild(s);

        mini.scrub = get_id(id);
        mini.addCss(mini.scrub, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', position: 'absolute', background: mini.args.color });
        mini.addOpacity(mini.scrub, alpha);

        if (mini.args.radius !== undefined){
            mini.addRadius(mini.scrub, mini.args.radius);
        }
    },

    //-------------------------------------------
    // CSS / ALPHA AND RADIUS
    //-------------------------------------------

    /**
    * Added border radius
    *
    * @type {Element} o
    * @type {number} r
    */
    addRadius: function (o, r) {
        o.style.borderRadius = r + 'px';
        o.style.MozBorderRadius = r + 'px';
        o.style.WebkitBorderRadius = r + 'px';
        o.style.KhtmlBorderRadius = r + 'px';
    },

    /**
    * Added opacity
    *
    * @type {Element} o
    * @type {number} a
    */
    addOpacity: function (o, a) {
        o.style.opacity = a;
        o.style.MozOpacity = a;
        o.style.WebkitOpacity = a;
        o.style.KhtmlOpacity = a;
        o.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity="+ (a * 100) +")";
    },

    /**
    * Added the css for the element
    *
    * @type {Element} o
    * @type {Object} args
    */
    addCss: function (o, args) {
        o.style.top = args.top;
        o.style.left = args.left;
        o.style.width = args.width;
        o.style.height = args.height;
        o.style.position = args.position;
        o.style.backgroundColor = args.background;
    },

    //-------------------------------------------
    // ADDED AND REMOVE EVENT LISTENERS
    //-------------------------------------------

    /**
    * Added event for all browsers
    *
    * @type {Element} el
    * @type {string} ev
    * @type {Function} fn
    */
	addMiniEvent:function(el, ev, fn) {
		if(el.addEventListener) {
			 if (ev === 'mousewheel') {
                el.addEventListener('DOMMouseScroll', fn, true);
            } else {
				el.addEventListener(ev, fn, false);
			}
			this.addMiniEvent = function (el, ev, fn) {el.addEventListener(ev, fn, false);};
		} else if (el.attachEvent) {
			el.attachEvent('on' + ev, fn);
			this.addMiniEvent = function (el, ev, fn) {el.attachEvent('on' + ev, fn);};
		} else {
			el['on' + ev] = fn;
			this.addMiniEvent = function (el, ev, fn) {el['on' + ev] =  fn;};
		}
	},

    /**
    * Remove event for all browsers
    *
    * @type {Element} el
    * @type {string} ev
    * @type {Function} fn
    */
    removeMiniEvent: function (el, ev, fn) {
        if(el.addEventListener) {
			 if (ev === 'mousewheel') {
                el.removeEventListener('DOMMouseScroll', fn, true);
            } else {
				el.removeEventListener(ev, fn, false);
			}
			this.removeMiniEvent = function (el, ev, fn) {el.removeEventListener(ev, fn, false);};
		} else if (el.attachEvent) {
			this.removeMiniEvent = function(el, ev, fn ) {
				var eProp = ev + fn;
				el.detachEvent( 'on'+ev, el[eProp] );
				el[eProp] = null;
				el["e"+eProp] = null;
			};
		}
 	},
 	
 	dispatchMiniEvent:function(event, target){
		//evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		if(document.dispatchEvent) {
			var oEvt = document.createEvent("MouseEvents");
			oEvt.nitMouseEvent(event, true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, target);
			target.dispatchEvent(oEvt);
		} else if (document.fireEvent) {
			target.fireEvent("on"+event);
		}
	},
	
	/**
	 * Return if the event touch
	 */
	isMiniTouchDevice : function(){
		try { 
			document.createEvent("TouchEvent");
			return true;
		} catch(e){ return false; }
	}
        
}

/**
 * Return the id of the element
 *
 * @type {string} id
 */
function get_id(id){
	return document.getElementById(id);
};


/*
	getScrollPos : function() {
		var posy;
		var posx;
		
		if(window.pageYOffset) {
			posy = window.pageYOffset;
			posx = window.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			posy = document.documentElement.scrollTop;
			posx = document.documentElement.scrollLeft;
		} else if (document.body) {
			posy = document.body.scrollTop;
			posx = document.body.scrollLeft;
		}
		
		return {x : posx,y : posy};
	}*/

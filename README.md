![Miniscroll](http://miniscroll.rogerluizm.com.br/fb.jpg)

Miniscroll is a little library for touch and desktop scrollbar application. if you found bugs send it to rogerluizm@gmail.com or send to <a href="https://github.com/rogerluiz/Miniscroll-JS/issues?page=1&state=open">issue</a> page

_version 1.2.8_

### Include miniscroll.js into your page:

<pre>
&lt;script src="miniscroll.js"&gt;&lt;/script&gt;
</pre>

***

### Include the html tag and add id or class::

<pre>
&lt;div class="scroller"&gt;
     // text here
&lt;/div&gt;
</pre>

***

### CSS of the div ".scroller"::
<pre>
.scroller {
     width: 400px;
     height: 300px;
     overflow: hidden;
}
</pre>

***

### Initialize the miniscroll:
<pre>
new Miniscroll(".scroller", {
     axis: "y",
     size: 10,
     sizethumb: "auto",
     thumbColor: "#0e5066",
     trackerColor: "#1a8bb2"
 });
</pre>

***


### Change the color and aparence for all miniscroll class:
<pre>
.miniscroll-thumb {
     background-color: #0e5066 !important;
}

.miniscroll-tracker {
    background-color: #1a8bb2 !important;
}
</pre>

***

### Change the color and aparence for a unique miniscroll id:
<pre>
&#35;miniscroll-target .miniscroll-thumb {
    background-color: #0e5066 !important;
}

&#35;miniscroll-target .miniscroll-tracker {
    background-color: #1a8bb2 !important;
}
</pre>

***

### List of parameters:
**axis:*
_axle of scrollbar ex: "y" ou "x"_<br />
**size:**
_the width of scrollbar ex: 10_<br />
**sizethumb:**
_o tamanho do thumb ex: 100 ou "auto"_<br />
**thumbColor:**
_the size of thumb ex: "#0e5066"_<br />
**trackerColor:**
_color of fund of tracker ex: "#1a8bb2"_<br />
**scrollbarSize:**
_size of scrollbar, you can set a size fix to scrollbar it ex: 300 this had left scrollbar with the height of 300px_

***

### Last update:
**update 1.2.8** - _03/09/2013 - add turn off mousewheel, ex: { mousewheel: true }_<br />
**update 1.2.7** - _03/09/2013 - add scrollTo, now goto to a position_<br />
**update 1.2.6** - _21/06/2013 - fix bug the whole scrollbar (not just the handler part) moves down when I drag it._<br />
**update 1.2.5** - _18/05/2013 - fix the position the thumb when key press down and up_<br />
**update 1.2.4** - _18/05/2013 - fixbug error it's time to catching the width and height_<br />
**update 1.2.3** - _18/05/2013 - fix scrollbar position "x"_<br />
**update 1.2.2** - _17/05/2013 - Key event added, now you can press the key down and key up for scrolling_<br />
**update 1.2.1** - _15/05/2013 - Touch event added, now works for ipad, iphone and android_<br />

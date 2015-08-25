![Miniscroll](http://miniscroll.rogerluizm.com.br/fb.jpg)

Miniscroll is a little library for touch and desktop scrollbar application. if you found bugs send it to rogerluizm@gmail.com or send to <a href="https://github.com/rogerluiz/Miniscroll-JS/issues?page=1&state=open">issue</a> page

_check my dev brach_

_version 1.3.0_

### Include miniscroll.js into your page:

```html
<script src="miniscroll.js"></script>
```


### Include the html tag and add id or class:

```html
<div class="scroller">
     <!-- text here -->
</div>
```


### CSS of the div ".scroller":
```css
.scroller {
     width: 400px;
     height: 300px;
     overflow: hidden;
}
```


### Initialize the miniscroll:
```javascript
new Miniscroll(".scroller", {
     axis: "y",
     size: 10,
     sizethumb: "auto",
     onScroll: function(percent, offset) {},
     thumbColor: "#0e5066",
     trackerColor: "#1a8bb2"
 });
```


### Change the color and aparence for all miniscroll class:
```css
.miniscroll-thumb {
     background-color: #0e5066 !important;
}

.miniscroll-tracker {
    background-color: #1a8bb2 !important;
}
```

### Change the color and aparence for a unique miniscroll id:
```css
#miniscroll-target .miniscroll-thumb {
    background-color: #0e5066 !important;
}

#miniscroll-target .miniscroll-tracker {
    background-color: #1a8bb2 !important;
}
```

### List of parameters:

| Parameters    | Desc                             |
|---------------|----------------------------------|
| axis          | axle of scrollbar ex: "y" ou "x" |
| size          | the width of scrollbar ex: 10 |
| sizethumb     | the height of thumb  ex: 100 ou "auto" |
| scrollbarSize | size of scrollbar, you can set a size fix to scrollbar it ex: 300 this had left scrollbar with the height of 300px |
| thumbColor    | the size of thumb ex: "#0e5066" |
| trackerColor  | color of fund of tracker ex: "#1a8bb2" |
| isKeyEvent    | Add arrow key event, by default is true |
| turnOffWheel  | toggle on or off a mousewheel event, by default turnOffWheel is true |


### Last update:

| Version | Date       | Update                           |
|---------|------------|----------------------------------|
| 1.2.9   | 10/09/2013 | fix multidimensional scrollwheel |
| 1.2.9   | 10/09/2013 | fix error in the scroll when the position is relative or absolute |
| 1.2.9   | 10/09/2013 | fix updating on the x axis |
| 1.2.8   | 03/09/2013 | add turn off mousewheel, ex: { mousewheel: true } |
| 1.2.7   | 03/09/2013 | add scrollTo, now its posible scroll to a custom positio |
| 1.2.6   | 03/09/2013 | fix bug the whole scrollbar (not just the handler part) moves down when I drag it |
| 1.2.5   | 03/09/2013 | fix the position the thumb when key press down and up |
| 1.2.4   | 03/09/2013 | fixbug error it's time to catching the width and height |
| 1.2.3   | 03/09/2013 | fix scrollbar position "x" |
| 1.2.2   | 03/09/2013 | Key event added, now you can press the key down and key up for scrolling |
| 1.2.1   | 03/09/2013 | Touch event added, now works for ipad, iphone and android |


***


### The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.




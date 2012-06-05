## Miniscroll

This is a my first plugin in javascript

**License**

```
Copyright (c) 2011 Roger Luiz

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files 
(the "Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject 
to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.
```

##ABOUT MINISCROLL

Miniscroll is a small scrollbar plugin for desktop and mobile applications.
It’s use is very simple. You also can use CSS code to modify the default configuration.


##HOW TO USE

initializing the basic plugin, the handle can be an int ex: handle:100
```
new Miniscroll('divid', {
  axis:'y',
	size:12, 
	handle:'auto',
	scrubColor:"#33a369", 
	trackerColor:"#bde7d8"
});
```						

the div container connot have display attribute as absolute or relative and the overflow attribute has to be as hidden
```
<div id='divid'>
	<p>The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men.</p>
</div>
```
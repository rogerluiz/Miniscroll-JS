/**
 * @author       Roger Luiz <rogerluizm@gmail.com>
 * @copyright    2015 Roger Luiz Ltd.
 * @license      {@link https://github.com/rogerluiz/Miniscroll-JS/blob/master/license.txt|MIT License}
 */

/**
 * @class Miniscroll.Utils
 * 
 * @param  {[type]} x represents the horizontal axis
 * @param  {[type]} y represents the vertical axis
 * @return {[type]}   Defines a cartesian pair of coordinates
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
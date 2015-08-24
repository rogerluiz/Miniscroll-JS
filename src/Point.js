
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
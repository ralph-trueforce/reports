/**
 * Created by ralph on 11/18/16.
 */

/**
 * Super Class Graphic
 *
 * @param width
 * @param height
 * @constructor
 */
function Graphic(width, height) {
    this.width = width;
    this.height = height;
}

Graphic.prototype.update = function(json) {

};

Graphic.prototype.getFooter = function() {
	return "";
};

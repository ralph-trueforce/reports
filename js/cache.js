/**
 * Created by ralph on 12/9/16.
 */


var WidgetCache = {
	getWidth: function(widget) {
		return ((localStorage[widget.id + "widget.width"] !== undefined)?localStorage[widget.id + "widget.width"] : (448 * widget.sizeX));
	},

	getHeight: function(widget) {
		return ((localStorage[widget.id + "widget.height"] !== undefined)?localStorage[widget.id + "widget.height"] : (348 * widget.sizeY));
	},

	setWidth: function(ID, width) {
		localStorage[ID + "widget.width"] = width;
	},

	setHeight: function(ID, height) {
		localStorage[ID + "widget.height"] = height;
	}
};

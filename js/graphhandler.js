/**
 * class GraphHandler
 *
 * @constructor
 */
function GraphHandler () {

  var config_graph = {
    "Options": {
      "path": "js/graph/"
    },
    "classes": [
      "Html",
      "Bar",
      "Donut",
      "Lines",
      "Pie",
      "Series",
      "Funel",
      "Hirarchical",
      "Revenue",
      "Stacked",
      "Sunburst"
    ]
  };

  this.clear = function() {
      config_graph.classes.forEach(function (_class) {
        localStorage.removeItem(_class + '_index');
      });
  };

  this.createButtons = function() {
    config_graph.classes.forEach(function (_class) {
      var newAnchor = document.createElement('a');
      newAnchor.setAttribute('class', 'pull-right btn btn-primary');
      newAnchor.setAttribute('ng-click', 'addWidget(\'' + _class + '\')');
      newAnchor.innerHTML = "<i class=\"glyphicon glyphicon-plus\"></i> Add " + _class;
      var target = document.getElementById('ph_buttons');
      //target.appendChild(newAnchor);
      target.insertBefore(newAnchor, target.firstChild);
    });
  };

  this.createGraphButtons = function() {
      var htmlContent = '';
      config_graph.classes.forEach(function (_class) {
        htmlContent += "<a class=\"pull-right btn btn-primary\" ng-click=\"addWidget('" + _class + "')\"><i class=\"glyphicon glyphicon-plus\"></i> Add " + _class + "</a>";
      });

      return htmlContent;
  }
}
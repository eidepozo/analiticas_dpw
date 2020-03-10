/**
 * sources: 
 * https://codepen.io/thecraftycoderpdx/pen/jZyzKo
 * https://github.com/d3/d3-scale-chromatic#schemeAccent
 * https://stackoverflow.com/questions/41940439/display-multiple-d3-js-charts-in-a-single-html-page
 */

var res = [ //g1,g2
  {label: "1199", elabel: "Bienvenida"},
  {label: "1202", elabel: "Reglas del Juego"},
  {label: "1205", elabel: "Ciclo de Vida de un proyecto"},
  {label: "1265", elabel: "Modelos de Desarrollo de Software"},
  {label: "1274", elabel: "Roles en el equipo de desarrollo"},
  {label: "1285", elabel: "Toma de requisitos"},
  {label: "1276", elabel: "Tarea 1: Problema del Señor E"},
  {label: "1266", elabel: "Carta Gantt en la gestión"},
  {label: "1200", elabel: "Introducción al Control de Versiones"},
  {label: "1201", elabel: "Qué es Git y GitHub?"},
  {label: "1278", elabel: "Tarea 2: Problema del Señor E"},
  {label: "1419", elabel: "Bienvenida"},
  {label: "1421", elabel: "Reglas del Juego"},
  {label: "1423", elabel: "Ciclo de Vida de un proyecto"},
  {label: "1424", elabel: "Modelos de Desarrollo de Software"},
  {label: "1425", elabel: "Roles en el equipo de desarrollo"},
  {label: "1426", elabel: "Toma de requisitos"},
  {label: "1428", elabel: "Tarea 1: Problema del Señor E"},
  {label: "1432", elabel: "Carta Gantt en la gestión"},
  {label: "1433", elabel: "Introducción al Control de Versiones"},
  {label: "1434", elabel: "Qué es Git y GitHub?"},
  {label: "1435", elabel: "Tarea 2: Problema del Señor E"},
];


var newLocal = "../services/logs3.php";
var newLocal2 = "../services/logs4.php";	
var iduser = document.getElementById("iduser").value;
var idcourse = document.getElementById("course").value;

newLocal = newLocal+"?id="+iduser+"&course="+idcourse;
newLocal2 = newLocal2+"?course="+idcourse;
myFirstFunc("#leftchart",newLocal,res)
myFirstFunc("#rightchart",newLocal2,res) 

function myFirstFunc(selector, url, resources){
  var width = 565;
  var height = 410;
  var margin = 40;

  var radius = Math.min(280,300) / 2  - margin;

  var color = d3.scaleOrdinal(d3.schemePaired); 

  var svg = d3.select(selector) 
    .append('svg') 
    .attr('width', width) 
    .attr('height', height) 
    .append('g') 
    .attr('transform', 'translate(' + (135) + ',' + (height / 2 -25) + ')'); 

  var arc = d3.arc()
    .innerRadius(0) 
    .outerRadius(radius); 

  var pie = d3.pie() 
    .value(function(d) { return d.count; }) 
    .sort(null); 

  var tooltip = d3.select(selector) 
    .append('div') 
    .attr('class', 'tooltip2'); 

  tooltip.append('div') 
    .attr('class', 'label'); 

  tooltip.append('div') 
    .attr('class', 'count'); 

  tooltip.append('div') 
    .attr('class', 'percent'); 

  d3.json(url).then(function(data){
    var dataset = new Array();
    data.forEach(function(d){
      let idx = resources.findIndex(x=> x.label ===d.label);
      if (idx != -1){
        d.label = resources[idx]["elabel"];
        d.count = +d.count;
        d.enabled = true;
        dataset.push(d); 
      }
    });
  //console.log(dataset);

  var path = svg.selectAll('path') 
    .data(pie(dataset)) 
    .enter() 
    .append('path') 
    .attr('d', arc) 
    .attr('fill', function(d) { return color(d.data.label); }) 
    .each(function(d) { this._current - d; }); 

  path.on('mouseover', function(d) {  
  var total = d3.sum(dataset.map(function(d) { 
    return (d.enabled) ? d.count : 0; 
    }));                                                      
  var percent = Math.round(1000 * d.data.count / total) / 10; 
  tooltip.select('.label').html(d.data.label); 
  tooltip.select('.count').html('Cantidad: ' + d.data.count); 
  tooltip.select('.percent').html(percent + '%'); 
  tooltip.style('display', 'block'); 
  });                                                           

  path.on('mouseout', function() { 
    tooltip.style('display', 'none');
  });

  path.on('mousemove', function(d) { 
    tooltip.style('top', (d3.event.layerY + 10) + 'px') 
      .style('left', (d3.event.layerX + 10) + 'px'); 
    });

  var legendRectSize = 25; 
  var legendSpacing = 6; 
  
  var legend = svg.selectAll('.legend') 
    .data(color.domain()) 
    .enter() 
    .append('g') 
    .attr('class', 'legend') 
    .attr('transform', function(d, i) {                   
      var height = legendRectSize + legendSpacing; 
      var offset =  height * color.domain().length / 2; 
      var horz = 18 * legendRectSize -285; 
      var vert = i * height - offset; 
        return 'translate(' + horz + ',' + vert + ')'; 
    });
  
  legend.append('rect') 
    .attr('width', legendRectSize) 
    .attr('height', legendRectSize) 
    .style('fill', color) 
    .style('stroke', color) 
    .on('click', function(label) {
      var rect = d3.select(this); 
      var enabled = true; 
      var totalEnabled = d3.sum(dataset.map(function(d) { 
        return (d.enabled) ? 1 : 0; 
      }));

      if (rect.attr('class') === 'disabled') { 
        rect.attr('class', ''); 
      } else { 
        if (totalEnabled < 2) return; 
        rect.attr('class', 'disabled'); 
        enabled = false; 
      }

      pie.value(function(d) { 
        if (d.label === label) d.enabled = enabled; 
          return (d.enabled) ? d.count : 0; 
      });

      path = path.data(pie(dataset)); 

      path.transition() 
        .duration(750) 
        .attrTween('d', function(d) { 
          var interpolate = d3.interpolate(this._current, d); 
          this._current = interpolate(0); 
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });

  legend.append('text')                                    
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; }); 
  })

}

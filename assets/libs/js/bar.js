/**
 * sources: 
 * https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
 * https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
 * https://github.com/d3/d3-time-format#locale_parse
 * https://gist.github.com/ningunaparte/9d67f051e3f7fedf4e20
 */

var locale = d3.timeFormatLocale({
	"decimal": ",",
	"thousands": ".",
	"grouping": [3],
	"currency": ["€", ""],
	"dateTime": "%a %b %e %X %Y",
	"date": "%d/%m/%Y",
	"time": "%H:%M:%S",
	"periods": ["AM", "PM"],
	"days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
	"shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
	"months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
	"shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
});

var parseDate = d3.timeParse("%Y-%m-%d");
var formatDate = locale.format("%A %d %b");

var formatMillisecond = locale.format(".%L"),
    formatSecond = locale.format(":%S"),
    formatMinute = locale.format("%I:%M"),
    formatHour = locale.format("%I %p"),
    formatDay = locale.format("%a %d"),
    formatWeek = locale.format("%b %d"),
    formatMonth = locale.format("%B"),
	formatYear = locale.format("%Y");
	
var svg = d3.select("#barchart"),
margin = {top: 20,right: 20,bottom: 30,left: 50},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.1);

var y = d3.scaleLinear()
	.rangeRound([height, 0]);


var tooltip = d3.select("body").append("div").attr("class", "toolTip");

//arreglin
var idcourse = document.getElementById("course").value;
if (document.getElementById("my_dataviz")=== null){
	var newLocal = "../services/logs.php?course="+idcourse;
}
else{
	var newLocal = "../services/logs1.php";	
	var iduser = document.getElementById("iduser").value;
	newLocal = newLocal+"?id="+iduser+"&course="+idcourse;
};

d3.json(newLocal).then(function(data){
	var sample = new Array();
	data.forEach(function(d){
	d.total = parseInt(d.total);
	d.fecha = formatDate(parseDate(d.fecha));
	sample.push(d); 
	});

	x.domain(sample.map(function (d) {
			return d.fecha;
		}));
	y.domain([0, d3.max(sample, function (d) {
				return Number(d.total);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
	.attr("y", -45)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("Cantidad de visitas");

	g.selectAll(".bar")
	.data(sample)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) {
		return x(d.fecha);
	})
	.attr("y", function (d) {
		return y(Number(d.total));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.total));
	})
	.on("mousemove", function(d){
		tooltip
		  .style("left", d3.event.pageX - 50 + "px")
		  .style("top", d3.event.pageY - 70 + "px")
		  .style("display", "inline-block")
		  .html("Cantidad de visitas: " + (d.total));
	})
		.on("mouseout", function(d){ tooltip.style("display", "none");});
});
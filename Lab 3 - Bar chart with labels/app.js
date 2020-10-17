var margin = 200;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",70)
.attr("y",70)
.attr("class","title")
.style("fill", d3.color("steelblue") )
.text("Sales by Products (Three types: A, B, C)");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,180)");

var data = [
  {id: 0, year:2010, productA: 26, productB: 15, productC: 32},
  {id: 1, year:2011, productA: 48, productB: 11, productC: 22},
  {id: 2, year:2012, productA: 39, productB: 0, productC: 33},
  {id: 3, year:2013, productA: 14, productB: 5, productC: 17},
  {id: 4, year:2014, productA: 25, productB: 1, productC: 13},
  {id: 5, year:2016, productA: 20, productB: 2, productC: 12},
  {id: 6, year:2017, productA: 13, productB: 3, productC: 6},
  {id: 7, year:2019, productA: 8, productB:21, productC: 14},
];

xScale.domain(data.map(function(d) { return d.year;}));
yScale.domain([0,d3.max(data, function(d) {
  d.val = d.productA +  d.productB + d.productC;
  return d.val;})
]);



g.append("g")
.attr("transform","translate(0,"+height+")")
.call(d3.axisBottom(xScale));


g.append("g")
.call(d3.axisLeft(yScale));

function onMouseOver(d,i) {
  d3.select(this)
    .attr('class','highlight');

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth()+5)
  .attr("y", (d)=>yScale(d.val)-10)
  .attr("height", (d)=>height-yScale(d.val)+10)

  g.selectAll("#info"+i.id)
  .attr("visibility", "visible") //make text with selected id visible

}


function onMouseOut(d,i) {
  d3.select(this)
  .attr('class','bar');



  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth())
  .attr("y", (d)=>yScale(d.val))
  .attr("height", (d)=>height-yScale(d.val));

  g.selectAll('.info')
  .attr("visibility", "hidden") //make all info blocks hidden
  }



g.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class","bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", (d)=>xScale(d.year))
.attr("y", (d)=>yScale(d.val))
.attr("width", xScale.bandwidth())
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay((d,i)=>i*50)
.attr("height", (d)=>height-yScale(d.val));


g.selectAll(".info")
  .data(data)
  .enter()
  .append("text")
  .attr("class","info")
  .attr("x", (d)=>(xScale(d.year)+5))
  .attr("y", (d)=>yScale(d.val + 2))
  .attr("transform", (d)=>"rotate(90, "+(xScale(d.year)+15)+","+yScale(d.val + 2)+")")
  .attr("visibility", "hidden")
  .attr("id", (d)=>"info"+d.id)
  .append("tspan")
  .text((d)=>"A:" + d.productA + " B:" +d.productB+ " C:" + d.productC)

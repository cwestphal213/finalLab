

var dataP = d3.json("classData.json")

dataP.then(function(data){


var allPenR = make2DArray(data)


var width = 500
var height = 500


var svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

            var xScale = d3.scaleLinear()
                            .domain([0,allPenR.length])
                            .range([0,width]);

            var yScale = d3.scaleLinear()
                          .domain([0, allPenR.length])
                          .range([height - height/23, 0]);



            var plot = svg.append('g')
                            .attr('width',width)
                            .attr('hieght',height);

                    allPenR.forEach(function(d,i){
                                plot.selectAll('rect'+i)
                                .data(allPenR[i])
                                .enter()
                                .append('rect')
                                .attr("class","o")
                                .attr('id',function(){return 'a'+i})
                                .attr('x',function(da,ia){return xScale(ia)})
                                .attr('y', function(db,ib){return yScale(i)})
                                .attr('height',function(){return height/23})
                                .attr('width',function(){return width/allPenR[0].length})
                                .attr('fill', function(dc,ic){return d3.interpolateBlues(dc)})
                                .on("mouseover", function(d,i) {
// console.log(d3.select(this).attr("x"))
                                                //Get this bar's x/y values, then augment for the tooltip
                                                var xPosition = parseFloat(d3.select(this).attr("x"));
                                                var yPosition = parseFloat(d3.select(this).attr("y"));
                                                //Update the tooltip position and value
console.log(xPosition)
console.log(yPosition)
  d3.select("#tooltip")
    .text("ok")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px")
                                                //Show the tooltip
                                                d3.select("#tooltip").classed("hidden", false);
                           })
    .on("mouseout", function() {
                                                //Hide the tooltip
                                                d3.select("#tooltip").classed("hidden", true);
})
  })

var colors = [0,.2,.4,.6,.8,1]

var svg2 = d3.select('.key')
            .attr('width', width)
            .attr('height', height);
            var plot2 = svg2.append('g')
                            .attr('width',width)
                            .attr('height',height);
var Legend = plot2.selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('x', function(d,i){return xScale(i*3)+20})
            .attr('y',function(d,i){return yScale(20)})
            .attr('fill',function(d,i){return d3.interpolateBlues((d))})
            .attr('height',20)
            .attr('width',20);
            colors.forEach(function(db,ib){
              plot2.append('text')
                  .attr('x', function(){return xScale(ib*3)+28})
                  .attr('y',function(){return yScale(18)})
                  .attr('text-anchor','middle')
                  .attr('font-size','16px')
                  .attr('fill','black')
                  .attr('pointer-events','none')
                  .text(function(){return db})
            })
plot2.append("text")
.attr('x', 200)
.attr('y', 40)
.text("Legend")
.attr('text-anchor','middle')
.attr('font-size','30px')
.attr('fill','black')
.attr('pointer-events','none')


                            },
function(err){
  console.log(err)
})



//This function takes all of the data in the promise and returns the a 2D array of every penguin's r
var make2DArray = function(pengList){
  var bigArray = []
  pengList.forEach(function(d, i){
        innerArray = []
        pengList.forEach(function(peng, i){
                var thisR = getR(d,peng)
                innerArray.push(thisR)
                if (i == 22){
                              bigArray.push(innerArray)
                            }
            })
      })
return bigArray
}


//This function recieves to penguins as arguments and returns thier correlation coefficient(r)
var getR = function(pen1, pen2){

        var pen1Avg = getMean(pen1)
        var pen2Avg = getMean(pen2)

        var pen1Dev = getStdev(pen1)
        var pen2Dev = getStdev(pen2)


        var quizCount = 38

        var zscores = pen1.quizes.reduce(function(sum,d,i){
          var pen2Score = (pen2.quizes[i].grade - pen2Avg)/pen2Dev
          //console.log('pen1', (d.grade - pen1Avg)/pen1Dev)
         //console.log('pen2', pen2Score)
          return ((d.grade - pen1Avg)/pen1Dev)*pen2Score + sum
        },0)

        var unrounded = zscores/(quizCount-1)
        return unrounded.toFixed(2);
}


//This function will get the mean of quiz score of a penguin object
var getMean = function(pen){
  return d3.mean(pen.quizes, function(d){
    return d.grade
  })
}

//This function will get the stdev of quiz score of a penguin object
var getStdev = function(pen){
  return d3.deviation(pen.quizes, function(d){
    return d.grade
  })
}

$(function() {
    var myVizLib = myVizLib || {};
    
    myVizLib.basicPlot = function() {
        var margin = { left: 30, right: 10, top: 10, bottom: 30 };
        var height = 120;
        var width = 120;
        var data = [];
        
        
        
        var height_ = function(_) {
            var that = this;
            if (!arguments.length) return height;
            height = _;
            return that;
        };
        
        
        
        var width_ = function(_) {
            var that = this;
            if (!arguments.length) return width;
            width = _;
            return that;
        };
        
        
        
        var data_ = function(_) {
            var that = this;
            if (!arguments.length) return data;
            data = _;
            return that;
        };
        
        
        
        var plot_ = function() {
            var figw = width - margin.left - margin.right;
            var figh = height - margin.top - margin.bottom;
            
            var xExtent = d3.extent(data.map(function(d) {return d.date;}).sort(d3.ascending));
            var yExtent = d3.extent(data.map(function(d) {return d.cost;}).sort(d3.ascending));
            
            var xScale = d3.scaleTime().domain(xExtent).range([margin.left, figw]);
            var yScale = d3.scaleLinear().domain([0, d3.max(yExtent)]).range([figh - margin.bottom, 0]);
            
            var line = d3.line()
                .x(function(d) {return xScale(d.date);})
                .y(function(d) {return yScale(d.cost);})
            
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);
            
            var svg = d3.select("#myfigure")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width)
                .attr("height", height);
            
            // adds a mask so that the zooming won't stretch out the line past the chart boundaries
            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", figw)
                .attr("height", figh)
                .attr("transform", "translate(" + margin.left + ",0)");
            
            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var bisectDate = d3.bisector(function(d) { return d.date; }).left;
            
            //adds an x-axis zoom feature to the chart
            // see https://stackoverflow.com/questions/48483756/error-zoom-in-d3-map-d3-behavior-is-undefined
            // see https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
            // see https://bl.ocks.org/rutgerhofste/5bd5b06f7817f0ff3ba1daa64dee629d
            // see https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
            // see https://bl.ocks.org/lorenzopub/013c0c41f9ffab4d27f860127f79c5f5
            var xt = xScale;
            function zoomfunc() {
                // helper function that controls zoom behavior
                //zooms the line
                var t = d3.event.transform;
                xt = t.rescaleX(xScale);
                gX.call(xAxis.scale(xt)); //scales the x-axis
                linepath.attr("d", line.x(function(d){return xt(d.date);})); //zooms in on the line
                
                //moves the focus circle in response to the zoom
                // d = mouseDate(xt);
                // focus.select("circle.y")
                     // .classed("zoomed", true)
                     // .attr("id","one")
                     // .attr('cx', function() {return t.applyX(xt(d.date)); })
                     // .attr('cy', function() {return t.applyY(yScale(d.cost)); });				
                // focus.select("text")
                     // .text(formatCurrency(d.cost))
                     // .attr('x', function() { return t.applyX(xt(d.date))+10;})
                     // .attr('y',function() {return t.applyY(yScale(d.cost)); });
            }
            
            var zoomer = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [figw, figh]])
                .extent([[0, 0], [figw, figh]])
                .on("zoom", zoomfunc);
            
            g.call(zoomer);
            

            
            // adds line to chart
            var linepath = g.append("path")
                .datum(data)
                .attr("class", "linepath")
                .attr("d", line)
                .attr("stroke", "steelblue")
                .attr("fill", "none")
                .attr("stroke-width", "2");
                //.attr("stroke-dasharray", "5 5");
            
            // adds axes to chart
            var gX = g.append("g")
                .attr("class", "axis--x")
                .attr("transform",function(d) { return "translate(0,"+(figh-margin.bottom)+")"; })
                .call(xAxis);
            
            var gY = g.append("g")
                .attr("class", "axis--y")
                .attr("transform",function(d) { return "translate("+(margin.left)+","+(0)+")"; })
                .call(yAxis);
            
            // adds axes labels
            // text label for the x axis
            g.append("text")             
                .attr("transform", "translate(" + (figw/2) + " ," + (figh) + ")")
                .style("text-anchor", "middle")
                .text("Date");
            
            // text label for the y axis
            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (figh / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Cost USD");  
            
            //exit
            //var scatterExit = scatter.exit();
            
            //adds a mousover element to the chart, so that user can see the exact value
            // see https://bl.ocks.org/mbostock/3902569
            // see https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
            // see https://bl.ocks.org/lorenzopub/013c0c41f9ffab4d27f860127f79c5f5
            var focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none");
            
            focus.append("circle")
                .attr("class", "y")
                .attr("r", 4.5);
            
            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");
            
            g.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);
            
            // function mouseDate(scale) {
                // helper function that gets returns a date, given a scale
                // var g = d3.select("#group")._groups[0][0]
                // var x0 = scale.invert(d3.mouse(g)[0]),
                // i = bisectDate(data, x0, 1),
                // d0 = data[i - 1],
                // d1 = data[i],
                // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                // return d;
            // }
            
            function mousemove() {
                // helper function to move the focus circle to the location of the mouse
                var x0 = xt.invert(d3.mouse(this)[0]);
                var i = bisectDate(data, x0, 1);
                var d0 = data[i-1];
                var d1 = data[i];
                var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                
                //var transform = d3.zoomTransform(this);
                //var xt = transform.rescaleX(xScale);
                //var yt = transform.rescaleY(yScale);
                //var d = mouseDate(xt);
                
                focus.attr("transform", "translate(" + xt(d.date) + "," + yScale(d.cost) + ")");
                focus.select("text").text(function() {return (d.cost)});
                //var format = d3.timeFormat("%Y-%m-%d");
                //var dt = format(d.date);
                //focus.select("text").text(function() {return (dt + ", " + d.cost + " USD")});
            }
            
            console.log("plot finished");
        };
        
        
        
        var public = {
            plot : plot_,
            data : data_,
            height : height_,
            width : width_
        };
        
        return public;
    };
    

    d3.tsv(
        "data/meals.txt"
        , function(e,d) {
            // console.log(d);
            
            // converts the date string to a date object, and the cost string to a number
            var dateFormat = d3.timeParse("%Y-%m-%d");
            d.forEach(function(d) {
                d.date = dateFormat(d.date);
                d.cost = +d.cost;
            });
            // console.log(d);
            
            var myChart01 = myVizLib.basicPlot();
            myChart01.data(d).height(400).width(600).plot();
        });
});


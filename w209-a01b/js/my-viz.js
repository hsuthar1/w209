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
            
            var xScale = d3.scaleTime().domain(xExtent).range([margin.left, width]);
            var yScale = d3.scaleLinear().domain([0, d3.max(yExtent)]).range([height - margin.bottom, 0]);
            
            var line = d3.line()
                .x(function(d) {return xScale(d.date);})
                .y(function(d) {return yScale(d.cost);})
            
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
            var yAxis = d3.axisLeft(yScale);
            
            var svg = d3.select("#myfigure")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            // adds line to chart
            svg.append("path")
                .datum(data)
                .attr("d", line)
                .attr("stroke", "steelblue")
                .attr("fill", "none")
                .attr("stroke-width", "2");
                //.attr("stroke-dasharray", "5 5");
            
            // adds axes to chart
            svg.append("g")
                .attr("class", "axis")
                .attr("transform",function(d) { return "translate(0,"+(height-margin.bottom)+")"; })
                .call(xAxis);
            svg.append("g")
                .attr("class", "axis")
                .attr("transform",function(d) { return "translate("+(margin.left)+","+(0)+")"; })
                .call(yAxis);
            
            // adds axes labels
            // text label for the x axis
            svg.append("text")             
                .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Date");
            
            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Cost USD");  
            
            //exit
            //var scatterExit = scatter.exit();
            
            //adds a mousover element to the chart
            // see https://bl.ocks.org/mbostock/3902569
            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");
            
            focus.append("circle")
                .attr("r", 4.5);
            
            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");
            
            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);
            
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


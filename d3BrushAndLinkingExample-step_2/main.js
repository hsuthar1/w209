/* global d3, barChart, crossfilter*/
"use strict";

var tpFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");

d3.csv("Lekagul Sensor Data.csv"
    ,function(d) {
        d.Timestamp = tpFmt(d.Timestamp);
        return d;
    }
    ,function (err, data) {
        if (err) throw err;
        
        // counts for gate3
        var count = 0;
        data.forEach(function (d) {
            if (d["gate-name"] === "entrance3") {
                count +=1;
            }
        });

        //wraps data in a crossfilter
        var csData = crossfilter(data);
        
        var dimGates = csData.dimension(function (d) {return d["gate-name"];});
        //console.log(dimGates.group().all());
        var dimCars = csData.dimension(function (d) {return d["car-type"];});
        //console.log(dimCars.group().all());
        
        // uses the bar chart module
        // creates gates chart
        var bcGates = barChart()
            .x(function (d) { return d.key; })
            .y(function (d) { return d.value; })
            .onMouseOver(function (d) {
                console.log("Gates mouse over", d);
                dimGates.filter(d.key);
                update();
            })
            .onMouseOut(function () {
                dimGates.filterAll();
                update();
            });
        
        //creates car types chart
        var bcCars = barChart()
            .x(function (d) { return d.key; })
            .y(function (d) { return d.value; })
            .onMouseOver(function (d) {
                console.log("Cars mouse over", d);
                dimCars.filter(d.key);
                update();
            })
            .onMouseOut(function () {
                dimCars.filterAll();
                update();
            });
        
        //updates all charts' data
        function update() {
            d3.select("#gates")
              .datum(dimGates.group().top(5))
              .call(bcGates)
              .select(".x.axis")
              .selectAll("text")
              .attr("transform", "rotate(-45)");

            d3.select("#carTypes")
              .datum(dimCars.group().all())
              .call(bcCars);
        }

        update();
        
        //console.log("gate3 count", count);
        //console.log(data[1]);
    });
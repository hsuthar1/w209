// we'll load this data set from an external location
d3.json(
  "https://gist.githubusercontent.com/andyreagan/d32b101903b1246aa8c418abd8e6520b/raw/a918dbe038fb82d987d5e73eae3cefa349447950/gapminder.json",
  function(error, data) {
    
    // take a look at the data in your browser's console (likely too big for CodePen's console button below- access through the developer tools)
    // console.log(data);
    // convert the data from an object into a list
    var datalist = [];
    for (var key in data) {
      // make sure the data is defined for all of the countries
      if (data[key].lifeExp[data[key].lifeExp.length-1] & data[key].gdp[data[key].gdp.length-1]) {
        datalist.push(data[key]);
        datalist[datalist.length-1]["country"] = key;
      }
    }
    // console.log(datalist);
    // peek at the most recent GDP data for each country
    // console.log(datalist.map(function(d) { return d.gdp[d.gdp.length-1]; }).sort(d3.ascending));
    var gdp_range = d3.extent(datalist.map(function(d) { return d.gdp[d.gdp.length-1]; }).sort(d3.ascending));
    var lifeExp_range = d3.extent(datalist.map(function(d) { return d.lifeExp[d.lifeExp.length-1]; }).sort(d3.ascending));
    var pop_range = d3.extent(datalist.map(function(d) { return d.pop[d.pop.length-1]; }).sort(d3.ascending)); //finds pop range across most recent pop values
    // var pop_range = d3.extent(datalist.map(function(d) { return d.pop[0]; }).sort(d3.ascending)); //finds pop range across oldest pop values
    var continent_mapper = function(d) {
        //creates a mappings dictionary of continents to d3 symbols
        var continent_mappings = {
              "Asia" : d3.symbolCircle
              ,"Central America and the Caribbean" : d3.symbolSquare
              ,"Europe" : d3.symbolCross
              ,"Middle East, North Africa, and Greater Arabia" : d3.symbolTriangle
              ,"North America" : d3.symbolDiamond
              ,"Oceania" : d3.symbolStar
              ,"South America" : d3.symbolWye
              ,"Sub-Saharan Africa" : d3.symbolCircle //not enough built-in symbol types
          };
          //maps record's continent to d3 symbol using the mappings dictionary, defaults to circle
          var symb;
          if (d.continent in continent_mappings) {
              symb = continent_mappings[d.continent];  
          } else {
              symb = d3.symbolCircle;
          }
          return symb;
    }
    var size_mapper = function(d) {
      // creates a scale to normalize the population data
      var scale = d3.scaleLinear().domain([pop_range[0],pop_range[1]]).range([10,1000]);
      return scale(d.pop[0]);
    }
    // create svg element
    var svg = d3.select("svg");

    // border rectangle
    svg
      .append("rect")
      .attr("width", 240)
      .attr("height", 240)
      .attr("x", 5)
      .attr("y", 5);

    // add each data point to the svg
    // through the select->enter->append idiom
    svg
      .selectAll("path.pt") // this is an empty selection
      .data(datalist) // the selection is still empty, but the enter selection contains the number elements in data. (the exit selection is empty).
      .enter() // our selection now contains just the *new* data elements, and since our initial selection was empty, this is everything in var data
      .append("path") // append a path to each element
      .attr("class", "pt") // give attributes to each element
      //.attr("d", d3.symbol().type(d3.symbolCircle))
      .attr("d", d3.symbol().type(continent_mapper).size(size_mapper))
      .attr("transform", function(d) {
        // console.log(d)
        // uncomment the previous to see the data element that gets passed into each of these callbacks
        return "translate(" + 
          (10 + (d.gdp[d.gdp.length-1] - gdp_range[0])/(gdp_range[1]-gdp_range[0])*230) + 
          "," + 
          (240 - (d.lifeExp[d.lifeExp.length-1] - lifeExp_range[0])/(lifeExp_range[1]-lifeExp_range[0])*230) + 
          ")";
      });

    // tip: define a function callback for the "d" attribute (line 59)
    // use d3.symbol.size(), and d.pop[0]
    // see https://github.com/d3/d3-shape#symbols
  }
);
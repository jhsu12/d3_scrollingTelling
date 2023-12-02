
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 700;
  var height = 520;
  var margin = { top: 10, left: 50, bottom: 40, right: 10 };
  var plotWidth = width - margin.left - margin.right - 100;
  var plotHeight = height - margin.bottom - margin.top- 100;

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg = null;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      svg = d3.select(this).append('svg').attr('width', width).attr('height', height);
      setupVis(rawData);
      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (rawData) {
      ///////************* Data Processing ****************/
      AusData = rawData['data1'];
      baseBallData = rawData['data2'];
      Unrecorded_count = 0
      

      /////// Ausdata process, only grabbing attributes i need
      AusData.forEach(function(d){
        d.Gender = d.Gender;
        d.Age = +d.Age;
        if(d.Fate != '')
        {
          d.Fate = +d.Fate;
        }
        else{
          d.Fate = -1;
          Unrecorded_count += 1;
        }
        
      })
      
      console.log(AusData);
      
      // First Recorded vs Unrecorded Pie Chart
      data1 = [
        { label: 'Recorded', value: AusData.length - Unrecorded_count },
        { label: 'Unrecorded', value: Unrecorded_count }
      ];
      console.log(data1);

      // Set up dimensions
      
      UR_pieG = svg.append('g').attr('transform', 'translate(' + 400 + ',' + 200 + ')');
      UR_pieG.style('opacity', 0);

      // Set up color scale
      var color1 = d3.scaleOrdinal()
      .range(['#828282', 'white']);

      // Create a pie chart layout
      var pie1 = d3.pie()
      .value(function(d) { return d.value; });

     
      // Create an arc generator
      var arc1 = d3.arc()
      .outerRadius(150)
      .innerRadius(0);

      

      // Draw the pie chart
      var arcs1 = UR_pieG.selectAll('.arc')
      .data(pie1(data1))
      .enter().append('g')
      .attr('class', 'arc')
      .attr("stroke", "black")
      .attr("stroke-width", 1);

      arcs1.append('path')
      .attr('d', arc1)
      .style('fill', function (d) { return color1(d.data.label); });

      // Add percentage labels
      arcs1.append('text')
      .attr('transform', function (d) {
        var centroid = arc1.centroid(d);
        return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
        })
      .attr('dy', '0.35em') // Adjust the vertical position
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('fill', function (d) { 

        if(d.data.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .attr("stroke", function (d) { 

        if(d.data.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .text(function (d) { return d3.format('.1%')(d.data.value / d3.sum(data1, function (d) { return d.value; })); });

      // Add legend
      var legend1 = UR_pieG.selectAll('.legend')
      .data(data1)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) { return 'translate(200,' + (i * 20 - 30) + ')'; });

      legend1.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', function (d) { return color1(d.label); });

      legend1.append('text')
      .attr('x', 20)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .style('fill', function (d) { 
        if(d.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .text(function (d) { return d.label; });


      ///// Second Plot: Record Gender Piechart
      let recordData = AusData.filter((d) => d.Fate !=  -1 );
      let maleData = recordData.filter((d) => d.Gender=='m');
     
      RGender_pieG = svg.append('g').attr('transform', 'translate(' + 400 + ',' + 200 + ')');
      RGender_pieG.style('opacity', 0);
      
      // First Recorded vs Unrecorded Pie Chart
      data2 = [
        { label: 'Male', value: maleData.length },
        { label: 'Female', value: recordData.length - maleData.length }
      ];
      //console.log(data2);
      // Set up color scale
      var color2 = d3.scaleOrdinal()
      .range(["steelblue", 'pink']);

      // Create a pie chart layout
      var pie2 = d3.pie()
      .value(function(d) { return d.value; });

      

      // Create an arc generator
      var arc2 = d3.arc()
      .outerRadius(150)
      .innerRadius(0);

      

      // Draw the pie chart
      var arcs2 = RGender_pieG.selectAll('.arc')
      .data(pie2(data2))
      .enter().append('g')
      .attr('class', 'arc')
      .attr("stroke", "black")
      .attr("stroke-width", 1);

      arcs2.append('path')
      .attr('d', arc2)
      .style('fill', function (d) { return color2(d.data.label); });

      // Add percentage labels
      arcs2.append('text')
      .attr('transform', function (d) {
        var centroid = arc2.centroid(d);
        return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
        })
      .attr('dy', '0.35em') // Adjust the vertical position
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('fill', function (d) { 

        if(d.data.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .attr("stroke", function (d) { 

        if(d.data.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .text(function (d) { return d3.format('.1%')(d.data.value / d3.sum(data2, function (d) { return d.value; })); });

      // Add legend
      var legend2 = RGender_pieG.selectAll('.legend')
      .data(data2)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) { return 'translate(200,' + (i * 20 - 30) + ')'; });

      legend2.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', function (d) { return color2(d.label); });

      legend2.append('text')
      .attr('x', 20)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .style('fill', function (d) { 
        if(d.label == 'Unrecorded')
        {
          return 'white'; 
        }
        return 'black';
        
      })
      .text(function (d) { return d.label; });
      
      // Recorded Age distribution and gender distribution stacked bar chart
      data3 = [
        { ageGroup: '0-15', male:0,  female:0  }, // <=15
        { ageGroup: '15-30', male: 0, female: 0 },// 15<a<=30
        { ageGroup: '30-45', male: 0, female: 0 },
        { ageGroup: '45-60', male: 0, female: 0 },
        { ageGroup: '60-75', male: 0, female: 0 },
        { ageGroup: '75+', male: 0, female: 0 },
       
        // Add more age groups as needed
      ];
      
      recordData.forEach(d => {
        if(d.Age <=15)
        {
          if(d.Gender == "m")
          {
            data3[0].male ++;
          }
          else{
            data3[0].female ++;
          }
        }
        else if(d.Age <=30)
        {
          if(d.Gender == "m")
          {
            data3[1].male ++;
          }
          else{
            data3[1].female ++;
          }
        }
        else if(d.Age <=45)
        {
          if(d.Gender == "m")
          {
            data3[2].male ++;
          }
          else{
            data3[2].female ++;
          }
        }
        else if(d.Age <=60)
        {
          if(d.Gender == "m")
          {
            data3[3].male ++;
          }
          else{
            data3[3].female ++;
          }
        }
        else if(d.Age <=75)
        {
          if(d.Gender == "m")
          {
            data3[4].male ++;
          }
          else{
            data3[4].female ++;
          }
        }
        else
        {
          if(d.Gender == "m")
          {
            data3[5].male ++;
          }
          else{
            data3[5].female ++;
          }
        }
      })
      RAgeGender_stackG = svg.append('g').attr('transform', 'translate(' + 100 + ',' + 50 + ')');
      RAgeGender_stackG.style('opacity', 0);

      chart3 = RAgeGender_stackG.append('g');

      // Create x and y scales
      xScale = d3.scaleBand()
      .domain(data3.map(d => d.ageGroup))
      .range([0, plotWidth])
      .padding(0.1);

      sorted_data3 = Object.keys(data3).map(d=>({"ageGroup": data3[d].ageGroup, "male": data3[d].male, female: data3[d].female}));
      console.log(sorted_data3);
      sorted_data3.sort((a, b) => (b.male + b.female) - (a.male + a.female));

      
      x_Sorted = d3.scaleBand()
      .domain(sorted_data3.map(d => d.ageGroup))
      .range([0, plotWidth])
      .padding(0.1);

      

      yScale = d3.scaleLinear()
      .domain([0, d3.max(data3, d => d.male + d.female)])
      .range([plotHeight, 0]);

      // Create x and y axes
      xAxis = d3.axisBottom(xScale);
      yAxis = d3.axisLeft(yScale);

      // Append x axis to the chart
      // chart3.append("g")
      //   .attr("transform", `translate(0, ${plotHeight})`)
      //   .call(xAxis)
      //   .selectAll("text")  // Select all the text elements for styling
      //   .style("font-size", "16px"); 
      
      chart3_sorted_xaxis = chart3.append("g")
        .attr("transform", `translate(0, ${plotHeight})`)
        .call(xAxis);
        //.call(d3.axisBottom(x_Sorted))
      chart3_sorted_xaxis.selectAll("text")  // Select all the text elements for styling
      .style("font-size", "16px"); 

      // Append y axis to the chart
      chart3.append("g")
        .call(yAxis)
        .selectAll("text")  // Select all the text elements for styling
        .style("font-size", "16px"); 

      // Create stacked bars
      const bars = chart3.selectAll(".bar")
        .data(data3)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", d => `translate(${xScale(d.ageGroup)}, 0)`);

      bars.append("rect")
        .attr("class", "male")
        .attr("y", d => yScale(d.male))
        .attr("width", xScale.bandwidth())
        .attr("height", d => plotHeight - yScale(d.male))
        .attr("fill", "steelblue");

      bars.append("rect")
        .attr("class", "female")
        .attr("y", d => yScale(d.male + d.female))
        .attr("width", xScale.bandwidth())
        .attr("height", d => plotHeight - yScale(d.female))
        .attr("fill", "pink");
      
        // Create a legend
        const legend3 = RAgeGender_stackG.append("g")
          .attr("class", "legend")
          .attr("transform", `translate(${plotWidth-50}, ${margin.top})`);
      
        legend3.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "steelblue");
      
        legend3.append("text")
          .attr("x", 30)
          .attr("y", 10)
          .attr("dy", "0.7em")
          .text("Male");
      
        legend3.append("rect")
          .attr("x", 0)
          .attr("y", 30)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "pink");
      
        legend3.append("text")
          .attr("x", 30)
          .attr("y", 40)
          .attr("dy", "0.7em")
          .text("Female");

        // x-axis, y-axis
        RAgeGender_stackG.append("text").attr("x", plotWidth/2).attr("y", plotHeight+margin.bottom -5 )
            .attr("font-size", "12px")
            .text("Age")
        RAgeGender_stackG.append("text").attr("x", -40).attr("y", plotHeight/2)
                .attr("font-size", "10px")
                .attr("transform", "rotate(-90, -40, " + (plotHeight/2+30) + ")")
                .text("Number of prisoners")























      //////// baseball data process
      baseBallData.forEach(function(d){
        d.H = Number(d.H);
        d.AB = Number(d.AB);
        d['2B'] = Number(d['2B']);
        d['3B'] = Number(d['3B']);
        d['HR'] = Number(d['HR']);
        d.SB = Number(d.SB);
        d.BB = Number(d.BB);
        d.GIDP = Number(d.GIDP);
        d.CS = Number(d.CS);
        d.HR = Number(d.HR);
        d.G = Number(d.G);
        d.salary = Number(d.salary);
      });

      let bbData = baseBallData.filter( (d) => d.AB > 25 );
      
      //data for salary
      let parData = bbData.map((d) => (
              {
              "BA": d.H/d.AB, 
              "OC": d['SO']/d.AB,
              "Salary": d.salary,
              "teamID": d.teamID,
              "nameFirst": d.nameFirst,
              "nameLast": d.nameLast}
          ));

      baExtent = d3.extent(parData, d=>d.BA);
      ocExtent = d3.extent(parData, d=>d.OC);
      

      //////************** create visualization as usual, set every <g> to fully transparent */

      //**** baseball title - bTitleG contains everything about the "title"
      TitleG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      TitleG.style('opacity', 0);
      TitleG.append('text')
        .attr('class', 'title baseballTitle')
        .attr('x', width / 2)
        .attr('y', height / 3)
        .text('17525');
  
      TitleG.append('text')
        .attr('class', 'sub-title baseballTitle')
        .attr('x', width / 2)
        .attr('y', (height / 3) + (height / 5))
        .text('victims');
  

    
    //**** baseball bar chart - barChartG contains everything about the bar chart
    barChartG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    barChartG.style('opacity', 0);

    teamCount = parData.reduce((accumulator, currentValue) => {
      if(accumulator[currentValue.teamID]) {
          accumulator[currentValue.teamID] ++;
        } else {
          accumulator[currentValue.teamID] = 1;
        }
      return accumulator;
      }, {});

    teamCountAry = Object.keys(teamCount).map(d=>({"team": d, "count": teamCount[d]}));
    teamCountExtent = d3.extent(teamCountAry, d=>d.count);

    xUnsorted = d3.scaleBand().domain(teamCountAry.map(d=>d.team)).range([0, plotWidth]).paddingInner(0.3).paddingOuter(0.2);

    teamCountAryBk = Object.keys(teamCount).map(d=>({"team": d, "count": teamCount[d]}));
    teamCountAryBk.sort((a, b)=>b.count - a.count);
    newXaxisArray = teamCountAryBk.map(d=>d.team);
    xSorted = d3.scaleBand().domain(newXaxisArray).range([0, plotWidth]).paddingInner(0.3).paddingOuter(0.2);
    
 
    var y = d3.scaleLinear().domain([0, teamCountExtent[1]]).range([plotHeight, 0]);
    barChartG.append("g")
        .attr("transform", "translate(0,0)")
            .call(d3.axisLeft(y).ticks(5));
    barChartG.append("text").attr("x", plotWidth/2).attr("y", plotHeight+margin.bottom -5 )
            .attr("font-size", "12px")
            .text("team")
    barChartG.append("text").attr("x", -40).attr("y", plotHeight/2+30)
                .attr("font-size", "10px")
                .attr("transform", "rotate(-90, -40, " + (plotHeight/2+30) + ")")
                .text("Number of players")
    barChartXAxisG = barChartG.append("g").attr("transform", "translate(" + 0 + "," + plotHeight + ")")
                .call(d3.axisBottom(xUnsorted));
                
    barChartG.selectAll("rect")
        .data(teamCountAry)
        .enter().append("rect")
        .attr("x", d=>xUnsorted(d.team))
        .attr("y", d=>y(d.count))
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("width", xUnsorted.bandwidth)
        .attr("height", d=>plotHeight - y(d.count))
        .classed("outerBar", true);


  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    var numberOfFunctions = 5;
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showURPieChart;
    activateFunctions[2] = showRGenderPieChart;
    activateFunctions[3] = showRBarChartPlot;
    activateFunctions[4] = showSortedRBarChartPlot;
    //activateFunctions[5] = showBarChartPlot;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < numberOfFunctions; i++) {
      updateFunctions[i] = function () {};
    }
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  function showTitle(){
    UR_pieG.transition().duration(200).style('opacity', 0);

    TitleG.transition().duration(200).style('opacity', 1);
    //circles.on('mouseover', null).on('mouseout', null);
  }

  
  function showURPieChart(){
    TitleG.transition().duration(200).style('opacity', 0);
    RGender_pieG.transition().duration(200).style('opacity', 0);
    // scatterPlotG.transition().duration(200).style('opacity', 0);
    UR_pieG.transition().duration(200).style('opacity', 1);
    // circles.on('mouseover', tip.show).on('mouseout', tip.hide);
  }
  function showRGenderPieChart(){
    UR_pieG.transition().duration(200).style('opacity', 0);
    RAgeGender_stackG.transition().duration(200).style('opacity', 0);
    RGender_pieG.transition().duration(200).style('opacity', 1);
    // TitleG.transition().duration(200).style('opacity', 0);
    // barChartG.transition().duration(200).style('opacity', 0);
    // scatterPlotG.transition().duration(200).style('opacity', 1);
    // circles.on('mouseover', tip.show).on('mouseout', tip.hide);
  }
  
  function showRBarChartPlot(){
    RGender_pieG.transition().duration(200).style('opacity', 0);
    RAgeGender_stackG.transition().duration(200).style('opacity', 1);
    RAgeGender_stackG.selectAll('.bar').transition().duration(500).attr("transform", d => `translate(${xScale(d.ageGroup)}, 0)`);
    chart3_sorted_xaxis.transition().duration(500).call(d3.axisBottom(xScale));
    // chart3_sorted_xaxis.transition().duration(500).call(xAxis);
    // RAgeGender_stackG.selectAll('rect').transition().duration(500).attr('x', d=>xScale(d.ageGroup));
    // TitleG.transition().duration(200).style('opacity', 0);
    // barChartG.transition().duration(200).style('opacity', 0);
    // scatterPlotG.transition().duration(200).style('opacity', 1);
    // circles.on('mouseover', tip.show).on('mouseout', tip.hide);
  }
  // function showBarChartPlot(){
  //   scatterPlotG.transition().duration(200).style('opacity', 0);
  //   barChartG.transition().duration(200).style('opacity', 1);
  //   barChartXAxisG.transition().duration(500).call(d3.axisBottom(xUnsorted));
  //   barChartG.selectAll('rect').transition().duration(500).attr('x', d=>xUnsorted(d.team));
  //   circles.on('mouseover', null).on('mouseout', null);
  // }

  function showSortedRBarChartPlot(){
    console.log(x_Sorted.domain());
    chart3_sorted_xaxis.transition().duration(500).call(d3.axisBottom(x_Sorted));
    RAgeGender_stackG.selectAll('.bar').transition().duration(500).attr("transform", d => `translate(${x_Sorted(d.ageGroup)}, 0)`);

  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
 function display(error, data1, data2) {
   cData = {'data1': data1, 'data2':data2}
  // create a new plot and
  // display it
  
  var plot = scrollVis();
  d3.select('#vis')
    .datum(cData)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}



// load data and display
d3.queue().defer(d3.csv, "data/ausch.csv")
          .defer(d3.csv, "data/players.csv")
          .await(display)

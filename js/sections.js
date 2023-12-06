
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
      
      // Text View
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
        { ageGroup: '0-15', male:0,  female:0  , death:0, survive:0}, // <=15
        { ageGroup: '15-30', male: 0, female: 0,  death:0, survive:0},// 15<a<=30
        { ageGroup: '30-45', male: 0, female: 0,  death:0, survive:0 },
        { ageGroup: '45-60', male: 0, female: 0 , death:0, survive:0},
        { ageGroup: '60-75', male: 0, female: 0 , death:0, survive:0},
        { ageGroup: '75+', male: 0, female: 0 , death:0, survive:0},
       
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

          if(d.Fate)
          {
            data3[0].survive ++;
          }
          else {
            data3[0].death ++;
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
          if(d.Fate)
          {
            data3[1].survive ++;
          }
          else {
            data3[1].death ++;
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
          if(d.Fate)
          {
            data3[2].survive ++;
          }
          else {
            data3[2].death ++;
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
          if(d.Fate)
          {
            data3[3].survive ++;
          }
          else {
            data3[3].death ++;
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
          if(d.Fate)
          {
            data3[4].survive ++;
          }
          else {
            data3[4].death ++;
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
          if(d.Fate)
          {
            data3[5].survive ++;
          }
          else {
            data3[5].death ++;
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

      sorted_data3 = Object.keys(data3).map(d=>({"ageGroup": data3[d].ageGroup, "male": data3[d].male, female: data3[d].female, death: data3[d].death, survive: data3[d].survive}));
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

      
      chart3_sorted_xaxis = chart3.append("g")
        .attr("transform", `translate(0, ${plotHeight})`)
        .call(xAxis);

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
        legend3 = RAgeGender_stackG.append("g")
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

      ///// Death & Survivor in each age group stackbar
      barsSurvivalDeath = chart3.selectAll(".bar-survival-death")
      .data(sorted_data3)
      .enter()
      .append("g")
      .attr("class", "bar-survival-death")
      .attr("transform", d => `translate(${x_Sorted(d.ageGroup)}, 0)`);

      fontSizeScale = d3.scaleLinear()
      .domain([0, 100])
      .range([10, 50]);

      barsSurvivalDeath.append("text")
      .style('opacity', 0)
      .attr("class", "survival-percentage")
      .attr("x", x_Sorted.bandwidth() / 2) // Center text within the bar
      .attr("y", d => yScale(d.survive + d.death)-10) // Adjust the vertical position
      .attr("text-anchor", "middle")
      .attr("font-size", d => {
        size = fontSizeScale((d.survive)/(d.survive + d.death) * 100);
        //console.log(size);
        return `${size}px`;

      })
      .attr("fill", "green")
      .text(d => {
        const total = d.survive + d.death;
        const percentage = (d.survive / total) * 100;
        return percentage.toFixed(1) + "%";
      });

      // Scatter plot
      grouped_data = d3.nest().key(d => d.Age).key(d => d.Gender).entries(recordData);

      
      data4 = [];
      grouped_data.forEach(d => {
        Age = d.key;

        gender_group = d.values;
        
        gender_group.forEach(d => {
          male_dead = 0;
          male_survive = 0;
          female_dead = 0;
          female_survive = 0;

          gender = d.key;
          //console.log(gender);

          if( gender == 'm')
          {
            //console.log("in");
            d.values.forEach(d => {
              if(d.Fate)
              {
                male_survive ++;
              }
              else
              {
                male_dead ++;
              }
            })
            let male_obj = {Age: Age, Gender: 'm', Dead: male_dead, Survive: male_survive};
            data4.push(male_obj);
          }
          else{

            d.values.forEach(d => {
              if(d.Fate)
              {
                female_survive ++;
              }
              else{
                female_dead ++;
              }
            })
            let female_obj = {Age: Age, Gender: 'w', Dead: female_dead, Survive: female_survive};
            data4.push(female_obj);
          }
          
          

        })
        
      })
      console.log(data4);

      ScatterG = svg.append('g').attr('transform', 'translate(' + 100 + ',' + 50 + ')');
      ScatterG.style('opacity', 0);
      
      tip = d3.tip()
      .attr('class', 'd3-tip')
      .attr("opacity", 1)
      .html(d=>(`Total Prisoner: ${d.Dead + d.Survive}<br> Age: ${d.Age} <br> Survive Rate: ${(+d.Survive / (d.Dead + d.Survive)*100).toFixed(2)}%`));
      ScatterG.call(tip);

      // Create x and y scales
      const xScale4 = d3.scaleLinear()
      .domain([0, d3.max(data4, d => +d.Age)]) // Assuming Age is a numeric column
      .range([0, plotWidth]);

      const yScale4 = d3.scaleLinear()
      .domain([0, 100]) // Assuming survival rate is a percentage
      .range([plotHeight, 0]);

      // Create color scale
      const colorScale4 = d3.scaleOrdinal()
        .domain(["m", "w"]) // Assuming Gender is a categorical column
        .range(["steelblue", "pink"]);

      // Create size scale based on total amount
      const sizeScale4 = d3.scaleLinear()
        .domain([0, d3.max(data4, d => +d.Dead + +d.Survive)]) // Assuming totalDead and totalSurvive are numeric columns
        .range([3, 12]); // Adjust the range for desired dot size

      // Create x and y axes
      const xAxis4 = d3.axisBottom(xScale4);
      const yAxis4 = d3.axisLeft(yScale4);

      // Append x axis to the chart
      ScatterG.append("g")
        .attr("transform", `translate(0, ${plotHeight})`)
        .call(xAxis4);

      // Append y axis to the chart
      ScatterG.append("g")
        .call(yAxis4);

      // Add dots to the chart
      const dots = ScatterG.selectAll(".dot")
        .data(data4)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale4(+d.Age))
        .attr("cy", d => yScale4((+d.Survive / (+d.Dead + +d.Survive)* 100).toFixed(2)))
        .attr("r", d => sizeScale4(+d.Dead + +d.Survive))
        .attr("fill", d => colorScale4(d.Gender))
        .attr("opacity", 0.8)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      
      // Create a legend
      legend4 = ScatterG.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${plotWidth-50}, ${margin.top})`);
  
      legend4.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "steelblue");
    
      legend4.append("text")
        .attr("x", 30)
        .attr("y", 10)
        .attr("dy", "0.7em")
        .text("Male");
    
      legend4.append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "pink");
    
      legend4.append("text")
        .attr("x", 30)
        .attr("y", 40)
        .attr("dy", "0.7em")
        .text("Female");

        // Add x-axis title
        ScatterG.append("text")
          .attr("class", "x-axis-title")
          .attr("text-anchor", "middle")
          .attr("x", plotWidth / 2)
          .attr("y", plotHeight + margin.bottom - 10)
          .text("Age");
      
        // Add y-axis title
        ScatterG.append("text")
          .attr("class", "y-axis-title")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", -plotHeight / 2)
          .attr("y", -margin.left + 10)
          .text("Survival Rate (%)");

      // Regression analysis
      
      // reg_data4 = [];
      // data4.forEach(d => {
      //   age = +d.Age;
      //   sur_rate = +(d.Survive / (d.Dead + d.Survive)* 100).toFixed(2);
      //   reg_data4.push([age, sur_rate]);
      // })


      // Create a LOESS regression line
      // const loessLine = d3.regressionLoess()
      // .x(d => d[0])
      // .y(d => d[1])
      // .bandwidth(0.5); // Adjust bandwidth as needed

      // // Calculate the LOESS points based on the data
      // const loessData = loessLine(reg_data4);

      // ScatterG.append("path")
      // .datum(loessData)
      // .attr("fill", "none")
      // .attr("stroke", "blue")
      // .attr("stroke-width", 2)
      // .attr("d", d3.line()
      //   .x(d => d[0])
      //   .y(d => d[1])
      // );
      // console.log(reg_data4);

      // filter0 = reg_data4.filter(d => {return d[1] != 0})
      // console.log(filter0);

      // var order = 3;

      // //console.log(reg_data4);
      // var result = regression.polynomial(filter0, { order: order });

      // // Extract the coefficients from the result
      // var coefficients = result.equation;
      // //console.log(coefficients);

      // var regressionLine = d3.line()
      // .x(function(d) { return xScale4(d[0]); })
      // .y(function(d) {
      //   var y = 0;
      //   for (var i = 0; i < order; i++) {
      //     y += coefficients[i] * Math.pow(d[0], i);
      //   }
      //   return yScale4(y);
      // });
      // console.log(regressionLine.y()([15, 0]))
      // //console.log(result.equation[0], result.equation[1]);

      // ScatterG.append("path")
      // .datum([[1, 0], [20, 2]])
      // .attr("class", "regression-line")
      // .attr("d", regressionLine)
      // .style("stroke", "red");

      
  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    var numberOfFunctions = 7;
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showURPieChart;
    activateFunctions[2] = showRGenderPieChart;
    activateFunctions[3] = showRBarChartPlot;
    activateFunctions[4] = showSortedRBarChartPlot;
    activateFunctions[5] = showDSRBarChartPlot;
    activateFunctions[6] = showScatterPlot;

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
  }


  function showSortedRBarChartPlot(){
    //console.log(x_Sorted.domain());
    chart3_sorted_xaxis.transition().duration(500).call(d3.axisBottom(x_Sorted));
    RAgeGender_stackG.selectAll('.bar').transition().duration(500).attr("transform", d => `translate(${x_Sorted(d.ageGroup)}, 0)`);

    
  barsSurvivalDeath.selectAll("rect")
    .transition() // Apply reverse transition for removal
    .duration(1000)
    .attr("y", plotHeight) // Set to the initial state before removal
    .attr("height", 0)
    .remove(); // Remove the bars after the transition

   
     // Update the first legend item (Male)
     legend3.select("rect")
     .transition() // Apply transition
     .duration(1000)
     .attr("fill", "steelblue"); // Replace "new-color" with the desired color

     legend3.select("text")
     .transition() // Apply transition
     .duration(1000)
     .text("Male"); // Replace "New Male Text" with the desired text

     // Update the second legend item (Female)
     legend3.selectAll("rect")
     .filter((d, i) => i === 1)// Select the second rect element
     .transition() // Apply transition
     .duration(1000)
     .attr("fill", "pink"); // Replace "new-color" with the desired color

     legend3.selectAll("text")
     .filter((d, i) => i === 1) // Select the second text element
     .transition() // Apply transition
     .duration(1000)
     .text("Female");

     barsSurvivalDeath.selectAll("text").transition().duration(200).style('opacity', 0);

  }

  function showDSRBarChartPlot(){
    RAgeGender_stackG.transition().duration(200).style('opacity', 1);
    ScatterG.transition().duration(200).style('opacity', 0);


    barsSurvivalDeath.style('opacity', 1);
    barsSurvivalDeath.append("rect")
    .attr("class", "survivor")
    .attr("y", plotHeight)
    .attr("height", 0)
    .attr("width", x_Sorted.bandwidth())
    .attr("fill", "green")
    .transition() // Apply transition
    .duration(1000)
    .attr("y", d => yScale(d.survive))
    .attr("height", d => plotHeight - yScale(d.survive));
    

    barsSurvivalDeath.append("rect")
      .attr("class", "death")
      .attr("y", plotHeight)
      .attr("height", 0)
      .attr("width", x_Sorted.bandwidth())
      .attr("fill", "red")
      .transition() // Apply transition
      .duration(1000)
      .attr("y", d => yScale(d.survive + d.death))
      .attr("height", d => plotHeight - yScale(d.death));

    
      // Update the first legend item (Male)
      legend3.select("rect")
      .transition() // Apply transition
      .duration(1000)
      .attr("fill", "green"); // Replace "new-color" with the desired color

      legend3.select("text")
      .transition() // Apply transition
      .duration(1000)
      .text("Survivor"); // Replace "New Male Text" with the desired text

      // Update the second legend item (Female)
      legend3.selectAll("rect")
      .filter((d, i) => i === 1)// Select the second rect element
      .transition() // Apply transition
      .duration(1000)
      .attr("fill", "red"); // Replace "new-color" with the desired color

      legend3.selectAll("text")
      .filter((d, i) => i === 1) // Select the second text element
      .transition() // Apply transition
      .duration(1000)
      .text("Death");

      barsSurvivalDeath.selectAll("text").transition().duration(200).style('opacity', 1);
      
  }
  function showScatterPlot(){
    RAgeGender_stackG.transition().duration(200).style('opacity', 0);
    ScatterG.transition().duration(200).style('opacity', 1);
    
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
          .await(display)

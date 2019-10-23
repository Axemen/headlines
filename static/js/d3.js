let svgHeight = 500;
let svgWidth = 800;

let chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
};

let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

let svg = d3.select('#test-graph').append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)

let chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`)
    .attr('height', chartHeight)
    .attr('width', chartWidth);

d3.json(`/get_words/${'trump'}`).then(data => {
    let parseTime = d3.timeParse('%Y')
    data.forEach(d => d.year = parseTime(d.year))

    let xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([0, chartWidth]);
    
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=> d.count)])
        .range([chartHeight, 0]);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.count));

    chartGroup.append('path')
        .datum(data)
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', 'black')
        .attr('d', line);

    let xAxis = d3.axisBottom(xScale).ticks(11);
    let yAxis = d3.axisLeft(yScale).ticks(10);

    chartGroup.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append('g')
        .attr('class', 'yAxis')
        .call(yAxis)
        
        
})

// d3.select('#submit-words').on('click', d => {
//     let words = d3.select('#words-input').property('value')
//     updateBars(words, chartGroup);
// });
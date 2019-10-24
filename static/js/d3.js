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
    .attr('id', 'chartGroup')
    .attr('height', chartHeight)
    .attr('width', chartWidth);

var words = ['trump'];

d3.json(`/get_words/${words.join(',')}`).then(data => {
    let parseTime = d3.timeParse('%Y')
    data.forEach(d => d.year = parseTime(d.year))

    var xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([0, chartWidth]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([chartHeight, 0]);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.count));

    words.forEach(word => {
        chartGroup.append('path')
            .datum(data.filter(d => d.word === word))
            .attr('class', `${word} line`)
            .style('fill', 'none')
            .attr('stroke-width', 3)
            .attr('d', line);
    })

    d3.selectAll('path').style('stroke', (d, i) => color(i))

    let xAxis = d3.axisBottom(xScale).ticks(11);
    let yAxis = d3.axisLeft(yScale).ticks(10);

    chartGroup.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .style('font-size', 14)
        .call(xAxis);

    chartGroup.append('g')
        .attr('class', 'yAxis')
        .style('font-size', 14)
        .call(yAxis)
})

d3.select('#submit-words').on('click', d => {
    let newWord = d3.select('#words-input').property('value')
    words.push(newWord);

    words.filter((value, index, self) => self.indexOf(value) === index)

    addLine(words, d3.select('#chartGroup'));
});

function addLine(words, chartGroup) {
    d3.json(`/get_words/${words}`).then(data => {
        
        let parseTime = d3.timeParse('%Y')
        data.forEach(d => d.year = parseTime(d.year))

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, chartWidth]);

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yScale).ticks(10));

        let line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count));

        words.forEach(word => {
            selection = d3.select(`.${word}`)
            if (!selection.node()) {
                // if the word does not yet have a line draw that line 
                console.log('drawing ' + word)
                chartGroup.append('path')
                    .datum(data.filter(d => d.word === word))
                    .attr('class', `${word} line`)
                    .style('fill', 'none')
                    .attr('stroke-width', 3)
                    .attr('d', line);
            } else {
                // if the word has a line transition the line to the new y-scale
                console.log(`transitioning: ${word}`)
                selection
                    .datum(data.filter(d => d.word === word))
                    .transition()
                    .style('fill', 'none')
                    .attr('d', line)
            }
        })

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        d3.selectAll('.line').style('stroke', (d, i) => color(i))
    })
}
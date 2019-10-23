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

let svg = d3.select('body').append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)

let chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

initBarGraph('us');

d3.select('#submit-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    updateBars(words, chartGroup);
});
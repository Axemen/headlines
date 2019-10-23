
initGraph('us');


let svgHeight = 450;
let svgWidth = d3.select('#bar-graph').node().clientWidth;

let chartMargin = {
    top: 30,
    right: 60,
    bottom: 30,
    left: 60
};

let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

let svg = d3.select('#bar-graph').append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)

let chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

initBarGraph('us');

d3.select('#submit-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    addToGraph(words);
});

d3.select('#remove-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    removeFromGraph(words);
});

d3.select('#submit-word-bar').on('click', d => {
    let word = d3.select('#words-input-bar').property('value')
    d3.select('#current-word-bar').html(`${word}`)
    updateBars(word, chartGroup);
})


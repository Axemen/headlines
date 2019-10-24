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

initLineGraph(words, chartGroup);

// ==================================================================================
// Event Handlers

d3.select('#remove-words').on('click', d => {
    let removedWord = d3.select('#words-input').property('value').split(',');
    removedWord.forEach(rw => d3.select(`.${rw}`).remove())
    words = words.filter(word => !removedWord.includes(word));
    adjustYAxis(words);
})

d3.select('#submit-words').on('click', d => {
    let newWord = d3.select('#words-input').property('value')
    words.push(newWord);
    words = words.filter((value, index, self) => self.indexOf(value) === index)
    addLine(words, d3.select('#chartGroup'));
});



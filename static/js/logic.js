var words = ['us']

let svgBarHeight = 450;
let svgBarWidth = d3.select('#bar-graph').node().clientWidth;

let svgLineHeight = 500;
let svgLineWidth = 800;

let chartMargin = {
    top: 30,
    right: 60,
    bottom: 30,
    left: 60
};

let chartWidth = svgLineWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgLineHeight - chartMargin.top - chartMargin.bottom;

let lineSvg = d3.select('#lineGraph').append('svg')
    .attr('height', svgLineHeight)
    .attr('width', svgLineWidth)

let barSvg = d3.select('#bar-graph').append('svg')
    .attr('height', svgBarHeight)
    .attr('width', svgBarWidth)

let lineChartGroup = lineSvg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`)
    .attr('id', 'LineChartGroup')
    .attr('height', chartHeight)
    .attr('width', chartWidth);

let barChartGroup = barSvg.append('g')
    .attr('id', 'barChartGroup')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

initLineGraph(words, lineChartGroup);

initBarGraph('us');

d3.select('#submit-words').on('click', d => {
    let newWord = d3.select('#words-input').property('value')
    words.push(newWord);
    words = words.filter((value, index, self) => self.indexOf(value) === index)
    addLine(words, d3.select('#LineChartGroup'));
});

d3.select('#remove-words').on('click', d => {
    let removedWord = d3.select('#words-input').property('value').split(',');
    removedWord.forEach(rw => d3.select(`.${rw}`).remove())
    words = words.filter(word => !removedWord.includes(word));
    adjustYAxis(words);
});

d3.select('#submit-word-bar').on('click', d => {
    let word = d3.select('#words-input-bar').property('value')
    d3.select('#current-word-bar').html(`${word}`)
    updateBars(word, barChartGroup);
})


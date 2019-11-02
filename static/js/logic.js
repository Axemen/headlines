var words = ['us']

let multiLine = new MultiLine('lineGraph');

let barGraph = new BarChart('bar-graph');

fetchWordCountByYear('us').then(response => {
    multiLine.init([...response]);
    barGraph.init([...response]);
})

d3.select('#submit-words').on('click', () => {
    let newWord = d3.select('#words-input').property('value').toLowerCase()
    words.push(newWord);
    words = words.filter((value, index, self) => self.indexOf(value) === index)
    addLine(words, d3.select('#LineChartGroup'));
});

d3.select('#remove-words').on('click', () => {
    let removedWord = d3.select('#words-input').property('value').toLowerCase().split(',');
    removedWord.forEach(rw => d3.select(`.${rw}`).remove())
    words = words.filter(word => !removedWord.includes(word));
    adjustYAxis(words);
});

d3.select('#submit-word-bar').on('click', () => {
    let word = d3.select('#words-input-bar').property('value')
    d3.select('#current-word-bar').html(`${word}`)
    updateBars(word, barChartGroup);
})

window.addEventListener('resize', () => {
    multiLine.render();
    barGraph.render();
});
async function fetchWordCountByYear(word) {
    const response = await fetch(`/get_words/${word}`);
    return await response.json();
}




initGraph('us');

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
    updateBarGraph(word)
})


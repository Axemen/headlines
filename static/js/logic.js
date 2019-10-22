
initGraph('us');

d3.select('#submit-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    addToGraph(words);
});

d3.select('#remove-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    removeFromGraph(words);
});


// var traces = []

d3.json('/get_words/us').then(data => {

    let words = data.map(d => d.word).filter(unique)
    let years = data.map(d => d.year)

    traces = words.map(word => createTrace(word, years, data));

    Plotly.plot('graph', traces,
        {
            margin: { t: 0 }
        });
});

d3.select('#submit-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    addToGraph(words);
});

d3.select('#remove-words').on('click', d => {
    let words = d3.select('#words-input').property('value')
    removeFromGraph(words);
});


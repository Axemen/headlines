// let graph = d3.select('#graph').node();


d3.json('/get_words/us').then(data => {

    let words = data.map(d => d.word).filter(unique)
    let years = data.map(d => d.year)

    let traces = words.map(word => createTrace(word, years, data));

    Plotly.plot('graph', traces,
        {
            margin: { t: 0 }
        });



});



d3.select('#submit-words').on('click', d => {

    let words = d3.select('#words-input').property('value')

    updateGraph(words)

})

function updateGraph(words) {

    words.split(',').trim()

    d3.json(`get_words/${words}`).then(data => {

        let uniqueWords = data.map(d => d.word).filter(unique)
        let years = data.map(d => d.year)

        let traces = uniqueWords.map(word => createTrace(word, years, data));

        Plotly.plot('graph', traces,
            {
                margin: { t: 0 }
            });
    });
}
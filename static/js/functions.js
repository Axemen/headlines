
function createTrace(word, data) {
    return {
        x: data.map(o => o.year),
        y: data.map(o => o.count),
        name: word
    }
}

function addToGraph(words) {
    let graph = d3.select('#graph')._groups[0][0].data;
    let stemmed_names = graph.map(o => stemmer(o.name));

    if (stemmed_names.indexOf(stemmer(words)) === -1) {

        let stemmed_word = stemmer(words);

        d3.json(`get_words/${stemmed_word}`).then(data => {
            trace = createTrace(words, data);
            Plotly.addTraces('graph', trace);

        });
    }
}

function removeFromGraph(word) {
    let graph = d3.select('#graph')._groups[0][0].data;
    let names = graph.map(o => o.name);

    let index = names.indexOf(word);
    if (index !== -1) {
        Plotly.deleteTraces('graph', index)
    }

}

function initGraph(word) {
    d3.json(`/get_words/${word}`).then(data => {
        let trace = createTrace(word, data);

        Plotly.plot('graph', [trace],
            {
                margin: { t: 0 },
                showlegend: true,
                legend: {
                    x: 1,
                    y: 0.5
                }
            });
    });
}
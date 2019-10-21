function createTrace(word, years, data) {
    trace = {
        x: [],
        y: [],
        name: word,
    }

    data.forEach(d => {
        if (word === d.word && years.includes(d.year)) {
            trace.x.push(d.year);
            trace.y.push(d.count);
        }
    })
    return trace;
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function uniqueNames(arr) {
    let results = []
    let names = []
    arr.forEach(o => {
        if (!names.includes(o.name)) {
            results.push(o);
            names.push(o.name);
        }
    })
    return results;
}

function addToGraph(words) {

    words.split(',').map(d => d.trim())

    d3.json(`get_words/${words}`).then(data => {

        let uniqueWords = data.map(d => d.word).filter(unique)
        let years = data.map(d => d.year)
        let newTraces = uniqueWords.map(word => createTrace(word, years, data));

        traces = traces.concat(newTraces);

        traces = uniqueNames(traces);

        Plotly.newPlot('graph', traces,
            {
                margin: { t: 0 }
            });
    });
}

function removeFromGraph(word) {
    let graph = d3.select('#graph')._groups[0][0].data;
    let names = graph.map(o => o.name);

    let index = names.indexOf(word);

    Plotly.deleteTraces('graph', index)
}

async function fetchWordCountByYear(word) {
    const response = await fetch(`/get_words/${word}`);
    return await response.json();
}

// let multiLineGraph = new MultiLine('test-graph')

let barGraph = new BarCart('test-graph');

fetchWordCountByYear('us').then(response => {
    // multiLineGraph.init(response);
    console.log('fetching');
    barGraph.init(response);
})

window.addEventListener('resize', () => {
    // multiLineGraph.render();
    barGraph.render();
});

d3.select('#button').on('click', () => {
    // multiLineGraph.addLine('updat');    
})



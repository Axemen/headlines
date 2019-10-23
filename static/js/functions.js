
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

        Plotly.newPlot('graph', [trace],
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

function updateBars(word, chartGroup) {

    word = stemmer(word);

    d3.json(`/get_words/${word}`).then(data => {
        let maxValue = d3.max(data, d => d.count);

        let yLinearScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([chartHeight, 0]);

        chartGroup.selectAll('rect')
            .data(data)
            .transition()
            .attr('y', d => yLinearScale(d.count))
            .attr('height', d => chartHeight - yLinearScale(d.count));

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yLinearScale));

        chartGroup.selectAll("rect")
            .on("mouseover", function (d) {
                return tooltip.style("visibility", "visible").text(d.city + ": " + d.rats);
            })
            .on("mousemove", function (d) {
                return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text(d.city + ": " + d.rats);
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
            });
    }).catch(error => console.log(error))
}

function initBarGraph(word) {

    d3.json(`/get_words/${word}`).then(data => {
        console.log(data);

        let xBandScale = d3.scaleBand()
            .domain(data.map(d => d.year))
            .range([0, chartWidth])
            .padding(0.1);

        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let bottomAxis = d3.axisBottom(xBandScale);
        let leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        chartGroup.append('g')
            .attr('class', 'yAxis')
            .call(leftAxis);

        chartGroup.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        chartGroup.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .style('fill', 'steelblue')
            .attr('x', d => xBandScale(d.year))
            .attr('y', d => yLinearScale(d.count))
            .attr('width', xBandScale.bandwidth())
            .attr('height', d => chartHeight - yLinearScale(d.count));

    }).catch(error => console.log(error))
}
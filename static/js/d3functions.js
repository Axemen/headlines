
function addLine(words, chartGroup) {

    pullWords = words.map(word => stemmer(word))

    d3.json(`/get_words/${words}`).then(data => {

        let parseTime = d3.timeParse('%Y')
        data.forEach(d => d.year = parseTime(d.year))

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, chartWidth]);

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yScale).ticks(10));

        let line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count));

        words.forEach(word => {
            selection = d3.select(`.${word}`)

            if (!selection.node()) {
                // if the word does not yet have a line draw that line 
                chartGroup.append('path')
                    .datum(data.filter(d => d.word === word))
                    .attr('class', `${word} line`)
                    .attr('data-legend', `${word}`)
                    .style('fill', 'none')
                    .attr('stroke-width', 3)
                    .attr('d', line);
            } else {
                // if the word has a line transition the line to the new y-scale
                selection
                    .transition()
                    .attr('d', line(data.filter(d => d.word === word)))
            }
        })

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        d3.selectAll('.line').style('stroke', (d, i) => color(i))
    })
}

function adjustYAxis(words) {
    pullWords = words.map(word => stemmer(word))
    d3.json(`/get_words/${pullWords}`).then(data => {
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yScale).ticks(10));

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, chartWidth]);

        let line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count));

        words.forEach(word => {
            d3.select(`.${word}`)
                .transition()
                .attr('d', line(data.filter(d => d.word === word)))
        })
    })

}

function initLineGraph(words, chartGroup) {
    d3.json(`/get_words/${words.join(',')}`).then(data => {
        let parseTime = d3.timeParse('%Y');
        data.forEach(d => d.year = parseTime(d.year));
        var xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, chartWidth]);
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        console.log(color.domain);
        let line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count));
        words.forEach(word => {
            chartGroup.append('path')
                .datum(data.filter(d => d.word === word))
                .attr('class', `${word} line`)
                .attr('data-legend', `${word}`)
                .style('fill', 'none')
                .attr('stroke-width', 3)
                .attr('d', line);
        });
        d3.selectAll('path').style('stroke', (d, i) => color(i));
        let xAxis = d3.axisBottom(xScale).ticks(11);
        let yAxis = d3.axisLeft(yScale).ticks(10);
        chartGroup.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .style('font-size', 14)
            .call(xAxis);
        chartGroup.append('g')
            .attr('class', 'yAxis')
            .style('font-size', 14)
            .call(yAxis);
    });
}
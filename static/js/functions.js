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

        d3.select('.yAxisBar')
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

        let xBandScale = d3.scaleBand()
            .domain(data.map(d => d.year))
            .range([0, chartWidth])
            .padding(0.1);

        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let bottomAxis = d3.axisBottom(xBandScale);
        let leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        barChartGroup.append('g')
            .attr('class', 'yAxisBar')
            .call(leftAxis);

        barChartGroup.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .attr('class', 'xAxisBar')
            .call(bottomAxis);

        barChartGroup.selectAll('rect')
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

        d3.selectAll('.line').style('stroke', (d, i) => color(i));

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
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

        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute');

        chartGroup.selectAll("rect")
            .on('mouseover', () => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
            })
            .on('mousemove', d => {
                tooltip.html(d.count)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            });
    }).catch(error => console.log(error))
}

function initBarGraph(word) {

    d3.json(`/get_words/${word}`).then(data => {

        // Creating xScale for generating xAxis
        let xBandScale = d3.scaleBand()
            .domain(data.map(d => d.date))
            .range([0, chartWidth])
            .padding(0.1);

        // Creating yScale for use in generating yAxis and scaling data to the svg
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        // Creating the Axis functions themselves
        let bottomAxisBar = d3.axisBottom(xBandScale);
        let leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Creating the tooltip that will show on hover. 
        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute');

        // Appending the yAxis to the chartgroup
        barChartGroup.append('g')
            .attr('class', 'yAxisBar')
            .style('font-size', 12)
            .call(leftAxis);

        // Appending the xAxis to the chartgroup
        barChartGroup.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .attr('class', 'xAxisBar')
            .style('font-size', 12)
            .call(bottomAxisBar);

        // Appending the Bars of the barchart and attaching the tooltips to them. 
        barChartGroup.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .style('fill', 'steelblue')
            .attr('x', d => xBandScale(d.date))
            .attr('y', d => yLinearScale(d.count))
            .attr('width', xBandScale.bandwidth())
            .attr('height', d => chartHeight - yLinearScale(d.count))
            .on('mouseover', () => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
            })
            .on('mousemove', d => {
                tooltip.html(d.count)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            });

    }).catch(error => console.log(error))
}

function initLineGraph(words, chartGroup) {
    d3.json(`/get_words/${words.join(',')}`).then(data => {

        let parseTime = d3.timeParse('%Y');
        data.forEach(d => d.date = parseTime(d.date));

        var xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, chartWidth]);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        let line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.count));

        words.forEach(word => {
            chartGroup.append('path')
                .datum(data.filter(d => d['_id'] === word))
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
            .style('font-size', 12)
            .text('Year')
            .call(xAxis);

        chartGroup.append('g')
            .attr('class', 'yAxis')
            .text('Count of word')
            .style('font-size', 12)
            .call(yAxis);
    });
}

function adjustYAxis(words) {
    console.log('adjusting...')
    pullWords = words.map(word => stemmer(word))
    d3.json(`/get_words/${pullWords}`).then(data => {
        console.log(data)
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yScale).ticks(10));

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, chartWidth]);

        let line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.count));

        words.forEach(word => {
            d3.select(`.${word}`)
                .transition()
                .attr('d', line(data.filter(d => d['_id'] === word)))
        })
    }).catch(error => console.log(error))

}

function addLine(words, chartGroup) {

    pullWords = words.map(word => stemmer(word))

    d3.json(`/get_words/${words}`).then(data => {

        let parseTime = d3.timeParse('%Y')
        data.forEach(d => d.date = parseTime(d.date))

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([chartHeight, 0]);

        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, chartWidth]);

        d3.select('.yAxis')
            .transition()
            .call(d3.axisLeft(yScale).ticks(10));

        let line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.count));

        words.forEach(word => {
            selection = d3.select(`.${word}`)

            if (!selection.node()) {
                // if the word does not yet have a line draw that line 
                chartGroup.append('path')
                    .datum(data.filter(d => d['_id'] === word))
                    .attr('class', `${word} line`)
                    .attr('data-legend', `${word}`)
                    .style('fill', 'none')
                    .attr('stroke-width', 3)
                    .attr('d', line);
            } else {
                // if the word has a line transition the line to the new y-scale
                selection
                    .transition()
                    .attr('d', line(data.filter(d => d['_id'] === word)))
            }
        })

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        d3.selectAll('.line').style('stroke', (d, i) => color(i))
    })
}
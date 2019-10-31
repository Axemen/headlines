class BarChart {
    
    constructor(cssID, margin = null) {
        this.cssID = cssID;
        this.svg = d3.select(`#${cssID}`).append('svg');

        if (!margin) {

            this.margin = {}
            this.margin.top = 20;
            this.margin.right = 50;
            this.margin.left = 60;
            this.margin.bottom = 50;

        } else {

            this.margin = margin;
        }
    }

    init(data) {
        this.data = JSON.parse(JSON.stringify(data));

        this.data = data.sort((a, b) => a._id.year - b._id.year)
        // this.parseTimeYear = d3.timeParse('%Y')
        // this.data.forEach(d => d._id.year = this.parseTimeYear(d._id.year));
        // this.data.forEach(d => d._id.year = d._id.year.getFullYear())

        this.xScale = d3.scaleBand()
            .domain(this.data.map(d => d._id.year))
            .padding(0.1);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.count)])
        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        this.xAxis = d3.axisBottom().ticks(11);
        this.yAxis = d3.axisLeft();

        this.chartWrapper = this.svg.append('g');
        this.chartWrapper.append('g').classed('x axis', true);
        this.chartWrapper.append('g').classed('y axis', true);

        this.chartWrapper.selectAll('rect')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .style('fill', 'steelblue');

        this.render();
    }

    render() {

        const widthStr = d3.select(`#${this.cssID}`).style('width');
        this.width = parseInt(widthStr) - this.margin.left - this.margin.right;
        this.height = .5 * this.width;

        this.xScale.range([0, this.width]);
        this.yScale.range([this.height, 0]);

        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.chartWrapper.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.xAxis.scale(this.xScale);
        this.yAxis.scale(this.yScale);

        this.svg.select('.x.axis')
            .transition()
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxis);
        this.svg.select('.y.axis')
            .transition()
            .call(this.yAxis);

        // Transition bar y values 
        d3.selectAll('rect')
            .transition()
            .attr('x', d => this.xScale(d._id.year))
            .attr('y', d => this.yScale(d.count))
            .attr('height', d => this.height - this.yScale(d.count))
            .attr('width', this.xScale.bandwidth());
    }

    updateBars(newData){
        this.data = newData;
    }
}
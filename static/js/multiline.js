/**
 * This class generates a line graph on the targeted css selection 
 * 
 * @param {string} cssID - string parameter that represents the ID of the div in which to draw the graph. 
 * @param {object=} margin - object containing the values that represent the margin in CSS. ex {left: 20, right: 20, top:20, bottom: 20}
 */
class MultiLine {

    constructor(cssID, margin = null) {
        this.cssID = cssID;
        this.svg = d3.select(`#${cssID}`).append('svg');

        this.parseTimeYear = d3.timeParse('%Y')

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

    /**
     * Initializes the svg that the graph will be drawn on and then renders the graph using the render function. 
     * @param {array} data - an array of objects that has the required data to parse. 
     */
    init(data) {
        this.data = JSON.parse(JSON.stringify(data));
        // Preprocesses the data into the format necessary for this project... Sorting, and parsing into the datetime format. 
        this.data.sort((a, b) => a._id.year - b._id.year)

        this.data.forEach(d => d._id.year = this.parseTimeYear(d._id.year));

        // Sets the Scales that will be used in the project
        this.xScale = d3.scaleTime().domain(d3.extent(this.data, d => d._id.year));
        this.yScale = d3.scaleLinear().domain([0, d3.max(this.data, d => d.count)]);
        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        // Initializes the Axis' that are on the graph. 
        this.xAxis = d3.axisBottom();
        this.yAxis = d3.axisLeft();

        // Initializes the D3 line function that will be used in drawing the paths of the data. 
        this.line = d3.line()
            .x(d => this.xScale(d._id.year))
            .y(d => this.yScale(d.count));

        // Creates the chart within the SVG and appends the Axis' to said group. 
        this.chartWrapper = this.svg.append('g');
        this.chartWrapper.append('g').classed('x axis', true);
        this.chartWrapper.append('g').classed('y axis', true);

        // creates the paths variable which is the collection of paths that are drawn with the data. 
        this.paths = [];
        this.paths.push(this.chartWrapper
            .datum(this.data)
            .append('path')
            .attr('class', 'us line'));

        this.render()
    }
    /**
     * Renders the svg based on the size of the parent element and transitions the graph to the new state. 
     */
    render() {
        // Finds the width of the parent element and then set the new width and height of the SVG based on it. 
        const widthStr = d3.select(`#${this.cssID}`).style('width');
        this.width = parseInt(widthStr) - this.margin.left - this.margin.right;
        this.height = .5 * this.width;

        // Changs the xScale range in order to have it move to a new height. 
        this.xScale.range([0, this.width]);
        this.yScale.range([this.height, 0]);

        // Applies the new width and height to the SVG and moves the chartWrapper to its new location as well. 
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.chartWrapper.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Applies the new scales to the X and Y Axis. 
        this.xAxis.scale(this.xScale);
        this.yAxis.scale(this.yScale);

        // Transitions the x and y axis to the new ranges
        this.svg.select('.x.axis')
            .transition()
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxis);
        this.svg.select('.y.axis')
            .transition()
            .call(this.yAxis);
        
        // selects all .lines on the graph and then colors them based on the scale. 
        d3.selectAll('.line').style('stroke', (d, i) => this.color(i));

        // Iterates through the paths variable and renders each of the paths in the new space. 
        this.paths.forEach(path => {
            const pathData = this.data.filter(d => d._id.word === path.attr('class').split(' ')[0]);
            path
                .transition()
                .attr('d', this.line(pathData));
        })
    }

    /**
     * Takes in a string for a word and draws a line based on that data. 
     * @param {string} word - the word to be drawn on the graph. 
     */
    async addLine(word) {

        // Retrieves the new data and parses it. 
        const newData = await d3.json(`/get_words/${word}`)
        newData.sort((a, b) => a._id.year - b._id.year)
        newData.forEach(d => d._id.year = this.parseTimeYear(d._id.year))

        // Combines the old data and the new data. 
        this.data.push(...newData);

        // set the new domains of the Scales. 
        this.xScale.domain(d3.extent(this.data, d => d._id.year));
        this.yScale.domain([0, d3.max(this.data, d => d.count)]);

        // Pushes the new path to the paths variable. 
        this.paths.push(this.chartWrapper
            .append('path')
            .datum(newData)
            .attr('class', word + ' line'));
        
        // Re-renders the graph to have the new line appear. 
        this.render()
    }
}
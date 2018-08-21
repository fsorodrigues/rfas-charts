// importing d3.js
import * as d3 from 'd3';

// importing modules
import {onlyUnique,parseTimeYear,parseTime} from '../utils';

// importing stylesheets
import '../style/axis.css';

// setting up modules

// defining global variables

// defining Factory function
function RugPlot(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _margin = {t:10, r:25, b:20, l:35};
    let _axisOpacity = 0;
    let _accessor = 'sector';
    let _display = 'Gun';

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // update selection
        let plotUpdate = d3.select(root)
            .select('svg')
            .selectAll('.rug-plot')
            .data([1]);
        // enter selection
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('rug-plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        const filterData = data.filter(d => d[_accessor] ===  _display);

        const listYears = data.map(d => d.year).filter(onlyUnique);
        const sumYears = [];

        for(let year in listYears) {
            const sum = d3.sum(data, d => +d[listYears[year]]);
            const objectify = {'year':+listYears[year],'sum':sum};
            sumYears.push(objectify);
        }

        const minYear = d3.min(sumYears,d => d.year);
        const maxYear = d3.max(sumYears,d => d.year);

        // setting up scales
        const scaleX = d3.scaleTime()
            .domain([parseTimeYear(minYear),parseTimeYear(maxYear)])
            .range([0,w]);
        const scaleY = d3.scaleLinear()
            .domain([0,h])
            .range([h,0]);

        // appending lines to plot
        let lineUpdate = plotUpdate.selectAll('.lines')
            .data(filterData);
        const lineEnter = lineUpdate.enter()
            .append('line');
        lineUpdate = lineUpdate.merge(lineEnter)
            .classed('lines', true)
            .attr("x1", d => scaleX(parseTime(d.date_intro)))
            .attr("x2", d => scaleX(parseTime(d.date_intro)))
            .attr("y1", scaleY(100))
            .attr("y2", scaleY(0))
            .style('stroke', 'black')
            .style('stroke-opacity',0.5);

    }

    // create getter-setter pattern for customization
    exports.curve = function(_) {
		// _ is a d3 built-in function
		if (typeof _ === "undefined") return _curve;
		_curve = _;
		return this;
	};

    exports.display = function(_) {
        // _ expects a string
        if (typeof _ === "undefined") return _display;
        _display = _;
        return this;
    };

    // returning module
    return exports;
}

// exporting factory function as default
export default RugPlot;

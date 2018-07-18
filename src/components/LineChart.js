// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatYear,formatMillionsMoney} from '../utils';

// importing stylesheets
import '../style/axis.css';

// setting up modules

// defining global variables

// defining Factory function
function LineChart(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _margin = {t:10, r:25, b:20, l:35};
    let _curve = d3.curveLinear;
    let _axisOpacity = 0;
    let _accessor = 'Sector';

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = _;

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // appending svg & <g> plot
        // update selection
        let svg = d3.select(root)
            .selectAll('svg')
            .data([1]);
        // enter selection
        const svgEnter = svg.enter()
            .append('svg');
        // exit selection
        svg.exit().remove();
        // enter+update selection
        svg = svg.merge(svgEnter)
            .attr('height', clientHeight)
            .attr('width', clientWidth);

        // update selection
        let plotUpdate = svg.selectAll('.plot')
            .data([1]);
        // enter selection
        const plotEnter = plotUpdate.enter()
            .append('g')
            .attr('class','vertical')
            .classed('plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        const listYears = Object.keys(data[0]).filter(d => +d);
        const sumYears = [];

        for(let year in listYears) {
            const sum = d3.sum(data, d => +d[listYears[year]]);
            const objectify = {'year':+listYears[year],'sum':sum};
            sumYears.push(objectify);
        }

        // setting up scales
        const scaleX = d3.scaleLinear()
            .domain(d3.extent(sumYears,d => d.year))
            .range([0,w]);
        const scaleY = d3.scaleLinear()
            .domain([0,d3.max(sumYears, d => d.sum)])
            .range([h,0]);

        // setting up line generator path
        const line = d3.area()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.sum))
            .curve(_curve);

        const area = d3.area()
            .x(d => scaleX(+d.year))
            .y0(d => scaleY(0))
            .y1(d => scaleY(d.sum))
            .curve(_curve);

        // appending <g> to plot
        // individual <g> for areas
        // enter-exit-update pattern
        // update selection
        let groupUpdate = plotUpdate.selectAll('.line-wrapper')
            .data([sumYears]);
        // enter selection
        const groupEnter = groupUpdate.enter()
            .append('g');
        // exit selection
        groupUpdate.exit().remove();
        // update + enter selection
        groupUpdate = groupUpdate.merge(groupEnter)
            .classed('line', true);

        // appending paths to groups
        let lineUpdate = groupUpdate.selectAll('.area-chart')
            .data(d => [d]);
        const lineEnter = lineUpdate.enter()
            .append('path');
        lineUpdate = lineUpdate.merge(lineEnter)
            .classed('area-chart', true)
            .attr('d', area)
            .style('fill', '#FFA500')
            .style('fill-opacity',0.5);

        let areaUpdate = groupUpdate.selectAll('.line-chart')
            .data(d => [d]);
        const areaEnter = areaUpdate.enter()
            .append('path');
        areaUpdate = areaUpdate.merge(areaEnter)
            .classed('line-chart', true)
            .attr('d', line)
            .style('stroke', '#FFA500')
            .style('stroke-width',2)
            .style('fill', 'none')
            .style('fill-opacity',0);

        //Set up axis generator
        const axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w)
            .ticks(5)
            .tickFormat(d => formatMillionsMoney(d));

        const axisX = d3.axisBottom()
            .scale(scaleX)
            .ticks(5)
            .tickFormat(d => formatYear(d));

        // draw axis
        // x-axis
        const axisXNode = plotUpdate.selectAll('.axis-x')
            .data([1]);
        const axisXNodeEnter = axisXNode.enter()
            .append('g')
            .attr('class','axis axis-x vertical');
        axisXNode.merge(axisXNodeEnter)
            .attr('transform',`translate(0,${h})`)
            .call(axisX);
        // y-axis
        const axisYNode = plotUpdate.selectAll('.axis-y')
            .data([1]);
        const axisYNodeEnter = axisYNode.enter()
            .append('g')
            .attr('class','axis axis-y vertical');
        axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(${0},${0})`)
            .call(axisY);

        plotUpdate.select('.axis-y')
            .select('.tick:first-of-type')
            .style('opacity',_axisOpacity);
    }

    // create getter-setter pattern for customization
    exports.curve = function(_) {
		// _ is a d3 built-in function
		if (typeof _ === "undefined") return _curve;
		_curve = _;
		return this;
	};

    // returning module
    return exports;
}

// exporting factory function as default
export default LineChart;

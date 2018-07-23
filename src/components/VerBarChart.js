// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {filterData,formatMillionsMoney,delay,contains} from '../utils';

// importing stylesheets
import '../style/axis.css';

// defining Factory function
function VerBarChart(_) {

    // TO DO: create getter-setter variables in factory scope
    let _barHeight = '2018';
    let _yScale = '2015';
    let _accessor = 'Sector';
    let _subset = ['Health Care'];
    let _display = 'Health Care';
    let _axisOpacity = 0;
    let _margin = {t:5, r:20, b:20, l:35};
    let _padding = 0;

    function exports(data) {

        // selecting root element ==> svg container, div where function is called in index.js
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
            .attr('class', 'vertical')
            .classed('plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        const filterData = contains(data,_subset,_accessor);

        const unstack = Object.entries(filterData.filter(d => d[_accessor] == _display)[0])
            .filter(d => +d[0]);
        const unstackedData = [];

        unstack.forEach(d => {
            const objectify = {'year':d[0],value:+d[1]};
            unstackedData.push(objectify);
        });

        // Setting up scales
        const scaleX = d3.scaleBand()
            .domain(unstackedData.map(d => d.year))
            .range([0,w])
        	.paddingInner(0.05)
            .paddingOuter(0.1);

        const maxVolume = d3.max(data,d => +d[_yScale]);
        const scaleY = d3.scaleLinear()
            .domain([0, maxVolume])
            .range([h,0])
            .nice();

        // Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-w)
            .tickFormat(d => formatMillionsMoney(d))
			.ticks(5);
		const axisX = d3.axisBottom()
			.scale(scaleX)
            .tickSize(0)
            .ticks(5);

        //Axis
		let axisXNode = plotUpdate.selectAll('.axis-x')
			.data([1]);
		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis axis-x vertical');
		axisXNode = axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${h})`)
			.call(axisX);

        axisXNode.selectAll('text')
            .attr('dx', -3);

		let axisYNode = plotUpdate.selectAll('.axis-y')
			.data([1]);
		const axisYNodeEnter = axisYNode.enter()
			.append('g')
			.attr('class','axis axis-y vertical');
		axisYNode = axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(-${3},${0})`)
            .transition()
            .duration(800)
			.call(axisY);

        let binsUpdate = plotUpdate.selectAll('.bin')
            .data(unstackedData, d => d.year);
        binsUpdate.exit()
            .transition()
            .duration(300)
            .attr('fill-opacity',0)
            .attr('x', h)
            .remove();
        const binsEnter = binsUpdate.enter()
            .append('rect')
            .attr('class', d => `bin-${d.year}`)
            .classed('bin', true)
            .attr('fill','#FFA500')
            .attr('fill-opacity',0.8)
            .attr('width', scaleX.bandwidth())
            .attr('x', d => scaleX(d.year))
            .attr('y', h)
            .attr('height',0)
            .transition()
            .delay(900)
            .duration(600)
            .attr('height', d => h - scaleY(d.value))
            .attr('y', d => scaleY(d.value));

        binsUpdate.transition()
            .duration(800)
            .attr('height', d => h - scaleY(d.value))
            .attr('y', d => scaleY(d.value));


    }

    // create getter-setter pattern for customization
    exports.barHeight = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode bar height
        if (_ === 'undefined') return _barHeight;
        _barHeight = _;
        return this;
    };

    exports.accessor = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode x Axis
        if (_ === 'undefined') return _accessor;
        _accessor = _;
        return this;
    };

    exports.yScale = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode y Axis
        if (_ === 'undefined') return _yScale;
        _yScale = _;
        return this;
    };

    exports.subset = function(_) {
        // _ expects an array of strings
        if (_ === 'undefined') return _subset;
        _subset = _;
        return this;
    };

    exports.display = function(_) {
        // _ expects a string
        if (_ === 'undefined') return _display;
        _display = _;
        return this;
    };

    exports.axisOpacity =  function(_) {
        // _ expects [0-1] int/float value
        if (_ === 'undefined') return _axisOpacity;
        _axisOpacity = _;
        return this;
    };

    exports.margin =  function(_) {
        // _ expects a object with t,r,b,l properties
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default VerBarChart;

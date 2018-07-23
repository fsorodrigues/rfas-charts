// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {filterData,formatMillionsMoney,delay} from '../utils';

// importing stylesheets
import '../style/axis.css';

// defining Factory function
function HorBarChart(_) {

    // TO DO: create getter-setter variables in factory scope
    let _barLength = '2018';
    let _sortBy = '2018';
    let _xScale = '2016';
    let _yAxis = 'Sector';
    let _topN = 20;
    let _axisOpacity = 0;
    let _margin = {t:5, r:20, b:20, l:120};
    let _padding = 0;
    let _display;

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
            .attr('class','horizontal')
            .classed('plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        // data transformation
        let topN = data.sort((a,b) => (+b[_sortBy]) - (+a[_sortBy]));
        if (_display) {
            topN = topN.filter(d => d['Sector'] == _display);
        }
        topN = topN.slice(0,_topN);

        // Setting up scales
        const scaleY = d3.scaleBand()
            .domain(topN.map(d => d[_yAxis]))
            .range([0,h])
        	.paddingInner(0.05)
            .paddingOuter(0.1);

        const maxVolume = d3.max(data, d => +d[_xScale]);
        const scaleX = d3.scaleLinear()
            .domain([0, maxVolume])
            .range([0,w])
            .nice();

        //Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(0)
			.ticks(5);
		const axisX = d3.axisBottom()
			.scale(scaleX)
            .tickSize(-h)
            .tickFormat(d => formatMillionsMoney(d))
            .ticks(5);

        //Axis
		let axisXNode = plotUpdate.selectAll('.axis-x')
			.data([1]);
		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis axis-x horizontal');
		axisXNode = axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${h})`)
			.call(axisX);

        axisXNode.selectAll('text')
            .attr('dx', -3);

		const axisYNode = plotUpdate.selectAll('.axis-y')
			.data([1]);
		const axisYNodeEnter = axisYNode.enter()
			.append('g')
			.attr('class','axis axis-y horizontal');
		axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(-${3},${0})`)
            .transition()
            .delay(300)
            .duration(800)
			.call(axisY);

        let binsUpdate = plotUpdate.selectAll('.bin')
            .data(topN, d => d[_yAxis]);
        binsUpdate.exit()
            .transition()
            .duration(300)
            .attr('fill-opacity',0)
            .attr('y', d => h)
            .remove();
        const binsEnter = binsUpdate.enter()
            .append('rect')
            .attr('class', d => d[_yAxis])
            .classed('bin', true)
            .attr('y', d => scaleY(d[_yAxis]))
            .attr('x', d => 0)
            .attr('fill','#FFA500')
            .attr('fill-opacity',0.8)
            .attr('height', scaleY.bandwidth())
            .transition()
            .delay(900)
            .duration(600)
            .attr('width', d => scaleX(d[_barLength]));
        binsUpdate.transition()
            .duration(300)
            .attr('width', d => scaleX(d[_barLength]))
            .transition()
            .duration(800)
            .attr('y', d => scaleY(d[_yAxis]));


    }

    // create getter-setter pattern for customization
    exports.barLength = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode bar height
        if (_ === 'undefined') return _barLength;
        _barLength = _;
        return this;
    };

    exports.sortBy = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode bar height
        if (_ === 'undefined') return _sortBy;
        _sortBy = _;
        return this;
    };

    exports.yAxis = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode x Axis
        if (_ === 'undefined') return _yAxis;
        _yAxis = _;
        return this;
    };

    exports.xScale = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode y Axis
        if (_ === 'undefined') return _xScale;
        _xScale = _;
        return this;
    };

    exports.topN = function (_) {
        // _ expects an integer
        if (_ === 'undefined') return _topN;
        _topN = _;
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
export default HorBarChart;

// importing d3.js
import * as d3 from 'd3';

function Network(_) {

    // create getter-setter variables in factory scope
    let _margin = {t:0,r:0,b:0,l:0};
    let _linkDistance = 80;
    let _chargeStrength = -100;
    let _radiusCollide = 18;
    let _display = 'MMR';

    const _dispatch = d3.dispatch('circle:enter','circle:leave');

    function exports(data) {

        // declaring root element
        const root = _;

        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        const filterData = data.filter(d => d.firm === _display)[0];

        // append svg element to root
        let svg = d3.select(root)
            .selectAll('svg')
            .data([1]);
        const svgEnter = svg.enter()
            .append('svg');
        svg = svg.merge(svgEnter)
            .classed('svg',true)
            .attr('height',h)
            .attr('width',w);

        let plot = svg.selectAll('plot')
            .data([1]);
        const plotEnter = plot.enter()
            .append('g');
        plot = plot.merge(plotEnter)
            .classed('plot',true);

        // create simulation
        const simulation = d3.forceSimulation();

        // create forces
        const charge = d3.forceManyBody().strength(_chargeStrength);
        const radius = d3.forceCollide().radius(_radiusCollide);
        const center = d3.forceCenter(w/2,h/2);
        const linkForce = d3.forceLink().distance(_linkDistance).id((d) => d.entity);

        // add forces to simulation
        simulation.force('charge',charge)
            .force('radius', radius)
            .force('center',center)
            .force('link',linkForce);

        let link = plot.selectAll('.links')
            .data([1]);
        const linkEnter = link.enter()
            .append('g');
        link.exit().remove();
        link = link.merge(linkEnter)
            .attr('class', 'links');

        let linkLines = link.selectAll('.line')
            .data(filterData.links);
        const linkLinesEnter = linkLines.enter()
            .append('line');
        linkLines.exit().remove();
        linkLines = linkLines.merge(linkLinesEnter)
            .classed('line',true)
            .attr('stroke', 'darkgrey')
            .attr('stroke-width', 0.5);

        let node = plot.selectAll('.nodes')
            .data([1]);
        const nodeEnter = node.enter()
            .append('g');
        node.exit().remove();
        node = node.merge(nodeEnter)
            .attr('class','nodes');

        let nodeCircles = node.selectAll('.circle')
            .data(filterData.nodes);
        const nodeCirclesEnter = nodeCircles.enter()
            .append('circle');
        nodeCircles.exit().remove();
        nodeCircles = nodeCircles.merge(nodeCirclesEnter)
            .attr('class', d => d.group)
            .classed('circle', true)
            .attr('id', d => d.entity)
            .attr('r', d => scaleRadius(groupLookup(d.group)))
            .on('mouseenter', function(d) {
                _dispatch.call('circle:enter',this,d);
            })
            .on('mouseleave', function(d) {
                _dispatch.call('circle:leave',this,null);
            });

        node.selectAll('.issue')
            .attr('fill', 'none')
            .attr('fill', '#FFA500')
            .attr('fill-opacity',0.5)
            .attr('stroke','#FFA500')
            .attr('stroke-width',1);

        node.selectAll('.firm')
            .attr('fill', '#FF8C00')
            .attr('fill-opacity',0.8);

        node.selectAll('.employer')
            .attr('fill', 'Gold');

        simulation.nodes(filterData.nodes)
            .on('tick', ticked);

        simulation.force('link')
            .links(filterData.links);

        function ticked() {
            linkLines.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            nodeCircles.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });
        }

        const zoom = d3.zoom()
            .on('zoom', zoomed);

        function zoomed() {
            const transform = d3.event.transform;

            linkLines.attr('transform', d3.event.transform);
            nodeCircles.attr('transform', d3.event.transform);

            // circles.attr('cx', d => transform.applyX(scaleX(d)))
            //     .attr('cy', d => transform.applyX(scaleY(d)));
        }

        svg.call(zoom);

    }

    // create getter-setter functions
    exports.margin = function(_) {
        // _ is an object {t,r,b,l}
        if (_ === 'undefined') return _margin;
        _margin = _;
        return this;
    };

    exports.display = function(_) {
        // _ expects and int/float number
        if (_ === 'undefined') return _display;
        _display = _;
        return this;
    };

    exports.linkDistance = function(_) {
        // _ expects an int/float number
        if (_ === 'undefined') return _linkDistance;
        _linkDistance = _;
        return this;
    };

    exports.radiusCollide = function(_) {
        // _ expects an int/float number
        if (_ === 'undefined') return _radiusCollide;
        _radiusCollide = _;
        return this;
    };

    exports.chargeStrength = function(_) {
        // _ expects an int/float number
        if (_ === 'undefined') return _chargeStrength;
        _chargeStrength = _;
        return this;
    };

    exports.on = function(eventType,cb) {
        // eventType expects a string
        // cb expects a function
        _dispatch.on(eventType,cb);
        return this;
    };

    return exports;
}

export default Network;

const groupLookup = d3.scaleOrdinal()
    .domain(['firm','issue','employer'])
    .range([9,6,3]);

const scaleRadius =  d3.scalePow()
    .exponent(1/2)
    .domain([9,3])
    .range([12,3]);

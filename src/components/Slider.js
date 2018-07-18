// importing d3.js
import * as d3 from 'd3';

// importing accessory functions

// importing stylesheets
import '../style/slider.css';

// defining Factory function
function Slider(_) {

    // create getter-setter variables in factory scope
    let _leftLabel = 'Slide to see other years';
    let _rightLabel = 'Current year';

    // declaring dispatch
    const _dispatch = d3.dispatch('slider:moved');

    function exports(data) {
        // selecting root element ==> svg container, div where function is called in index.js
        const root = _;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;

        let container = d3.select(root)
            .selectAll('.slider-container')
            .data([1]);
        const containerEnter = container.enter()
            .append('div');
        container = container.merge(containerEnter)
            .classed('slider-container',true);

        // setting up scales

        // data transformation
        const getYears = data.columns.filter(d => +d);

        // appending slider left label
        let left = container.selectAll('.left-slider-label')
            .data([_leftLabel]);
        const leftEnter = left.enter()
            .append('span');
        left = left.merge(leftEnter)
            .classed('left-slider-label',true)
            .html(d => d.toLowerCase());

        // appending buttons
        let slider = container.selectAll('.slider')
            .data([getYears]);
        const sliderEnter = slider.enter()
            .append('input');
        slider = slider.merge(sliderEnter)
            .classed('slider', true)
            .attr('type', 'range')
            .attr('min', d => d3.min(d, e => e))
            .attr('max', d => d3.max(d, e => e))
            .attr('step', 1)
            .attr('value', 2018)
            .on('input', function(d) {
                _dispatch.call('slider:moved',this,data,d);
            });

        let mark = container.selectAll('.mark-text')
            .data([1]);
        const markUpdate = mark.enter()
            .append('mark');
        mark = mark.merge(markUpdate)
            .classed('mark-text',true);

        // appending slider right label
        let right = mark.selectAll('.right-slider-label')
            .data([_rightLabel]);
        const rightEnter = right.enter()
            .append('span');
        right = right.merge(rightEnter)
            .classed('right-slider-label',true)
            .html(d => {
                const currentYear = slider.node().value;
                // return `${d.toLowerCase()} <b>${currentYear}</b>`;
                return `<b>${currentYear}</b>`;
            });
    }

    // create getter-setter pattern for customization
    exports.on = function(eventType, cb) {
		// eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
	};

    exports.leftLabel = function(_) {
        // _ is a string
        if (_ === 'undefined') return _leftLabel;
        _leftLabel = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default Slider;

// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {contains} from '../utils';

// importing stylesheets
import '../style/dropdown.css';

// defining Factory function
function DropdownBars(_) {

    // create getter-setter variables in factory scope
    let _subset = ['Health Care'];
    let _accessor = 'Sector';
    let _leftLabel = 'Select sector to visualize';

    // declaring dispatch
    const _dispatch = d3.dispatch('menu:selected');

    function exports(data) {
        // selecting root element ==> svg container, div where function is called in index.js
        const root = _;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;

        let container = d3.select(root)
            .selectAll('.menu-container')
            .data([1]);
        const containerEnter = container.enter()
            .append('div');
        container = container.merge(containerEnter)
            .classed('menu-container',true);

        // appending slider left label
        let left = container.selectAll('.left-menu-label')
            .data([_leftLabel]);
        const leftEnter = left.enter()
            .append('span');
        left = left.merge(leftEnter)
            .classed('left-menu-label',true)
            .html(d => d.toLowerCase());

        // setting up scales
        const nestData = d3.nest()
            .key(d => d.Sector)
            .entries(data)
            .map(d => {
                const objectify = {};
                objectify[_accessor] = d.key;

                return objectify;
        });

        const filterData = contains(nestData,_subset,_accessor);

        // appending menu
        let dropdown = container.selectAll('.dropdown-menu')
            .data([1]);
        const dropdownEnter = dropdown.enter()
            .append('select')
            .classed('dropdown-menu', true);
        dropdown = dropdown.merge(dropdownEnter)
            .on('input', function(d) {
                const value = d3.select(this).node().value;
                _dispatch.call('menu:selected',this,data,value);
            });

        let options = dropdown.selectAll('option')
            .data(filterData);
        const optionsEnter = options.enter()
            .append('option');
        options = options.merge(optionsEnter)
            .attr('value', d => d.Sector)
            .text(d => d.Sector);

    }

    // TO DO: create getter-setter pattern for customization
    exports.on = function(eventType, cb) {
		// eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
	};

    exports.subset = function(_) {
        // _ expects an array of strings
        if (_ === 'undefined') return _subset;
        _subset = _;
        return this;
    };

    exports.accessor = function(_) {
        // _ expects a string ===> accessor to column in csv/json property that will encode x Axis
        if (_ === 'undefined') return _accessor;
        _accessor = _;
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
export default DropdownBars;

import * as d3 from 'd3';

// importing accessory functions
import {capitalize} from '../utils';

// importing stylesheets
// import '../style/dropdown.css';

function Tooltip() {

    //

    function exports(data,ctx) {

        const root = ctx;

        let group = root.selectAll('.info-entity')
            .data([data]);
        const groupEnter = group.enter()
            .append('p');
        group = group.merge(groupEnter)
            .classed('info-entity',true)
            .html(d => `<b>${capitalize(d.group)}:</b> ${capitalize(d.entity)}`);

    }

    return exports;
}

export default Tooltip;

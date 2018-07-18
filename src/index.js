const msg = 'webpack template running';
console.log(msg);

// funcs
import * as d3 from 'd3';
import {parse} from './utils';

// CSS
import './style/main.css';

// Modules
import HorBarChart from './components/HorBarChart';
import VerBarChart from './components/VerBarChart';
import Slider from './components/Slider';
import DropdownBars from './components/DropdownBars';
import Network from './components/Network';
import DropdownNetworks from './components/DropdownNetworks';
import LineChart from './components/LineChart';
import Tooltip from './components/Tooltip';
// import Zoom from './components/Zoom';

// const zoom = Zoom(document.querySelector('.test'));

// zoom([1,1010,1020,5000]);

// global variables
const subset = ['Health Care','Energy','Environment','Telecommunications',
                'Education','Marijuana','Pharmaceuticals','Gun'];

// Instantiating Modules
const sectorsTop20 = HorBarChart(document.querySelector('#sectors-top25'))
    .barLength('2018')
    .sortBy('2018')
    .xScale('2016')
    .yAxis('Sector')
    .topN(25);
const sliderSectors = Slider(document.querySelector('#sectors-top25-slider'));

const sectorsYearly = VerBarChart(document.querySelector('#sectors-yearly'))
    .subset(subset);
const sectorsYearlyMenu = DropdownBars(document.querySelector('#sectors-yearly-menu'))
    .subset(subset);

const firmsTop5 = HorBarChart(document.querySelector('#firms-top10'))
    .barLength('2018')
    .sortBy('2018')
    .xScale('2017')
    .yAxis('Registrant Name')
    .topN(10);
const sliderFirms = Slider(document.querySelector('#firms-top10-slider'));

const firmsNetworks = Network(document.querySelector('#firms-networks'));

const firmsNetworksMenu = DropdownNetworks(document.querySelector('#firms-networks-menu'));
const firmsNetworks2 = Network(document.querySelector('#firms-networks-2'))
    .radiusCollide(20)
    .linkDistance(10)
    .chargeStrength(-10);
const firmsNetworksMenu2 = DropdownNetworks(document.querySelector('#firms-networks-2-menu'));

const tooltip = Tooltip();

const lobbyTotals = LineChart(document.querySelector('#lobby-totals'));
const gunTotals = LineChart(document.querySelector('#gun-totals'));
const marijuanaTotals = LineChart(document.querySelector('#marijuana-totals'));

// Loading data
const sectors = d3.csv('./data/sector-amount-total.csv', parse);
const firms = d3.csv('./data/firms-amount-total.csv', parse);
const firmsConnections = d3.json('./data/firms-network.json');
const firmsConnections2 = d3.json('./data/firms-network-backup.json');

// Drawing
sectors.then((sectors) => {
    sliderSectors(sectors);
    sectorsTop20(sectors);

    sectorsYearly(sectors);
    sectorsYearlyMenu(sectors);

    lobbyTotals(sectors);

    const gun = sectors.filter(d => d.Sector === 'Gun');
    gunTotals(gun);

    const marijuana = sectors.filter(d => d.Sector === 'Marijuana');
    marijuanaTotals(marijuana);
});

sliderSectors.on('slider:moved',function(data) {
    const newYear = +this.value;
    sectorsTop20.barLength(newYear);
    sectorsTop20(data);
    sliderSectors(data);
});

sectorsYearlyMenu.on('menu:selected',function(data,value) {
    sectorsYearly.display(value);
    sectorsYearly(data);
});

firms.then((firms) => {
    sliderFirms(firms);
    firmsTop5(firms);
});

sliderFirms.on('slider:moved',function(data) {
    const newYear = +this.value;
    firmsTop5.barLength(newYear)
        .sortBy(newYear);
    firmsTop5(data);
    sliderFirms(data);
});

firmsConnections.then((firmsConnections) => {
    firmsNetworks(firmsConnections.data);
    firmsNetworksMenu(firmsConnections);
});

firmsNetworks.on('circle:enter', function(d,ctx) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);
    console.log(rootNodeId);

    tooltip(d,tooltipSelection);

    const left = d3.event.pageX;
    const top = d3.event.pageY - 28;

    tooltipSelection.style('left',`${left}px`)
        .style('top',`${top}px`);
})
.on('circle:leave', function(d,ctx) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);

    tooltipSelection.style('left',0)
        .style('top',0);
    tooltipSelection.html('');
});

firmsNetworksMenu.on('menu:selected',function(data,value) {
    firmsNetworks.display(value);
    firmsNetworks(data.data);
});

firmsConnections2.then((firmsConnections2) => {
    firmsNetworks2(firmsConnections2.data);
    firmsNetworksMenu2(firmsConnections2);
});

firmsNetworksMenu2.on('menu:selected',function(data,value) {
    firmsNetworks2.display(value);
    firmsNetworks2(data.data);
});

firmsNetworks2.on('circle:enter', function(d,ctx) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);

    tooltip(d,tooltipSelection);

    const left = d3.event.pageX;
    const top = d3.event.pageY - 28;

    tooltipSelection.style('left',`${left}px`)
        .style('top',`${top}px`);
})
.on('circle:leave', function(d,ctx) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);

    tooltipSelection.style('left',0)
        .style('top',0);
    tooltipSelection.html('');
});

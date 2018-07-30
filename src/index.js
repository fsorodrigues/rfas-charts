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
import RugPlot from './components/RugPlot';
import Tooltip from './components/Tooltip';

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
    .radiusCollide(15)
    .linkDistance(10)
    .chargeStrength(-30);
const firmsNetworksMenu2 = DropdownNetworks(document.querySelector('#firms-networks-2-menu'));

const tooltip = Tooltip();

const lobbyTotals = LineChart(document.querySelector('#lobby-totals'));
const gunTotals = LineChart(document.querySelector('#gun-totals'));
const marijuanaTotals = LineChart(document.querySelector('#marijuana-totals'));
const healthCareTotals = LineChart(document.querySelector('#health-care-totals'));

const top5EmployersSectors = HorBarChart(document.querySelector('#top5-employers-sectors'))
    .xScale('Amount')
    .barLength('Amount')
    .sortBy('Amount')
    .display('Health Care')
    .yAxis('Registrant Name')
    .topN(10);
const top5EmployersSectorsMenu = DropdownBars(document.querySelector('#top5-employers-sectors-menu'))
    .subset(subset);

const gunsRugPlot = RugPlot(document.querySelector('#gun-totals'));
const marijuanaRugPlot = RugPlot(document.querySelector('#marijuana-totals'))
    .display('Marijuana');
const healthCareRugPlot = RugPlot(document.querySelector('#health-care-totals'))
    .display('Health Care');

// Loading data
const sectors = d3.csv('./data/sector-amount-total.csv',parse);
const firms = d3.csv('./data/firms-amount-total.csv',parse);
const firmsConnections = d3.json('./data/firms-network.json');
const firmsConnections2 = d3.json('./data/firms-network-backup.json');
const employersSectors = d3.csv('./data/employers-sectors-total.csv',parse);
const legislation =  d3.csv('./data/legislation-11-18.csv',parse);

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

    const healthCare = sectors.filter(d => d.Sector === 'Health Care');
    healthCareTotals(healthCare);

});

legislation.then((legislation) => {
    gunsRugPlot(legislation);
    marijuanaRugPlot(legislation);
    healthCareRugPlot(legislation);

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

firmsNetworks.on('circle:enter', function(d) {
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
.on('circle:leave', function(d) {
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

firmsNetworks2.on('circle:enter', function(d,color) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);

    tooltip(d,tooltipSelection);

    const left = d3.event.pageX;
    const top = d3.event.pageY - 28;

    tooltipSelection.style('left',`${left}px`)
        .style('top',`${top}px`)
        .style('background-color', color);
})
.on('circle:leave', function(d) {
    const rootNodeId = d3.select(this.parentNode.parentNode.parentNode.parentNode)
        .attr('id');
    const tooltipId = `${rootNodeId}-tooltip`;
    const tooltipSelection = d3.select(`#${tooltipId}`);

    tooltipSelection.style('left',0)
        .style('top',0);
    tooltipSelection.html('');
});

employersSectors.then((employersSectors) => {
    top5EmployersSectors(employersSectors);
    top5EmployersSectorsMenu(employersSectors);
});

top5EmployersSectorsMenu.on('menu:selected',function(data,value) {
    top5EmployersSectors.display(value);
    top5EmployersSectors(data);
});

import {format} from 'd3';

export const parse = d => d;

export const filterData = (data,criteria) => {
    return data.filter(d => d.key == criteria);
};

export const formatMillions = format('.2s');
export const formatMillionsMoney = d => {
    return `$${formatMillions(d).replace('M','m')}`;
};

export const formatYear = format('.0f');

export const delay = (d,i) => 200 + i * 30;

export const contains = (d,array,match) => {
    return d.filter(f => array.includes(f[match]));
};

export const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

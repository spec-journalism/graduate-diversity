import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { scaleLinear } from 'd3-scale';
import { line as d3Line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import DATA from '../../data';
import { maxCoord, colorScale } from '../../utils';
import { START_YEAR } from '../../constants';
import Point from './Point';

const styles = {
  line: {
    fill: 'none',
    stroke: '#333',
  },
  axis: {
    '& path.domain': { display: 'none' },
    '& g:nth-child(2) > text': {
      // first tick
      display: 'none',
    },
    '& text': {
      fontFamily: 'Roboto',
      fontSize: '0.93rem',
      color: '#888',
    },
    '& > g.tick line': {
      stroke: '#ccc',
      strokeWidth: 0.6,
    },
  },
};

const NUM_TICKS = 6;
const TICK_PADDING = 9;
const margin = { top: 60, right: 60, bottom: 100, left: 60 };

class ScatterPlot extends Component {
  constructor(props) {
    super(props);

    const { dataName } = props;
    this.data = DATA[dataName];

    const width = window.innerWidth * 0.54;
    const height = width;
    const gWidth = width - margin.left - margin.right;
    const gHeight = height - margin.top - margin.bottom;

    const upperLimit = maxCoord(this.data) * 1.02;
    const xScale = scaleLinear()
      .domain([0, upperLimit])
      .range([0, gWidth]);
    const yScale = scaleLinear()
      .domain([0, upperLimit])
      .range([gHeight, 0]);

    const xAxis = axisBottom(xScale)
      .tickSize(-gHeight)
      .tickPadding(TICK_PADDING)
      .ticks(NUM_TICKS);
    const yAxis = axisLeft(yScale)
      .tickSize(-gWidth)
      .tickPadding(TICK_PADDING)
      .ticks(NUM_TICKS);

    this.state = {
      width,
      height,
      gWidth,
      gHeight,

      xScale,
      yScale,
      xAxis,
      yAxis,

      maxYear: this.props.maxYear,
      previousMaxYear: START_YEAR,
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.maxYear !== prevState.maxYear) {
      return {
        maxYear: nextProps.maxYear,
        previousMaxYear: prevState.maxYear,
      };
    }

    return null;
  };

  render() {
    const {
      width,
      height,
      gHeight,
      xScale,
      yScale,
      xAxis,
      yAxis,
      maxYear,
      previousMaxYear,
    } = this.state;
    const { classes } = this.props;

    const lineGenerator = d3Line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g
            ref={node => d3Select(node).call(xAxis)}
            className={classes.axis}
            transform={`translate(0, ${gHeight})`}
          />
          <g
            ref={node => d3Select(node).call(yAxis)}
            className={classes.axis}
          />

          <path d={lineGenerator([[0, 0], [1000, 1000]])} fill="black" />

          <path d={lineGenerator(this.data)} className={classes.line} />

          {this.data.map(([x, y], i) => (
            <Point
              key={x + '-' + y}
              x={xScale(x)}
              y={yScale(y)}
              isVisible={START_YEAR + i <= maxYear}
              fill={colorScale[i]}
              queuePosition={
                START_YEAR +
                i -
                (previousMaxYear < START_YEAR ? START_YEAR : previousMaxYear)
              }
            />
          ))}
        </g>
      </svg>
    );
  }
}

export default injectSheet(styles)(ScatterPlot);
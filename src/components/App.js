import React, { Component } from 'react';
import archieml from 'archieml';
import COPY from '../copy';
import ScatterGraphic from './ScatterGraphic';
import PercentGraphic from './PercentGraphic';
import { Header, Paragraph } from './content';

const copy = archieml.load(COPY);
const body = copy.body;
const scatterPlots = copy.scatter_plots;

class App extends Component {
  render() {
    return (
      <div>
        <Header headline={copy.headline} />

        <PercentGraphic />

        {body.map(text => <Paragraph key={text} text={text} />)}

        {Object.keys(scatterPlots).map(key => {
          // Convert strings of numbers to numbers
          const steps = scatterPlots[key].map(step => {
            if (step.showGuides) step.showGuides = step.showGuides.map(x => +x);
            if (step.maxYear) step.maxYear = +step.maxYear;
            return step;
          });
          return <ScatterGraphic key={key} steps={steps} />;
        })}
      </div>
    );
  }
}

export default App;

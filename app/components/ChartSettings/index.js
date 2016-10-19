import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBlock from '../Layout/AccordionBlock';

class ChartSettings extends Component {
  render() {
    return (
      <AccordionBlock
        title="Test 1"
        tooltip="Tooltip content"
      >
        <p>Foo</p>
        <p>Bar</p>
      </AccordionBlock>
    );
  }
}

ChartSettings.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  currentStep: React.PropTypes.number,
  typeConfig: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartSettings);

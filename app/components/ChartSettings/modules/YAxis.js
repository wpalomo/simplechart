import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

class YAxis extends Component {

  constructor() {
    super();
    this._handleYDomain = this._handleYDomain.bind(this);
  }

  _getOptsKey(axisOpts, key, defaultValue = '') {
    return (axisOpts && axisOpts.hasOwnProperty(key)) ?
      axisOpts[key] : defaultValue;
  }

  _handleYDomain(fieldProps, value) {
    let domain = this.props.options.yDomain || [];
    if ('yDomain.min' === fieldProps.name) {
      domain[0] = value;
      return domain;
    } else if (0 === domain.length) {
      domain = [0, value];
    } else {
      domain[1] = value;
    }
    return { yDomain: domain };
  }

  render() {
    return (
      <AccordionBlock
        title="Y Axis"
        defaultExpand={this.props.defaultExpand}
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Input"
          fieldProps={{
            label: 'Axis Label',
            name: 'yAxis.axisLabel',
            value: getObjArrayKey(this.props.options.yAxis, 'axisLabel'),
          }}
        />
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Input"
          fieldProps={{
            label: 'Minimum value',
            name: 'yDomain.min',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(this.props.options.yDomain, 0),
          }}
          handler={this._handleYDomain}
        />
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Input"
          fieldProps={{
            label: 'Maximum value',
            name: 'yDomain.max',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(this.props.options.yDomain, 1),
          }}
          handler={this._handleYDomain}
        />
      </AccordionBlock>
    );
  }
}

YAxis.propTypes = {
  options: React.PropTypes.object,
  defaultExpand: React.PropTypes.bool,
};

export default YAxis;
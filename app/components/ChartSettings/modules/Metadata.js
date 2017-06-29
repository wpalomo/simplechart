import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_METADATA,
} from '../../../constants';
import { getObjArrayKeyStringOnly, capitalize } from '../../../utils/misc';

export default class Metadata extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
    defaultExpand: PropTypes.bool.isRequired,
  };

  state = {
    title: '',
    caption: '',
    credit: '',
    subtitle: false,
  };

  componentWillMount() {
    this.setState(this.props.metadata);
    if ('undefined' !== typeof this.props.metadata.subtitle &&
      false !== this.props.metadata.subtitle) {
      this.shouldShowMetadata.subtitle = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.metadata);
  }

  shouldShowMetadata = {
    title: true,
    caption: true,
    credit: true,
    subtitle: false,
  }

  handler = (fieldProps, value) => {
    const theUpdate = {
      [fieldProps.name]: value,
    };

    // setState() is async so we also need to return copy with update()
    this.setState(theUpdate);
    return update(this.state, { $merge: theUpdate });
  };

  render() {
    if (!this.shouldShowMetadata.subtitle) {
      delete this.state.subtitle;
    }
    return (
      <AccordionBlock
        title="Metadata"
        tooltip="Title, subtitle, caption, credit"
        defaultExpand={this.props.defaultExpand}
      >
        {Object.keys(this.state).map((key) =>
          (
            <div key={`metadata-${key}`}>
              <DispatchField
                action={RECEIVE_CHART_METADATA}
                fieldType="Input"
                fieldProps={{
                  label: capitalize(key),
                  name: key,
                  value: getObjArrayKeyStringOnly(this.state, key, ''),
                }}
                handler={this.handler}
              />
            </div>
          )
        )}
      </AccordionBlock>
    );
  }
}

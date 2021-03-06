import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Close } from 'rebass';
import update from 'immutability-helper';
import * as styles from './ErrorMessage.css';
import getErrorMessage from '../../../utils/errorCodeUtils';
import { CLEAR_ERROR } from '../../../constants';
import actionTrigger from '../../../actions';

class ErrorMessage extends Component {
  static propTypes = {
    override: PropTypes.object,
    code: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    override: {},
  };

  static toSetState(props) {
    // display message if we have an error code or JSX children
    // clear children unless code e000 is passed
    return {
      open: !!props.code || 0 < props.children.toString().length,
      children: (props.code && 'e000' === props.code) ? props.children : false,
    };
  }

  state = { open: false, children: false };

  componentWillMount() {
    this.setState(ErrorMessage.toSetState(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(ErrorMessage.toSetState(nextProps));
  }

  closeErrorMessage = () => {
    this.setState({ open: false, children: false });
    this.props.dispatch(actionTrigger(CLEAR_ERROR));
  };

  render() {
    if (!this.state.open) {
      return null;
    }

    const props = update({
      inverted: true,
      rounded: true,
      theme: 'error',
    }, { $merge: this.props.override || {} });

    /**
     * Allow passed children to override error code message
     */
    if (this.props.code && !this.state.children) {
      props.dangerouslySetInnerHTML = getErrorMessage(this.props.code);
    }

    return (
      <div className={styles.container}>
        <div className={styles.errorMessageContent}>
          {props.dangerouslySetInnerHTML ?
            React.createElement(Message, props) :
            React.createElement(Message, props, this.state.children)
          }
        </div>
        <span
          className={styles.closeContainer}
          onClick={this.closeErrorMessage}
          role="button"
          tabIndex={0}
        >
          <Close />
        </span>
      </div>
    );
  }
}

export default connect()(ErrorMessage);

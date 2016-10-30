/**
 * Middleware that applies chart type default options and handles some special cases
 */
import {
  RECEIVE_DEFAULTS_APPLIED_TO,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
import { getChartTypeDefaultOpts } from '../utils/chartTypeUtils';
import update from 'react-addons-update';

export default function applyChartOptions({ getState }) {
  return (dispatch) => (action) => {
    if (RECEIVE_CHART_TYPE !== action.type) {
      return dispatch(action);
    }

    /**
     * @todo Handle defaults that would break with a shallow merge
     */
    function _mergeStateIntoDefaults() {
      return update(
        getChartTypeDefaultOpts(action.data.config.type),
        { $merge: getState().chartOptions }
      );
    }

    /**
     * @todo Handle defaults that would fail with a shallow merge
     */
    function _mergeDefaultsIntoState() {
      return update(
        getState().chartOptions,
        { $merge: getChartTypeDefaultOpts(action.data.config.type) }
      );
    }

    // If we haven't already applied this chart type's defaults
    if (getState().defaultsAppliedTo !== action.data.config.type) {
      dispatch(actionTrigger(
        RECEIVE_CHART_OPTIONS,
        !getState().defaultsAppliedTo ?
          // Merge state into defaults if we haven't applied any defaults yet
          // Otherwise merge defaults into state
          _mergeStateIntoDefaults() : _mergeDefaultsIntoState()
      ));
      dispatch(actionTrigger(
        RECEIVE_DEFAULTS_APPLIED_TO,
        action.data.config.type
      ));
    }

    return dispatch(action);
  };
}

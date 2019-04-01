import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import StylePopup from 'components/StylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import {mapAnnotationToKey} from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationReasonPopup.scss';

/*
    We need to do a couple of things for this popup to be successful
     - Popup should ingest some predefined values
     - Popup should return a value on some explicit save
 */

class AnnotationReasonPopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired
  };

  render() {
    const {isDisabled, annotation, style, closeElement} = this.props;
    const className = getClassName('Popup AnnotationReasonPopup', this.props);
    const definedReasons = ['Reason 1', 'Reason 2', 'Reason 3'];

    if (isDisabled) {
      return null;
    }

    // TODO - Close the annotation using closeElement('annotationPopup')
    return (
      <div className={className} data-element="AnnotationReasonPopup">
        <div className="wrapper">
          <span className="reasonTitle">Redaction reason:</span>
          <ul className="reasonsList">
            {definedReasons.map(item => <li key={item}>{item}</li>)}
            <li className="input-item">
              <div className="input-wrapper">
                <input type="text"
                       placeholder="Enter custom reason"
                       autoComplete="off"
                />
              </div>
              <div className="button-wrapper">
                <div className="button-save">Save</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'AnnotationReasonPopup')
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationReasonPopup);

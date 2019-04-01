import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationReasonPopup.scss';


class AnnotationReasonPopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired
  };

  applyReason = reason => {
    // Close the annotation
    const {annotation, closeElement} = this.props;
    annotation.Reason = reason;
    closeElement('annotationPopup');
    // TODO - Fire some type of event letting the annotation manager know that the annotation was changed?
  };

  render() {
    const {isDisabled} = this.props;
    const className = getClassName('Popup AnnotationReasonPopup', this.props);
    const definedReasons = core.getReasons();

    if (isDisabled) {
      return null;
    }

    if (definedReasons.constructor !== Array){
      console.warn('Reasons expects an array, you passed', typeof(definedReasons), definedReasons);
    }

    // TODO - create a sub-component to pass handler and use props as the arguments
    // @see https://stackoverflow.com/questions/29810914/react-js-onclick-cant-pass-value-to-method
    return (
      <div className={className} data-element="AnnotationReasonPopup">
        <div className="wrapper">
          <span className="reasonTitle">Redaction reason:</span>
          <ul className="reasonsList">
            {definedReasons.map(item =>
              <li key={item} onClick={() => {
                this.applyReason(item);
              }}
              >{item}</li>)}
            <li className="input-item">
              <div className="input-wrapper">
                <input type="text"
                       placeholder="Enter custom reason"
                       autoComplete="off"
                />
              </div>
              <div className="button-wrapper">
                <div className="button-save" onClick={() => {
                  this.applyReason('TODO - UPDATE');
                }}
                >Save</div>
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

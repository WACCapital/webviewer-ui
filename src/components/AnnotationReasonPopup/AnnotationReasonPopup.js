import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationReasonPopup.scss';

/**
 * TODO:
 *  - Create a sub-component to pass handler and use props as the arguments for input
 *    @see https://stackoverflow.com/questions/29810914/react-js-onclick-cant-pass-value-to-method
 */
class AnnotationReasonPopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // Get the current value for a custom reason
    let currentValue = '';
    if(props.annotation.Reason && core.getCurrentReasons().indexOf(props.annotation.Reason) === -1){
      currentValue = props.annotation.Reason;
    }

    this.state = {
      inputValue: currentValue
    };

  }

  applyReason = reason => {
    const {annotation, closeElement} = this.props;
    annotation.Reason = reason;
    core.deselectAnnotation(annotation);
    closeElement('annotationPopup');
    //core.getAnnotationManager().trigger('annotationChanged', [[annotation], 'modify']);
  };

  render() {
    const {isDisabled, annotation} = this.props;
    const className = getClassName('Popup AnnotationReasonPopup', this.props);
    const currentReason = annotation.Reason;
    const definedReasons = core.getCurrentReasons();

    // TODO - If annotation isn't typeof RedactionAnnotation, return null;
    if (isDisabled) {
      return null;
    }

    // if (definedReasons.constructor !== Array) {
    //   console.warn('Reasons expects an array, you passed', typeof (definedReasons), definedReasons);
    // }

    return (
      <div className={className} data-element="AnnotationReasonPopup">
        <div className="wrapper">
          <span className="reasonTitle">Redaction reason:</span>
          <ul className="reasonsList">
            {definedReasons.map(item =>
              <li key={item}
                  onClick={() => {
                    this.applyReason(item);
                  }}
                  className={(item === currentReason) ? 'current' : ''}
              >{item}</li>)}
            <li className="input-item">
              <div className="input-wrapper">
                <input type="text"
                       placeholder="Enter custom reason"
                       autoComplete="off"
                       value={this.state.inputValue}
                       onChange={evt => this.updateInputValue(evt)}
                />
              </div>
              <div className="button-wrapper">
                <div className="button-save" onClick={() => {
                  this.applyReason(this.state.inputValue);
                }}
                >Save
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'AnnotationReasonPopup')
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationReasonPopup);

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './RedactionModal.scss';

class RedactionModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['signatureModal', 'printModal', 'errorModal', 'loadingModal', 'printModal']);
    }
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal RedactionModal', this.props);

    return (
      <div className={className} data-element="redactionModal">
        <div className="container">
          Just some generic content yo!
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'redactionModal'),
  isOpen: selectors.isElementOpen(state, 'redactionModal'),
  loadingProgress: selectors.getLoadingProgress(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(RedactionModal);

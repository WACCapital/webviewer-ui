import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './RedactionModal.scss';
import {translate} from 'react-i18next';

class RedactionModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    t: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.elementName = 'redactionModal';
    this.state = {
      inputValue: '',
      selectValue: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['signatureModal', 'printModal', 'errorModal', 'loadingModal', 'printModal']);
    }
  }

  handleSubmit = () => {
    const {closeElements} = this.props;
    closeElements(this.elementName);
  };
  handleCancel = () => {
    const {closeElements} = this.props;
    closeElements(this.elementName);
  };
  updateInputValue = event => {
    this.setState({
      inputValue: event.target.value
    });
  };
  updateSelectValue = event => {
    this.setState({
      selectValue: event.target.value
    });
  };

  renderAnnotationReasonContent = () => {
    const {t} = this.props;
    const definedReasons = core.getCurrentReasons();

    return (
      <div className="">
        <select onChange={this.updateSelectValue}
                value={this.state.selectValue}
        >
          {definedReasons.map(item =>
            <option key={item}>{item}</option>)
          }
        </select>
        <input type="text"
               placeholder={t('message.redactReasonCustom')}
               autoComplete="off"
               value={this.state.inputValue}
               onChange={this.updateInputValue}
        />
      </div>
    );
  };

  renderContent() {
    const {t} = this.props;
    return (
      <div className="wrapper">
        <div className="header">{t('message.redactAllVerification')}</div>
        <form onSubmit={this.handleSubmit}>
          {this.renderAnnotationReasonContent()}
          <div className="buttons">
            <Button
              dataElement="redactionModalSubmitButton"
              label={t('action.submit')}
              onClick={this.handleSubmit}
            />
            <Button
              dataElement="redactionModalCancelButton"
              label={t('action.cancel')}
              onClick={this.handleCancel}
            />
          </div>
        </form>
      </div>
    );
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal RedactionModal', this.props);

    return (
      <div className={className} data-element={this.elementName}>
        <div className="container">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'redactionModal'),
  isOpen: selectors.isElementOpen(state, 'redactionModal'),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RedactionModal));

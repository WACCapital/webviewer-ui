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
      selectValue: '',
      listOpen: false,
      headerTitle: this.props.t('component.redactionModal.predefinedPlaceholder')
    };
    this.close = this.close.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['signatureModal', 'printModal', 'errorModal', 'loadingModal', 'printModal']);
    }
    const {listOpen} = this.state;
    setTimeout(() => {
      if (listOpen) {
        window.addEventListener('click', this.close);
      } else {
        window.removeEventListener('click', this.close);
      }
    }, 0);
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
      inputValue: event.target.value,
      selectValue: '',
      headerTitle: this.props.t('component.redactionModal.predefinedPlaceholder'),
    });
  };

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
  }

  close() {
    this.setState({
      listOpen: false
    });
  }

  selectItem(value) {
    this.setState({
      headerTitle: value,
      listOpen: false,
      selectValue: value,
      inputValue: '',
    });
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  }

  renderAnnotationReasonContent = () => {
    const {t} = this.props;
    const {listOpen, headerTitle} = this.state;
    const definedReasons = core.getCurrentReasons();

    return (
      <div>
        {definedReasons.length > 0 &&
          <div className="dropdown-wrapper">
            <div className="dropdown-label">{t('component.redactionModal.predefinedLabel')}:</div>
            <div className="dropdown-header" onClick={() => this.toggleList()}>
              <div className="dropdown-title">{headerTitle}</div>
            </div>
            {listOpen && <ul className="dropdown-list" onClick={e => e.stopPropagation()}>
              {definedReasons.map(item => (
                <li className="dropdown-list-item" key={item}
                    onClick={() => this.selectItem(item)}
                >{item}</li>
              ))}
            </ul>}
          </div>
        }
        <div className="form-element">
          <label htmlFor="customRedactionReason">{t('component.redactionModal.customLabel')}:</label>
          <input type="text"
                 placeholder={t('component.redactionModal.customPlaceholder')}
                 autoComplete="off"
                 value={this.state.inputValue}
                 onChange={this.updateInputValue}
                 id="customRedactionReason"
          />
        </div>
      </div>
    );
  };

  renderContent() {
    const {t} = this.props;
    return (
      <div className="wrapper">
        <div className="header">{t('component.redactionModal.header')}</div>
        <div className="sub-text">{t('component.redactionModal.subText')}</div>
        <form onSubmit={this.handleSubmit}>
          {this.renderAnnotationReasonContent()}
          <div className="buttons">
            <Button
              dataElement="redactionModalSubmitButton"
              label={t('action.redact')}
              onClick={this.handleSubmit}
              isActive
              className="submit"
            />
            <Button
              dataElement="redactionModalCancelButton"
              label={t('action.cancel')}
              onClick={this.handleCancel}
              isActive
              className="cancel"
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

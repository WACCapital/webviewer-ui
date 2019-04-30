import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';

import Input from 'components/Input';
import SearchResult from 'components/SearchResult';
import ListSeparator from 'components/ListSeparator';
import Button from 'components/Button';

import core from 'core';
import {isMobile, isTabletOrMobile} from 'helpers/device';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './SearchPanel.scss';

class SearchPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.object),
    isSearching: PropTypes.bool,
    noResult: PropTypes.bool,
    setActiveResultIndex: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: this.generateCheckedArray(props.results.length, false),
      isChanged: false
    };
    this.hasUpdatedState = false;
    this.resultChildren = [];
  }

  componentDidMount() {
    window.docViewer.on('bulkRedactionSubmit', this.onBulkRedactionSubmit);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('leftPanel');
    }
    if (this.props.isSearching || !this.props.results.length) {
      // Clear existing results
      this.resultChildren = [];
      this.hasUpdatedState = false;
    } else if (!this.hasUpdatedState) {
      // Update the state
      this.hasUpdatedState = true;
      this.setState({
        checked: this.generateCheckedArray(this.props.results.length, false),
        isChanged: false
      });
    }
  }

  componentWillUnmount() {
    window.docViewer.off('bulkRedactionSubmit', this.onBulkRedactionSubmit);
  }

  onBulkRedactionSubmit = (event, reason) => {
    // 1. Gather the search results that should have redactions created.
    const results = [];
    for (let i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        results.push({
          page: this.props.results[i].page_num,
          quads: this.props.results[i].quads
        });
      }
    }
    window.docViewer.trigger('bulkRedaction', {reason, results});
  };

  generateCheckedArray = (length, value) => {
    return (length ? [...Array(length)].map(() => value) : []);
  };

  onClickResult = (resultIndex, result) => {
    const {setActiveResultIndex, closeElement} = this.props;

    setActiveResultIndex(resultIndex);
    core.setActiveSearchResult(result);

    if (isMobile()) {
      closeElement('searchPanel');
    }
  };

  onSelectResult = (resultIndex, result, value) => {
    this.setState(prevState => {
      let newCheckedState = prevState.checked.slice();
      newCheckedState[resultIndex] = value;
      return {
        checked: newCheckedState,
        isChanged: (value || newCheckedState.indexOf(true) !== -1)
      };
    });
  };

  onClickClose = () => {
    this.props.closeElement('searchPanel');
  };

  onApplyRedactions = () => {
    const {openElement} = this.props;
    openElement('redactionModal');
  };

  renderListSeparator = (prevResult, currResult) => {
    const isFirstResult = prevResult === currResult;
    const isInDifferentPage = prevResult.page_num !== currResult.page_num;

    if (isFirstResult || isInDifferentPage) {
      return (
        <ListSeparator
          renderContent={() => `${this.props.t('option.shared.page')} ${currResult.page_num + 1}`}
        />
      );
    }

    return null;
  };

  onSelectAll = e => {
    this.setState({
      checked: this.generateCheckedArray(this.props.results.length, e.target.checked),
      isChanged: e.target.checked
    });
  };

  render() {
    const {isDisabled, t, results, isSearching, noResult} = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel SearchPanel', this.props);

    return (
      <div className={className} data-element="searchPanel" onClick={e => e.stopPropagation()}>
        <Button className="close-btn hide-in-desktop hide-in-tablet" dataElement="searchPanelCloseButton"
                img="ic_close_black_24px" onClick={this.onClickClose}
        />
        <div className="results">
          {isSearching &&
          <div className="info">{t('message.searching')}</div>
          }
          {noResult &&
          <div className="info">{t('message.noResults')}</div>
          }
          {results.length > 0 &&
          <div className="break">{''}</div>
          }
          {results.length > 0 &&
          <div className="redact-all">
            <Input id={`redaction-selection-all`}
                   type="checkbox"
                   onChange={this.onSelectAll}
                   label={t('message.redactAll')}
            />
            <button className={this.state.isChanged ? '' : 'disabled'}
                    onMouseDown={this.onApplyRedactions}
            >{t('action.redact')}</button>
          </div>
          }
          {results.length > 0 &&
          <div className="break">{''}</div>
          }
          {results.map((result, i) => {
            const prevResult = i === 0 ? results[0] : results[i - 1];

            return (
              <React.Fragment key={i}>
                {this.renderListSeparator(prevResult, result)}
                <SearchResult ref={ref => this.resultChildren[i] = ref}
                              result={result}
                              index={i}
                              onClickResult={this.onClickResult}
                              onSelectResult={this.onSelectResult}
                              checked={this.state.checked[i]}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  isOpen: selectors.isElementOpen(state, 'searchPanel'),
  results: selectors.getResults(state),
  isSearching: selectors.isSearching(state),
  noResult: selectors.isNoResult(state),
});

const mapDispatchToProps = {
  setActiveResultIndex: actions.setActiveResultIndex,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SearchPanel));

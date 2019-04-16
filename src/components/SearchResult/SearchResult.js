import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Input from 'components/Input';


import selectors from 'selectors';

import './SearchResult.scss';

class SearchResult extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    result: PropTypes.object.isRequired,
    activeResultIndex: PropTypes.number.isRequired,
    onClickResult: PropTypes.func.isRequired,
    onSelectResult: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.selectionInput = React.createRef();
  }

  onClick = () => {
    const {onClickResult, index, result} = this.props;
    onClickResult(index, result);
  };

  onSelect = () => {
    const {onSelectResult, index, result} = this.props;
    onSelectResult(index, result);
  };

  setChecked = value => {
    this.selectionInput.checked(value);
  };

  renderContent = () => {
    const {ambient_str, result_str_start, result_str_end} = this.props.result;
    const textBeforeSearchValue = ambient_str.slice(0, result_str_start);
    const searchValue = ambient_str.slice(result_str_start, result_str_end);
    const textAfterSearchValue = ambient_str.slice(result_str_end);

    return (
      <React.Fragment>
        {textBeforeSearchValue}
        <span className="search-value">
          {searchValue}
        </span>
        {textAfterSearchValue}
      </React.Fragment>
    );
  };

  render() {
    const {activeResultIndex, index} = this.props;

    return (
      <div className={`search-result-wrapper search-result-wrapper--${index}`}>
        <div className="input-wrapper">
          <Input ref={this.selectionInput}
                 id={`redaction-selection-${index}`}
                 type="checkbox"
                 onChange={this.onSelect}
                 label=""
          />
        </div>
        <div className={`SearchResult ${index === activeResultIndex ? 'selected' : ''}`} onClick={this.onClick}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeResultIndex: selectors.getActiveResultIndex(state)
});

export default connect(mapStateToProps)(SearchResult);

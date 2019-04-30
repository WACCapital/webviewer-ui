import actions from 'actions';

export default dispatch => (e, values) => {
  dispatch(actions.closeElement('redactionModal'));
  $(document).trigger('searchRedactionCompleted', [values.reason, values.result]);
};

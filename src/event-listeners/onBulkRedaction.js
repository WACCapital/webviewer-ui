import actions from 'actions';
import fireEvent from '../helpers/fireEvent';

export default dispatch => (e, values) => {
  dispatch(actions.closeElement('redactionModal'));
  fireEvent('searchRedactionCompleted', {reason: values.reason, results: values.results});
};

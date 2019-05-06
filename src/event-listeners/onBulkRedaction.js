import actions from 'actions';
import fireEvent from '../helpers/fireEvent';

export default dispatch => (e, values) => {
  dispatch(actions.closeElement('redactionModal'));
  fireEvent('searchRedactionCompleted', {values: values.reason, result: values.results});
};

import * as customersActions from '../../../redux/actions/customers';
import * as types from '../../../redux/actions/actionTypes';

describe('customers actions', () => {
  it('should return set customers type correctly', () => {
    const action = customersActions.setCustomers([]);
    expect(action.type).toBe(types.SET_CUSTOMERS);
  });
});

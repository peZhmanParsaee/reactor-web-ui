import * as provincesActions from '../../actions/provinces';
import * as types from '../../actions/actionTypes';

describe('provinces actions', () => {
  it('should return set provinces type correctly', () => {
    const action = provincesActions.setProvinces([]);
    expect(action.type).toBe(types.SET_PROVINCES);
  });
  it('should return set provinces action object correctly', () => {
    const provinces = [
      'California',
      'Texas',
      'Florida'
    ];
    const action = provincesActions.setProvinces(provinces);
    expect(action).toEqual({
      type: types.SET_PROVINCES,
      payload: provinces
    });
  })
});

import configureStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import * as provincesActions from '../../../redux/actions/provinces';
import * as types from '../../../redux/actions/actionTypes';
import provinces from '../../fixtures/provinces';

global.API_ENDPOINT = 'http://localhost:1234';

const getUrl = (route) => `${API_ENDPOINT}/api/${route}`;

describe('provinces actions', () => {
  it('should return set provinces type correctly', () => {
    const action = provincesActions.setProvinces([]);
    expect(action.type).toBe(types.SET_PROVINCES);
  });
  it('should return set provinces action object correctly', () => {
    const action = provincesActions.setProvinces(provinces);
    expect(action).toEqual({
      type: types.SET_PROVINCES,
      payload: provinces
    });
  });
});

describe('provinces async actions', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  const mock = new MockAdapter(axios);

  it('should create SET_PROVINCES correctly', () => {
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(provincesActions.setProvinces(provinces));
    const actions = store.getActions();
    const expectedActions = [{ type: types.SET_PROVINCES, payload: provinces }];
    expect(actions).toEqual(expectedActions);
  });

  it('should create SET_PROVINCES when fetching provinces has been done', () => {
    mock.onGet(getUrl('v1/province')).reply(200, {
      status: true,
      payload: provinces
    });

    const initialState = { provinces: [] };
    const store = mockStore(initialState);

    store.dispatch(provincesActions.startSetProvinces()).then(() => {
      const expectedActions = [
        {
          type: types.SET_PROVINCES,
          payload: provinces
        }
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

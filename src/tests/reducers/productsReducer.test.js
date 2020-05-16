import productsReducer from '../../reducers/productsReducer';
import * as types from '../../actions/actionTypes';
import products from '../fixtures/products';

test('should set default state', () => {
  const state = productsReducer(undefined, { type: '@@INIT' });
  expect(state).toEqual([]);
});

test('should set products state to an array', () => {
  const action = {
    type: types.SET_PRODUCTS,
    payload: { products }
  };
  const state = productsReducer(undefined, action);
  expect(state).toEqual(products);
});

test('should add product', () => {
  const product =  {
    name: 'prod xyz', 
    unitPrice: 15000, 
    count: 125
  };
  const action = {
    type: types.ADD_PRODUCT,
    payload: { product }
  };
  const state = productsReducer(products, action);
  expect(state).toEqual([...products, product]);
});

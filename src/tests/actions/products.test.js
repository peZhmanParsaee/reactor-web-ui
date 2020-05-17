import * as productsActions from '../../actions/products';
import * as types  from '../../actions/actionTypes';

test('should setup add product action object with provided values', () => {
  const action = productsActions.addProduct({ name: 'prod 1', unitPrice: 1200, count: 300 });
  expect(action).toEqual({
    type: types.ADD_PRODUCT,
    payload : {
      name: 'prod 1', 
      unitPrice: 1200, 
      count: 300
    }
  });
});

test('should setup set products action object with empty array', () => {
  const action = productsActions.setProducts([]);
  expect(action).toEqual({
    type: types.SET_PRODUCTS,
    payload: []
  });
});

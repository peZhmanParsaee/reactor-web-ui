import { addProduct, setProducts, startAddProduct, startSetProducts } from '../../actions/products';
import { ADD_PRODUCT, SET_PRODUCTS }  from '../../actions/types';

test('should set up add product action object', () => {
  const action = addProduct({ name: 'prod 1', unitPrice: 1200, count: 300 });
  expect(action).toEqual({
    type: ADD_PRODUCT,
    product: {
      name: 'prod 1', 
      unitPrice: 1200, 
      count: 300
    }
  });
});

test('should set up set products action object', () => {
  const action = setProducts([]);
  expect(action).toEqual({
    type: SET_PRODUCTS,
    products: []
  });
});

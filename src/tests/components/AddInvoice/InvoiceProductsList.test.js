import React from 'react';
import { shallow } from 'enzyme';
import InvoiceProductsList from '../../../components/AddInvoice/InvoiceProductsList';
import products from '../../fixtures/products';

test('should render InvoiceProductsList with products', () => {
  const wrapper = shallow(
    <InvoiceProductsList products={products} classes={{}} />
  );
  expect(wrapper).toMatchSnapshot();
});

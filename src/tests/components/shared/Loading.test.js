import React from 'react';
import { shallow } from 'enzyme';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import { Loading } from '../../../components/Loading';

test('should render Loading with ReactShallowRenderer correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Loading />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should assess rendered Loading jsx with enzyme correctly', () => {
  const wrapper = shallow(<Loading />);
  expect(wrapper.find('div').length).toBe(1);
  expect(wrapper.find('div').text()).toBe('Please wait ....');
});

test('should render Loading with enzyme correctly', () => {
  const wrapper = shallow(<Loading />);
  expect(wrapper).toMatchSnapshot();
});

import React, { Component } from 'react';

export default class SampleComponent extends Component {
  componentDidMount() {
    console.log('hi');
  }

  render() {
    return (
      <div>It is from SampleComponent</div>
    );
  }
}

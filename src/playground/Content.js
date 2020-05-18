import React from 'react';

export default class Content extends React.Component {
  componentWillMount() {
    console.log('Component WILL MOUNT!');
  }

  componentDidMount() {
    console.log('Component DID MOUNT!');
  }

  componentWillReceiveProps(newProps) {
    console.log('Component WILL RECIEVE PROPS!');
  }

  shouldComponentUpdate(newProps, newState) {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Component WILL UPDATE!');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component DID UPDATE!');
  }

  componentWillUnmount() {
    console.log('Component WILL UNMOUNT!');
  }

  render() {
    return (
      <div>
        <h3>{this.props.myNumber}</h3>
      </div>
    );
  }
}

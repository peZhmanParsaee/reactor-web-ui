import React from 'react';
import Content from './Content';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: 0
    };
    this.setNewNumber = this.setNewNumber.bind(this);
  }

  setNewNumber() {
    this.setState({ data: this.state.data + 1 });
    console.log(this.state.data);
  }

  render() {
    return (
      <div>
        <button onClick = {this.setNewNumber}>INCREMENT</button>
        <Content myNumber={this.state.data} />
      </div>
    );
  }
}

export default App;

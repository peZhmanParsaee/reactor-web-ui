import React from 'react';
import PropTypes from 'prop-types';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: 'Shiraz'
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(() => ({ city: 'Shiraz' }));
    }, 1000);

    setInterval(() => {
      this.setState(() => ({ city: 'Tehran' }));
    }, 6000);
    // setInterval(()=>{
    //     this.setState(()=>{
    //         return { city: "Alwar"}
    //     })
    //     console.log('---------')
    // },2000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.city != this.state.city;
    //    return true;
  }

  render() {
    console.log(`Main Component render ${Date.now()}`);
    return (
      <div>
        <h2>
          {this.state.title}
        </h2>
        <p>
          User Name:
          {' '}
          {this.props.name}
        </p>
        <p>
          User Age:
          {' '}
          {this.props.age}
        </p>
      </div>
    );
  }
}
MainApp.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired
};

MainApp.defaultProps = {
  name: 'Pankaj Kumar Choudhary',
  age: 24
};

export default MainApp;

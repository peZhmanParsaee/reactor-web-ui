import React from 'react';
import PropTypes from 'prop-types';

class Main extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      city: 'Alwar',
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(() => ({ city: 'Alwar' }));
    }, 1000);

    setInterval(() => {
      this.setState(() => ({ city: 'Jaipur' }));
    }, 6000);
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
Main.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired
};

Main.defaultProps = {
  name: 'Pankaj Kumar Choudhary',
  age: 24
};

export default Main;

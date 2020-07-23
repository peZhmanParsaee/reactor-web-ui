import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// local dependencies
import Header from '../../components/Header';
import homePageStyle from '../../styles/jss/components/homePageStyle';

class HomePage extends Component {
  render() {
    return (
      <div className="wrapper">
        <header>header</header>
        <nav>
          <ul>
            <li>Home Page</li>
            <li>Search</li>
            <li>About us</li>
          </ul>
        </nav>
        <main>Main Content</main>
        <footer>Footer</footer>
      </div>
    );
  }
}

export default HomePage;

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
        <header>
          <h1>Reactor Store</h1>
        </header>
        <nav>
          <ul>
            <li>
              <a href="#">Home Page</a>
            </li>
            <li>
              <a href="#">Search</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
          </ul>
        </nav>
        <div className="content">
          <div className="container">
            <main className="main">Main Content</main>
            <aside className="sidebar">sidebar</aside>
          </div>
        </div>
        <footer>Footer</footer>
      </div>
    );
  }
}

export default HomePage;

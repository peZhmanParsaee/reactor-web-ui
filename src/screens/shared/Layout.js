import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

// local components
import HomePage from '../Home';
import AddInvoicePage from '../Invoice/Add';
import SalesReportPage from '../Invoice/List';
import Footer from '../../components/Footer';
import ToastMessage from '../../components/ToastMessage';

class Layout extends React.Component {
  areWeInReportRoute = () => {
    return this.props.location.pathname === '/sales-report';
  };
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/add-invoice" component={AddInvoicePage} />
          <Route path="/sales-report" component={SalesReportPage} />
        </Switch>

        {/* <ToastMessage /> */}

        {/* {this.areWeInReportRoute() ? null : <Footer />} */}
      </div>
    );
  }
}

export default Layout;

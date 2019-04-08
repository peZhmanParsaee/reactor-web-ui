import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../components/HomePage';
import NotFoundPage from '../components/NotFoundPage';
// import Header from '../components/Header';
import AddInvoicePage from '../components/AddInvoicePage';
import SalesReportPage from '../components/SalesReportPage';
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppTheme from '../themes/AppTheme';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  direction: 'rtl',
});

const AppRouter = () => (
  <MuiThemeProvider theme={AppTheme}>
    <Router>
      <div>
        <Switch>
          <Route path="/" component={HomePage} exact={true} />
          <Route path="/add-invoice" component={AddInvoicePage} />
          <Route path="/sales-report" component={SalesReportPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  </MuiThemeProvider>
);

export default AppRouter;

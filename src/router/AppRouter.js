import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import NotFoundPage from '../screens/shared/NotFoundPage';
import AppTheme from '../themes/AppTheme';

import Layout from '../screens/shared/Layout';

const history = createBrowserHistory();

const AppRouter = () => (
  <MuiThemeProvider theme={AppTheme}>
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/" component={Layout} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  </MuiThemeProvider>
);

export default AppRouter;

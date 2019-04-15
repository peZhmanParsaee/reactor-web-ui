import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// @material-ui/core
import { withStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

// local components
import AddInvoicePage from '../components/AddInvoice/AddInvoicePage';
import SalesReportPage from '../components/SalesReportPage';
import Footer from '../components/Footer';
import ToastMessage from '../components/ToastMessage';

// local dependencies
import layoutStyle from '../styles/jss/layouts/layoutStyle';
import AppTheme from '../themes/AppTheme';



class Layout extends React.Component {
  areWeInReportRoute = () => {
    return this.props.location.pathname === "/sales-report";
  };
  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={AppTheme}>
        <CssBaseline />
        <div className={classes.wrapper}>
        
          <Switch>
            <Route path="/add-invoice" component={AddInvoicePage} />
            <Route path="/sales-report" component={SalesReportPage} />
            <Redirect from="/" to="/add-invoice" />
          </Switch>

          <ToastMessage
            variant={this.props.message.type}
            message={this.props.message.text}
            open={this.props.message.open}
          />
          
          { this.areWeInReportRoute() ? null : <Footer />  }
        
        </div>
      </MuiThemeProvider>
        
    );
  }  
};

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    message: state.message
  };
};

const mapDispatchToProps = (dispatch) => ({
  showGlobalMessage: (message) => dispatch(showGlobalMessage(message))
});

// export default withStyles(layoutStyle)(Layout);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(layoutStyle)(Layout));

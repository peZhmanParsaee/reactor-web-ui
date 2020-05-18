import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// @material-ui/core
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CssBaseline from '@material-ui/core/CssBaseline';

// local dependencies
import Header from './shared/Header';
import homePageStyle from '../styles/jss/components/homePageStyle';

class HomePage extends React.PureComponent {
  componentWillMount() {
    console.log('HomePage componentWillMount');
  }

  componentWillUnmount() {
    console.log('HomePage componentWillUnmount');
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <CssBaseline />
        <Header />
        <List>
          <ListItem button component={Link} to="/add-invoice">
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="ثبت فاکتور جدید" className={classes.mainNavItem} />
          </ListItem>
          <ListItem button component={Link} to="/sales-report">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="گزارش فروش" className={classes.mainNavItem} />
          </ListItem>
        </List>
      </>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(homePageStyle)(HomePage);

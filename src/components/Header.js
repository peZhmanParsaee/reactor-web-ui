import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

import headerStyle from '../styles/jss/components/headerStyle';

const Header = (props) => {
  const { classes } = props;

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <TypoGraphy variant="h6" color="inherit" noWrap>
            <ShoppingCartIcon className={classes.headerAppIcon} />
            ری‌اکتور
          </TypoGraphy>
        </Toolbar>
      </AppBar>
    </header>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(headerStyle)(Header);

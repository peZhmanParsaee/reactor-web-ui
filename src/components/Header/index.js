import React from 'react';
import PropTypes from 'prop-types';
import { pure, onlyUpdateForKeys } from 'recompose';

// @material-ui/core
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const Header = (props) => {
  const { classes } = props;

  return (
    <header className={classes.header}>
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

export default Header;

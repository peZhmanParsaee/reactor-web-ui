import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

const Header = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <TypoGraphy variant="h6" color="inherit" noWrap>
            <ShoppingCartIcon className="header__app-icon" />
            ری‌اکتور
          </TypoGraphy>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;

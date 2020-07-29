import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { pure } from 'recompose';

// @material-ui/core components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export function Footer(props) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.right}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock} component={Link} to="/">
              <ListItemText primary="صفحه اصلی" className={classes.block} />
            </ListItem>
            <ListItem
              className={classes.inlineBlock}
              component={Link}
              to="/add-invoice"
            >
              <ListItemText
                primary="ثبت فاکتور جدید"
                className={classes.block}
              />
            </ListItem>
            <ListItem
              className={classes.inlineBlock}
              component={Link}
              to={{
                pathname: '/sales-report',
                state: {
                  openDrawer: true
                }
              }}
            >
              <ListItemText primary="گزارش فروش" className={classes.block} />
            </ListItem>
          </List>
        </div>
        <p className={classes.left}>
          <span>
            &copy; {1900 + new Date().getYear()} توسعه دهنده{' '}
            <a href="https://github.com/peZhmanParsaee" className={classes.a}>
              پژمان پارسایی
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Footer;

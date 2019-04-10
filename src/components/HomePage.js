import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log('HomePage componentWillMount');
  }
  componentWillUnmount() {
    console.log('HomePage componentWillUnmount');
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <List>
          <ListItem button component={Link} to="/add-invoice">
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="ثبت فاکتور جدید" className="mainNavItem" />
          </ListItem>
          <ListItem button component={Link} to="/sales-report">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="گزارش فروش" className="mainNavItem" />
          </ListItem>
        </List>
      </React.Fragment>
    );
  }
}

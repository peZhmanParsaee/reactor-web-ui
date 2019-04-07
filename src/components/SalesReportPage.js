import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles, MuiThemeProvider, createMuiTheme,  } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment-jalaali';

import classNames from 'classnames';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

// components
import Header from './Header';
import ToastMessage from './ToastMessage';
import GridContainer from './Grid/GridContainer';
import GridItem from './Grid/GridItem';
import Footer from "./Footer";
import { separateDigits } from '../helpers/numberHelpers';

// theme
import appTheme from '../themes/AppTheme';
import { finished } from 'stream';


import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';


import PropTypes from 'prop-types';


import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider
} from "material-ui-pickers";
import JalaliUtils from "@date-io/jalaali";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import appStyle from '../styles/jss/layouts/appStyle';


import { SingleDatePicker } from 'react-dates';
import { TimePicker, DatePicker, DateTimePicker } from 'material-ui-pickers'
import Calendar from 'material-ui-pickers/DatePicker/components/Calendar';


const renderMonthText = (input) => {  
  return input.format('jMM');
  return null;
}

const renderDayContents = (input) => {
  return input.format('DD');
  return null;
}


class SalesReportPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: false,
      invoices: [],
      offset: 0,
      limit: 10,
      finished: false,
      open: false,
      fromDate: null,
      toDate: null,
      fromDateCalendarFocused: false,
      toDateCalendarFocused: false,
      invoiceType: "INVOICE_ITEMS",
      selectedDate: new Date('2014-08-18T21:11:54'),
      selectedDate2: moment(),
      startDate: null,
      endDate: null
     };
  }

  handleStartDateChange = date => {
    this.setState(() => ({ startDate: date }));
  };
  handleEndDateChange = date => {
    this.setState(() => ({ endDate: date }));
  };
  componentDidMount() {
    this.loadMoreItems();

    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=this.refs.iScroll.scrollHeight){
        this.loadMoreItems();
      }
    });
  };
  displayInvoices() {
    let jsxItems = [];

    for (var invoice of this.state.invoices) {
      if (this.state.invoiceType === "INVOICES") {
        const jsx = (
          <TableRow key={invoice._id}>
           <TableCell style={{ textAlign: "center" }}>
             { invoice.customerName }
           </TableCell>
           <TableCell style={{ textAlign: "center" }}>
             { separateDigits({ number: invoice.totalPrice, showCurrency: true }) }
           </TableCell>
           <TableCell style={{ textAlign: "center" }}>{ invoice.no }</TableCell>
           <TableCell style={{ textAlign: "center" }}>
            { invoice.products.map(invoiceProduct => {
                 return (
                   <p>                  
                     <span>{invoiceProduct.name}</span>
                     <span> {invoiceProduct.count} عدد</span>
                   </p>
                 );
               })
             }
           </TableCell>
           <TableCell style={{ textAlign: "center" }}>{ invoice.deliverAtFormatted }</TableCell>
         </TableRow>
       );
       
       jsxItems.push(jsx);
      }
      if (this.state.invoiceType === "INVOICE_ITEMS") {
        const jsx = (
          <TableRow key={invoice.invoiceId}>
           <TableCell style={{ textAlign: "center" }}>
             { invoice.customerName }
           </TableCell>           
           <TableCell style={{ textAlign: "center" }}>
             { invoice.productName }
           </TableCell>
           <TableCell style={{ textAlign: "center" }}>
             { invoice.invoiceNo }
           </TableCell>
         </TableRow>
       );
       
       jsxItems.push(jsx);
      }
    }

     return jsxItems;
  };
  loadMoreItems() {
    if (this.state.finished === false) {
      this.setState({ loadingState: true });

      // axios.get(`${API_ENDPOINT}/api/v1/invoice?invoiceType=${this.state.invoiceType}&offset=${this.state.offset}&limit=${this.state.limit}&fromDate=${this.state.fromDate}&toDate=${this.state.toDate}`)
      const startDateTimeStamp = this.state.startDate && moment(this.state.startDate).valueOf();
      const endDateTimeStamp = this.state.endDate && moment(this.state.endDate).valueOf();
      axios.get(`${API_ENDPOINT}/api/v1/invoice?invoiceType=${this.state.invoiceType}&offset=${this.state.offset}&limit=${this.state.limit}&fromDate=${startDateTimeStamp}&toDate=${endDateTimeStamp}`)
        .then(res => {
          if (res.data.status === true) {
            if (res.data.payload.length) {
              this.setState(() => ({
                offset: this.state.offset + this.state.limit,
                loadingState: false,
                invoices: [
                  ...this.state.invoices,
                  ...res.data.payload
                ]
              }));
            } else {
              this.setState(() => ({
                finished: true,
                loadingState: false
              }));
            }
          }
        });
    } else {
      console.log('Finished ');
    }
  };
  handleDrawerOpen = () => {
    this.setState(() => ({ open: true }));
  };
  handleDrawerClose = () => {
    this.setState(() => ({ open: false }));
  };
  onFromDateChange = (date) => {    
    this.setState(() => ({ fromDate: date }));    
  };
  onFromDateFocusChange = ({ focused }) => {
    this.setState(() => ({ fromDateCalendarFocused: focused }));
  };
  onToDateChange = (date) => {    
    this.setState(() => ({ toDate: date }));
  };
  onToDateFocusChange = ({ focused }) => {
    this.setState(() => ({ toDateCalendarFocused: focused }));
  };
  onInvoiceTypeChange = (event) => {
    const invoiceType = event.target.value;
    this.setState(() => ({ invoiceType, invoices: [] }));
  };
  onSeachClick = () => {
    this.setState(() => ({
      offset: 0,
      invoices: [],
      open: false,
      finished: false
    }), () => {
      this.loadMoreItems();
    });
  };
  handleDateChange = date => {
    this.setState({ selectedDate: date })
  };
  render() {
    const { classes, theme } = this.props;    
    moment.locale('fa-IR');
    moment.loadPersian();
    
    return (
      <div>
        <div className={classes.wrapper}>
          <div classes="root">
            <CssBaseline />
            <AppBar
              position="fixed"
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" noWrap>
                  گزارش فروش
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              anchor="left"
              open={this.state.open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  { <ChevronRightIcon /> }
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem key={1}>
                  <ListItemText primary="انتخاب بازه زمانی"
                    style={{
                      textAlign: "right"
                    }}
                  />
                </ListItem>

                {
                  // <ListItem key={2}>
                  //   <div style={{position: 'absolute'}}>
                  //     <SingleDatePicker
                  //       date={this.state.fromDate}
                  //       onDateChange={this.onFromDateChange}
                  //       focused={this.state.fromDateCalendarFocused}
                  //       onFocusChange={this.onFromDateFocusChange}
                  //       numberOfMonths={1}
                  //       anchorDirection="right"
                  //       showDefaultInputIcon
                  //       isRTL
                  //       monthFormat="MMMM YYYY"
                  //       placeholder="از تاریخ"
                  //       renderMonthText={renderMonthText} 
                  //       renderDayContents={renderDayContents}
                  //     />
                  //   </div>                  
                  // </ListItem>
                  // <ListItem key={3}>
                  //   <SingleDatePicker
                  //     date={this.state.toDate}
                  //     onDateChange={this.onToDateChange}
                  //     focused={this.state.toDateCalendarFocused}
                  //     onFocusChange={this.onToDateFocusChange}
                  //     numberOfMonths={1}
                  //     isOutsideRange={() => false}
                  //     numberOfMonths={1}
                  //     anchorDirection="right"
                  //     showDefaultInputIcon
                  //     isRTL
                  //     monthFormat="YYYY/MM/DD"
                  //     placeholder="تا تاریخ"
                  //   />
                  // </ListItem>
                }
                
                <ListItem key={5}>
                  <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                    <div className="picker">
                      <DatePicker
                        clearable
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        clearLabel="پاک کردن"
                        labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "از تاریخ")}
                        value={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        animateYearScrolling={false}                        
                      />
                    </div>
                  </MuiPickersUtilsProvider>

                </ListItem>
                <ListItem key={6}>
                  <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                    <div className="picker">
                      <DatePicker
                        clearable
                        okLabel="تأیید"
                        cancelLabel="لغو"
                        clearLabel="پاک کردن"
                        labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "تا تاریخ")}
                        value={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        animateYearScrolling={false}
                      />
                    </div>
                  </MuiPickersUtilsProvider>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem key={11}>
                  <ListItemText
                    style={{
                      textAlign: "right"
                    }}
                  >نوع فاکتور</ListItemText>  
                </ListItem>
                <ListItem key={12}>
                  <FormControl component="fieldset" className={classes.formControl}>
                    {/* <FormLabel component="legend">نوع فاکتور</FormLabel> */}
                    <RadioGroup
                      aria-label="gender"
                      name="invoiceType"
                      className={classes.group}
                      value={this.state.invoiceType}
                      onChange={this.onInvoiceTypeChange}
                    >
                      <FormControlLabel
                        value="INVOICE_ITEMS"
                        control={<Radio color="primary" />}
                        label="آیتم های فاکتور"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="INVOICES"
                        control={<Radio color="primary" />}
                        label="فاکتور"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </ListItem>
                <ListItem key={13}>
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.onSeachClick}
                    >
                      <SearchIcon></SearchIcon>
                      جستجو
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Drawer>
            
              <div className={classes.content}>
                <div className={classes.container}>
                  <div ref="iScroll" 
                    style={{ 
                      height: "auto", 
                      overflow: "auto",
                      marginBottom: "100px"
                    }}>
                    {
                      this.state.invoiceType === 'INVOICES' && (
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: "center", width: "20%", fontWeight: "bold" }}>نام خریدار</TableCell>
                              <TableCell style={{ textAlign: "center", width: "20%", fontWeight: "bold" }}>مبلغ</TableCell>
                              <TableCell style={{ textAlign: "center", width: "20%", fontWeight: "bold" }}>شماره فاکتور</TableCell>
                              <TableCell style={{ textAlign: "center", width: "20%", fontWeight: "bold" }}>محصولات</TableCell>
                              <TableCell style={{ textAlign: "center", width: "20%", fontWeight: "bold" }}>زمان تحویل</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            { this.displayInvoices() }
                          </TableBody>
                        </Table>
                      )
                    }

                    {
                      this.state.invoiceType === 'INVOICE_ITEMS' && (
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>نام خریدار</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>نام محصول</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>شماره فاکتور</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            { this.displayInvoices() }
                          </TableBody>
                        </Table>
                      )
                    }
                    
                    
                    {this.state.loadingState ? <p className="loading"> در حال بارگزاری ادامه داده ها ...</p> : ""}
            
                  </div>
                  {

                    // <GridContainer className={classes.grid} justify="space-around">
                    //   <MuiPickersUtilsProvider>
                    //     <DatePicker
                    //       margin="normal"
                    //       label="Date picker"
                    //       value={this.state.selectedDate}
                    //       onChange={this.handleDateChange}
                    //     />
                    //   </MuiPickersUtilsProvider>                    
                    // </GridContainer>
                  }
                  

                </div>              
              </div>
            
          </div>
        </div>        
        <Footer />
      </div>
    );
  }
} 

SalesReportPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(appStyle)(SalesReportPage);

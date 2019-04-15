import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment-jalaali';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import JalaliUtils from "@date-io/jalaali";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// local dependencies
import { separateDigits } from '../helpers/numberHelpers';
import { generateKey } from '../helpers/keyHelper';
import appStyle from '../styles/jss/layouts/appStyle';

// actions
import { 
  salesReportFormSetOpenDrawerState,
  salesReportFormSetStartDate,
  salesReportFormSetEndDate,
  salesReportFormSetInvoiceType,
  salesReportFormSetLoadingState,
  salesReportFormSetListPage,
  salesReportFormSetFinishListPages,
  salesReportFormSearch
} from '../actions/salesReportForm';

class SalesReportPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount () {
    const { openDrawer } = this.props.location.state;
    if (openDrawer !== undefined && openDrawer !== null) {
      this.props.salesReportFormSetOpenDrawerState(openDrawer);
    }
  }
  handleStartDateChange = date => {
    this.props.salesReportFormSetStartDate(date);
  };
  handleEndDateChange = date => {
    this.props.salesReportFormSetEndDate(date);
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

    for (var invoice of this.props.salesReportForm.invoices) {
      if (this.props.salesReportForm.invoiceType === "INVOICES") {
        const jsx = (
          <ListItem key={invoice._id} className={ this.props.classes.reportListItemRow }>
            <List className={ this.props.classes.reportNestedListItemRow }>
              <ListItem className={ this.props.classes.reportNestedListItem }>
                { invoice.customerName }
              </ListItem>
              <ListItem className={ this.props.classes.reportNestedListItem }>
                { separateDigits({ number: invoice.totalPrice, showCurrency: true }) }
              </ListItem>
              <ListItem className={ this.props.classes.reportNestedListItem }
                style={{
                  width: 120
                }}
              >{ invoice.no }</ListItem>
              <ListItem className={ this.props.classes.reportNestedListItem }
                style={{ width: 228 }}
              >{ invoice.deliverAtFormatted }</ListItem>
            </List>
          </ListItem>
        );
       
        jsxItems.push(jsx);
      }
      if (this.props.salesReportForm.invoiceType === "INVOICE_ITEMS") {
        const jsx = (
          <ListItem key={generateKey()} className={ this.props.classes.reportListItemRow }>
            <List className={ this.props.classes.reportNestedListItemRow }>
              <ListItem className={ this.props.classes.reportNestedListItem }>
                { invoice.customerName }
              </ListItem>
              <ListItem className={ this.props.classes.reportNestedListItem }>
                { invoice.productName }
              </ListItem>
              <ListItem className={ this.props.classes.reportNestedListItem }
                style={{
                  width: 120
                }}
              >
                { invoice.invoiceNo }
              </ListItem>
            </List>           
          </ListItem>
        );
       
        jsxItems.push(jsx);
      }
    }

    return jsxItems;
  };
  loadMoreItems() {
    if (this.props.salesReportForm.finished === false) {
      this.props.salesReportFormSetLoadingState(true);

      const startDateTimeStamp = this.props.salesReportForm.startDate && moment(this.props.salesReportForm.startDate).valueOf();
      const endDateTimeStamp = this.props.salesReportForm.endDate && moment(this.props.salesReportForm.endDate).valueOf();
      axios.get(`${API_ENDPOINT}/api/v1/invoice?invoiceType=${this.props.salesReportForm.invoiceType}&offset=${this.props.salesReportForm.offset}&limit=${this.props.salesReportForm.limit}&fromDate=${startDateTimeStamp}&toDate=${endDateTimeStamp}`)
        .then(res => {
          if (res.data.status === true) {
            if (res.data.payload.length) {
              this.props.salesReportFormSetListPage({
                offset: this.props.salesReportForm.offset + this.props.salesReportForm.limit,
                loadingState: false,
                listPage: res.data.payload
              });
            } else {
              this.props.salesReportFormSetFinishListPages({
                finished: true,
                loadingState: false
              });
            }
          }
        });
    } else {
      console.log('Finished ');
    }
  };
  handleDrawerOpen = () => {
    this.props.salesReportFormSetOpenDrawerState(true);
  };
  handleDrawerClose = () => {
    this.props.salesReportFormSetOpenDrawerState(false);
  };
  onInvoiceTypeChange = (event) => {
    const invoiceType = event.target.value;
    this.props.salesReportFormSetInvoiceType(invoiceType);
  };
  onSearchClick = () => {
    this.props.salesReportFormSearch();
    this.loadMoreItems();
  };
  handleDateChange = date => {
    this.setState({ selectedDate: date })
  };
  render() {
    const { classes } = this.props;

    moment.locale('fa-IR');
    moment.loadPersian();
    
    return (
      <Fragment>
        
        {this.props.salesReportForm.open ? 
          <div style={{ position: "fixed", zIndex: 1, left: 0, right: 0, top: 0, bottom: 0 }} 
            onClick={() => this.handleDrawerClose()} /> 
          : null
        }
        
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
          open={this.props.salesReportForm.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={(open) => {
            this.props.salesReportFormSetOpenDrawerState(false);
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
            
            <ListItem key={5}>
              <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <div className="picker">
                  <DatePicker
                    clearable
                    okLabel="تأیید"
                    cancelLabel="لغو"
                    clearLabel="پاک کردن"
                    labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "از تاریخ")}
                    value={this.props.salesReportForm.startDate}
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
                    value={this.props.salesReportForm.endDate}
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
                <RadioGroup
                  aria-label="gender"
                  name="invoiceType"
                  className={classes.group}
                  value={this.props.salesReportForm.invoiceType}
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
                  onClick={this.onSearchClick}
                >
                  <SearchIcon></SearchIcon>
                  جستجو
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Drawer>
        
        <div className={classes.mainContent}>
        
          <div className={classes.reportInfiniteScrollContainer}
            ref="iScroll" >

            {
              this.props.salesReportForm.invoiceType === 'INVOICES' && (
                <List>
                  <ListItem className={ classes.reportListItemHeadRow }>
                    <List className={ classes.reportNestedListItemHeadRow }>
                      <ListItem className={ classes.reportNestedListItemHead }>نام خریدار</ListItem>
                      <ListItem className={ classes.reportNestedListItemHead }>مبلغ</ListItem>
                      <ListItem className={ classes.reportNestedListItemHead }
                        style={{
                          width: 120
                        }}
                      >شماره فاکتور</ListItem>
                      <ListItem 
                        className={ classes.reportNestedListItemHead }
                        style={{ width: 220 }}
                      >زمان تحویل</ListItem>
                    </List>
                  </ListItem>
                  
                  { this.displayInvoices() }
                  
                </List>
              )
            }

            {
              this.props.salesReportForm.invoiceType === 'INVOICE_ITEMS' && (
                <List>
                  <ListItem className={ classes.reportListItemHeadRow }>
                    <List className={ classes.reportNestedListItemHeadRow }>
                      <ListItem className={ classes.reportNestedListItemHead }>نام خریدار</ListItem>
                      <ListItem className={ classes.reportNestedListItemHead }>نام محصول</ListItem>
                      <ListItem className={ classes.reportNestedListItemHead }
                        style={{
                          width: 120
                        }}
                      >شماره فاکتور</ListItem>
                    </List>
                  </ListItem>
                  
                  { this.displayInvoices() }
                  
                </List>
              )
            }
            
            
            {this.props.salesReportForm.loadingState ? <p className="loading"> در حال بارگزاری ادامه داده ها ...</p> : ""}
    
          </div>
        </div>
        
      </Fragment>
    );
  }
} 

SalesReportPage.propTypes = {
  classes: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
  return {
    salesReportForm: state.salesReportForm
  };
};

const mapDispatchToProps = (dispatch) => ({
  salesReportFormSetOpenDrawerState: (openDrawerState) => dispatch(salesReportFormSetOpenDrawerState(openDrawerState)),
  salesReportFormSetStartDate: (startDate) => dispatch(salesReportFormSetStartDate(startDate)),
  salesReportFormSetEndDate: (endDate) => dispatch(salesReportFormSetEndDate(endDate)),
  salesReportFormSetInvoiceType: (invoiceType) => dispatch(salesReportFormSetInvoiceType(invoiceType)),
  salesReportFormSetLoadingState: (loadingState) => dispatch(salesReportFormSetLoadingState(loadingState)),
  salesReportFormSetListPage: ({ offset, loadingState, listPage }) => dispatch(salesReportFormSetListPage({ offset, loadingState, listPage })),
  salesReportFormSetFinishListPages: ({ finished, loadingState }) => dispatch(salesReportFormSetFinishListPages({ finished, loadingState })),
  salesReportFormSearch: () => dispatch(salesReportFormSearch())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(SalesReportPage));

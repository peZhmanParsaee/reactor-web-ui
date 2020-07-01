import React, { Fragment, PureComponent } from 'react';
import axios from 'axios';
import moment from 'moment-jalaali';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import JalaliUtils from '@date-io/jalaali';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';

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
import { separateDigits } from '../../../helpers/numberHelpers';
import { generateKey } from '../../../helpers/keyHelper';
import appStyle from '../../../styles/jss/layouts/appStyle';

class SalesReportPage extends PureComponent {
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
      invoiceType: 'INVOICE_ITEMS',
      selectedDate: new Date('2014-08-18T21:11:54'),
      selectedDate2: moment(),
      startDate: null,
      endDate: null
    };
  }
  componentWillMount() {
    const { openDrawer } = this.props.location.state;
    if (openDrawer !== undefined && openDrawer !== null) {
      this.setState(() => ({ open: openDrawer }));
    }
  }
  handleStartDateChange = (date) => {
    this.setState(() => ({ startDate: date }));
  };
  handleEndDateChange = (date) => {
    this.setState(() => ({ endDate: date }));
  };
  componentDidMount() {
    this.loadMoreItems();

    this.refs.iScroll.addEventListener('scroll', () => {
      if (
        this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
        this.refs.iScroll.scrollHeight
      ) {
        this.loadMoreItems();
      }
    });
  }
  displayInvoices() {
    let jsxItems = [];

    for (var invoice of this.state.invoices) {
      if (this.state.invoiceType === 'INVOICES') {
        const jsx = (
          <ListItem
            key={invoice._id}
            className={this.props.classes.reportListItemRow}
          >
            <List className={this.props.classes.reportNestedListItemRow}>
              <ListItem className={this.props.classes.reportNestedListItem}>
                {invoice.customerName}
              </ListItem>
              <ListItem className={this.props.classes.reportNestedListItem}>
                {separateDigits({
                  number: invoice.totalPrice,
                  showCurrency: true
                })}
              </ListItem>
              <ListItem
                className={this.props.classes.reportNestedListItem}
                style={{
                  width: 120
                }}
              >
                {invoice.no}
              </ListItem>
              <ListItem
                className={this.props.classes.reportNestedListItem}
                style={{ width: 228 }}
              >
                {invoice.deliverAtFormatted}
              </ListItem>
            </List>
          </ListItem>
        );

        jsxItems.push(jsx);
      }
      if (this.state.invoiceType === 'INVOICE_ITEMS') {
        const jsx = (
          <ListItem
            key={generateKey()}
            className={this.props.classes.reportListItemRow}
          >
            <List className={this.props.classes.reportNestedListItemRow}>
              <ListItem className={this.props.classes.reportNestedListItem}>
                {invoice.customerName}
              </ListItem>
              <ListItem className={this.props.classes.reportNestedListItem}>
                {invoice.productName}
              </ListItem>
              <ListItem
                className={this.props.classes.reportNestedListItem}
                style={{
                  width: 120
                }}
              >
                {invoice.invoiceNo}
              </ListItem>
            </List>
          </ListItem>
        );

        jsxItems.push(jsx);
      }
    }

    return jsxItems;
  }
  loadMoreItems() {
    if (this.state.finished === false) {
      this.setState({ loadingState: true });

      const startDateTimeStamp =
        this.state.startDate && moment(this.state.startDate).valueOf();
      const endDateTimeStamp =
        this.state.endDate && moment(this.state.endDate).valueOf();
      axios
        .get(
          `${API_ENDPOINT}/api/v1/invoice?invoiceType=${this.state.invoiceType}&offset=${this.state.offset}&limit=${this.state.limit}&fromDate=${startDateTimeStamp}&toDate=${endDateTimeStamp}`
        )
        .then((res) => {
          if (res.data.status === true) {
            if (res.data.payload.length) {
              this.setState(() => ({
                offset: this.state.offset + this.state.limit,
                loadingState: false,
                invoices: [...this.state.invoices, ...res.data.payload]
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
  }
  handleDrawerOpen = () => {
    this.setState(() => ({ open: true }));
  };
  handleDrawerClose = () => {
    this.setState(() => ({ open: false }));
  };
  onInvoiceTypeChange = (event) => {
    const invoiceType = event.target.value;
    this.setState(() => ({ invoiceType, invoices: [] }));
  };
  onSeachClick = () => {
    this.setState(
      () => ({
        offset: 0,
        invoices: [],
        open: false,
        finished: false
      }),
      () => {
        this.loadMoreItems();
      }
    );
  };
  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };
  render() {
    const { classes } = this.props;

    moment.locale('fa-IR');
    moment.loadPersian();

    return (
      <Fragment>
        {this.state.open ? (
          <div
            style={{
              position: 'fixed',
              zIndex: 1,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}
            onClick={() => this.handleDrawerClose()}
          />
        ) : null}

        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
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
            paper: classes.drawerPaper
          }}
          onClose={(open) => {
            this.setState(() => ({ open: false }));
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {<ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem key={1}>
              <ListItemText
                primary="انتخاب بازه زمانی"
                style={{
                  textAlign: 'right'
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
                    labelFunc={(date) =>
                      date ? date.format('jYYYY/jMM/jDD') : 'از تاریخ'
                    }
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
                    labelFunc={(date) =>
                      date ? date.format('jYYYY/jMM/jDD') : 'تا تاریخ'
                    }
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
                  textAlign: 'right'
                }}
              >
                نوع فاکتور
              </ListItemText>
            </ListItem>
            <ListItem key={12}>
              <FormControl component="fieldset" className={classes.formControl}>
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

        <div className={classes.mainContent}>
          <div className={classes.reportInfiniteScrollContainer} ref="iScroll">
            {this.state.invoiceType === 'INVOICES' && (
              <List>
                <ListItem className={classes.reportListItemHeadRow}>
                  <List className={classes.reportNestedListItemHeadRow}>
                    <ListItem className={classes.reportNestedListItemHead}>
                      نام خریدار
                    </ListItem>
                    <ListItem className={classes.reportNestedListItemHead}>
                      مبلغ
                    </ListItem>
                    <ListItem
                      className={classes.reportNestedListItemHead}
                      style={{
                        width: 120
                      }}
                    >
                      شماره فاکتور
                    </ListItem>
                    <ListItem
                      className={classes.reportNestedListItemHead}
                      style={{ width: 220 }}
                    >
                      زمان تحویل
                    </ListItem>
                  </List>
                </ListItem>

                {this.displayInvoices()}
              </List>
            )}

            {this.state.invoiceType === 'INVOICE_ITEMS' && (
              <List>
                <ListItem className={classes.reportListItemHeadRow}>
                  <List className={classes.reportNestedListItemHeadRow}>
                    <ListItem className={classes.reportNestedListItemHead}>
                      نام خریدار
                    </ListItem>
                    <ListItem className={classes.reportNestedListItemHead}>
                      نام محصول
                    </ListItem>
                    <ListItem
                      className={classes.reportNestedListItemHead}
                      style={{
                        width: 120
                      }}
                    >
                      شماره فاکتور
                    </ListItem>
                  </List>
                </ListItem>

                {this.displayInvoices()}
              </List>
            )}

            {this.state.loadingState ? (
              <p className="loading"> در حال بارگزاری ادامه داده ها ...</p>
            ) : (
              ''
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

SalesReportPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(SalesReportPage);

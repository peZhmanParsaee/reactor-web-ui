import React from 'react';
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
import axios from 'axios';

import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import propTypes from 'prop-types';

// @material-ui/core
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CssBaseline from '@material-ui/core/CssBaseline';
import Stepper from '@material-ui/core/Stepper';;
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

// @material-ui/icons
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// components
import Header from './Header';
import AddProductDialog from './AddProductDialog';
import ToastMessage from './ToastMessage';
import GridContainer from './Grid/GridContainer';
import GridItem from './Grid/GridItem';
import Footer from "./Footer";

import Autosuggest from 'react-autosuggest';
import deburr from 'lodash/deburr';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';


import theme from '../themes/AppTheme';
import appStyle from '../styles/jss/layouts/appStyle';

import { separateDigits } from '../helpers/numberHelpers';
import { startAddInvoice } from '../actions/invoices';
import { startAddProduct } from '../actions/products';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function getSteps() {
  return [ 'تکمیل اطلاعات اولیه', 'تاریخ تحویل' ];
}

class AddInvoicePage extends React.Component {
  state = {
    activeStep: 0,    
    isAddProductDialogOpen: false,
    invoice: {
      no: null,
      date: moment().format('jYYYY/jMM/jDD'),
      products: [],
      customerId: 0,
      newProduct: {
        _id: 0,
        count: 1,
        unitPrice: 0,
        totalPrice: 0
      },
      address: {
        provinceId: null,
        cityId: null
      },
      mailType: "registered",
      deliverAfter: "",
      deliverAfterTimeUnit: "",
      totalProce: 0
    },
    message: {
      text: "",
      show: false,
      type: "warning"
    },
    newProduct: {
      name: '',
      stock: 0,
      unitPrice: 0
    },
    single: '',
    popper: '',
    suggestions: [],
  };
  async componentDidMount() {
    const res = await axios.get(`${API_ENDPOINT}/api/v1/invoice/new-invoice-no`);
    if (res.data.status === true) {
      this.setState(() => ({            
        invoice: {
          ...this.state.invoice,              
          no: res.data.payload
        }
      }));
    }      
  }
  onOpenAddProductDialog = (e) => {
    this.setState(() => ({ isAddProductDialogOpen: true }));
  }
  closeAddProductDialog = () => {
    this.setState(() => ({ isAddProductDialogOpen: false }));
  }
  onCustomerChange = (event) => {
    event.persist();
    const selectedCustomerId = event.target.value ;
    this.setState(() => ({ invoice: { ...this.state.invoice, customerId: selectedCustomerId } }));
  }
  onNewProductSelectChange = (event) => {
    event.persist();
    const _id = event.target.value;
    const product = this.props.products.find(x => x._id == _id);
    this.setState(() => ({ 
      invoice: { 
        ...this.state.invoice,
        newProduct: { 
          _id: event.target.value,
          count: 1,
          unitPrice: product.unitPrice,
          totalPrice: product.unitPrice * 1
        }
      }
    }));
  }
  onNewProductCountChange = (event) => {    
    event.persist();
    const count = event.target.value;
    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      this.setState(() => ({
        invoice: { ...this.state.invoice, 
        newProduct:{ 
          ...this.state.invoice.newProduct, 
          count: parseInt(event.target.value, 10),
          totalPrice: parseInt(event.target.value * this.state.invoice.newProduct.unitPrice)
        }
      }}))
    }
  }
  onAddNewProductToInvoice = (event) => {
    if (!this.state.invoice.newProduct._id || !this.state.invoice.newProduct.count) {
      this.showMessage({ type: "warning", text: "خطای اعتبارسنجی، نام محصول و تعداد اجباری است." });
      return;
    }
    const product = this.props.products.find(x => x._id == this.state.invoice.newProduct._id);
    const newInvoiceProduct = {
      _id: this.state.invoice.newProduct._id,
      count: this.state.invoice.newProduct.count,
      unitPrice: this.state.invoice.newProduct.unitPrice,
      totalPrice: this.state.invoice.newProduct.totalPrice,
      name: product.name
    };
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        products: [
          ...this.state.invoice.products, 
          newInvoiceProduct
        ], 
        newProduct: {
          _id: 0,
          count: 1,
          unitPrice: 0,
          totalPrice: 0
        },
        totalPrice: this.state.invoice.totalProce + newInvoiceProduct.totalPrice
      }
    }));
    this.showMessage({ type: "success", text: "محصول به فاکتور اضافه شد." });
  }
  showMessage = ({ text, type }) => {
    this.setState(() => ({
      message: {
        type: type,
        show: true,
        text: text
      }
    }));
    
    setTimeout(function() {
      this.setState(() => ({
        message: {
          show: false,
          type: type,
          text: text
        }
      }));
    }.bind(this), 2000);
  }
  onRemoveProductFromInvoice = (_id) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        products: this.state.invoice.products.filter(invoiceProduct => invoiceProduct._id != _id)
      }
    });
  }
  handleNextStep = () => {
    if (this.state.activeStep === 0) {
      if (this.state.invoice.products.length && this.state.invoice.customerId) {
        this.setState(() => ({
          activeStep: this.state.activeStep + 1
        }));
      } else {
        this.showMessage({ 
          type: "warning",
          text: "انتخاب مشتری و افزودن حداقل یک محصول اجباری است."
        });
      }
    } else if (this.state.activeStep === 1) {
      if (this.state.invoice.products.length 
        && this.state.invoice.customerId
        && this.state.invoice.address.provinceId
        && this.state.invoice.address.cityId
        && this.state.invoice.deliverAfter
        && this.state.invoice.deliverAfterTimeUnit
        ) {
          let { newProduct, ...invoice } = this.state.invoice;
          this.props.startAddInvoice(invoice);
          this.props.history.push('/');
        } else {
          this.showMessage({ 
            type: "warning",
            text: "اطلاعات فاکتور را جهت ثبت کامل نمایید."
          });
        }
    } else {
      console.log('Error, Unrecognized step in add new invoice form');
    }
  }
  handleBackStep = () => {
    if (this.state.activeStep === 1) {
      this.setState(() => ({
        activeStep: this.state.activeStep - 1
      }));
    }
  }
  onProvinceChange = (event) => {
    const provinceId = event.target.value;
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        address: {
          provinceId: provinceId
        }
      }
    }));
  }
  onCityChange = (event) => {
    const cityId = event.target.value;
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        address: {
          ...this.state.invoice.address,
          cityId
        }
      }
    }));
  };
  onMailTypeChange = (event) => {
    const mailType = event.target.value;
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        mailType
      }
    }));
  };
  ondeliverAfterChange = (event) => {
    const deliverAfter = event.target.value;
    if (deliverAfter.match(/^[1-9]{1}[0-9]{0,1}$/)) {
      this.setState(() => ({
        invoice: {
          ...this.state.invoice,
          deliverAfter
        }
      }));
    }    
  }
  onDeliverAfterTimeUnit = (event) => {
    const deliverAfterTimeUnit = event.target.value;
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        deliverAfterTimeUnit
      }
    }));
  };
  onCloseDialog = () => {
    this.setState(() => ({ 
      isAddProductDialogOpen: false,
      newProduct: {
        name: '',
        stock: 0,
        unitPrice: 0
      }
    }));
  };
  onAddProduct = () => {
    if (!this.state.newProduct.name || !this.state.newProduct.stock || !this.state.newProduct.unitPrice) {
      this.showMessage({ 
        type: "warning",
        text: "خطای اعتبارسنجی، ورودیها را بررسی کنید."
      });
      return;
    }
    
    this.props.startAddProduct(this.state.newProduct);
    this.showMessage({ 
      type: "success",
      text: "محصول اضافه شد."
    });
    this.onCloseDialog();
  }
  onNameChage = (event) => {
    event.persist();
    const name = event.target.value;
    this.setState(() => ({ 
      newProduct: {        
        ...this.state.newProduct,
        name
      }
    }));
  }
  onStockChange = (event) => {
    event.persist();
    const stock = event.target.value;
    if (stock.match(/^[1-9]{1}[0-9]{0,6}$/) || !stock) {
      this.setState(() => ({
        newProduct: {
          ...this.state.newProduct,
          stock
        }
      }));
    }
  }
  onUnitPriceChange = (event) => {
    event.persist();
    const unitPrice = event.target.value;
    if (unitPrice.match(/^[1-9]{1}[0-9]{0,5}$/) || !unitPrice) {
      this.setState(() => ({
        newProduct: {
          ...this.state.newProduct,
          unitPrice
        }
      }));
    }
  }
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = name => (event, { newValue }) => {
    const selectedCustomer = this.props.customers.find(x => x.fullName === newValue);
        
    if (selectedCustomer) {
      this.setState({
        [name]: newValue,
        invoice: { 
          ...this.state.invoice,
          customerId: selectedCustomer._id
        }
      });
    } else {
      this.setState({
        [name]: newValue
      });
    }
    
  };
  
  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.fullName, query);
    const parts = parse(suggestion.fullName, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
          )}
        </div>
      </MenuItem>
    );
  }

  getSuggestions = (value) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.props.customers.filter(suggestion => {
          const keep =
            count < 5 && suggestion.fullName.slice(0, inputLength).toLowerCase() === inputValue;
          

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.fullName;
  }
  
  render() {

    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    let stepContent;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion: this.renderSuggestion,
    };

    if (activeStep === 0) {
      stepContent = (
        <div className="container">
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} style={{marginBottom: '15px'}}>
              <Typography style={{fontWeight: 'bold'}}>
                شماره فاکتور
              </Typography>
              <span>{ this.state.invoice.no }</span>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} style={{marginBottom: '15px'}}>
              <Typography style={{fontWeight: 'bold'}}>
                تاریخ امروز
              </Typography>
              <span>{ this.state.invoice.date }</span>
            </GridItem>          
            <GridItem xs={12} sm={12} md={6}
              className="autosuggest"
              style={{marginBottom: '15px'}}
            >
              <FormControl>
                <Typography style={{fontWeight: 'bold'}}>
                  نام و نام خانوادگی
                </Typography>
                <Autosuggest
                  {...autosuggestProps}
                  inputProps={{
                    classes,
                    placeholder: 'جست و جو',
                    value: this.state.single,
                    onChange: this.handleChange('single'),
                  }}
                  theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                  }}
                  renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                      {options.children}
                    </Paper>
                  )}
                />
              </FormControl>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{width:'30%', textAlign: 'center'}}>نام محصول</TableCell>
                    <TableCell style={{width:'20%', textAlign: 'center'}}>تعداد</TableCell>
                    <TableCell style={{width:'20%', textAlign: 'center'}}>قیمت واحد</TableCell>
                    <TableCell style={{width:'20%', textAlign: 'center'}}>قیمت کل</TableCell>
                    <TableCell style={{width:'10%', textAlign: 'center'}}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { this.state.invoice.products.map(product => {
                    return (
                      <TableRow key={product._id}>
                        <TableCell component="th" scope="product" style={{textAlign: 'center'}}>
                          { product.name }
                        </TableCell>
                        <TableCell style={{textAlign: 'center'}}>{ product.count }</TableCell>
                        <TableCell style={{textAlign: 'center'}}>{ separateDigits({ number: product.unitPrice, showCurrency: true }) }</TableCell>
                        <TableCell className="totalPrice"
                          style={{textAlign: 'center'}}
                        >{ separateDigits({ number: product.totalPrice }) }</TableCell>
                        <TableCell style={{textAlign: 'center'}}>
                          <IconButton 
                            onClick={() => { 
                              this.onRemoveProductFromInvoice(product._id);
                            }}
                          >
                            <Icon>remove_circle</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                    <TableRow>
                      <TableCell style={{textAlign: 'center'}}>
                        <IconButton onClick={this.onOpenAddProductDialog}>
                          <Icon>add_circle</Icon>
                        </IconButton>
                        <Select
                          value={this.state.invoice.newProduct._id}
                          onChange={this.onNewProductSelectChange}
                          className={classes.selectBox}
                        >
                        {this.props.products.filter(product => {
                          const found = this.state.invoice.products.find(invoiceProduct => {
                            return invoiceProduct._id === product._id;
                          });
                          return !found;
                        }).map(peoduct => {
                          return (
                            <MenuItem key={peoduct._id} value={peoduct._id}>
                              { peoduct.name }
                            </MenuItem>
                          );
                        })}
                      </Select>
                      </TableCell>
                      <TableCell style={{textAlign: 'center'}}>
                        <TextField
                          type="number"
                          value={this.state.invoice.newProduct.count}
                          onChange={this.onNewProductCountChange}
                        >
                        </TextField>
                      </TableCell>
                      <TableCell style={{textAlign: 'center'}}>
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.unitPrice, showCurrency: true }) }</Typography>
                      </TableCell>
                      <TableCell style={{textAlign: 'center'}}>
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.totalPrice }) }</Typography>
                      </TableCell>
                      <TableCell style={{textAlign: 'center'}}>
                        <IconButton 
                          onClick={this.onAddNewProductToInvoice}
                        >
                          <Icon>add_circle</Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  
                </TableBody>
              </Table>

            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Dialog 
                open={this.state.isAddProductDialogOpen}
                onClose={this.onCloseDialog}
                >
                <DialogTitle>اضافه کردن محصول جدید</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="name"
                      className="form-control__input-label"
                    >نام محصول</InputLabel>
                    <Input id="name"
                      onChange={this.onNameChage}
                      value={this.state.newProduct.name}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="stock"
                      className="form-control__input-label"
                    >موجودی</InputLabel>
                    <Input id="stock"
                      value={this.state.newProduct.stock}
                      onChange={this.onStockChange}
                      type="text"
                      startAdornment={<InputAdornment position="start">عدد</InputAdornment>}
                    />
                  </FormControl>
                  <FormControl fullWidth
                  >
                    <InputLabel htmlFor="unit-price"            
                      className="form-control__input-label"
                    >قیمت واحد</InputLabel>
                    <Input id="unit-price"
                      value={this.state.newProduct.unitPrice}
                      onChange={this.onUnitPriceChange}
                      type="text"
                      startAdornment={<InputAdornment position="end">تومان</InputAdornment>}
                    />
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onAddProduct}
                    color="primary"
                    variant="contained"
                  >
                    ذخیره
                  </Button>
                  <Button onClick={this.onCloseDialog}
                    variant="contained"
                  >
                    انصراف
                  </Button>
                </DialogActions>
              </Dialog>
            </GridItem>
          </GridContainer>
        </div>
      );
    } else if (activeStep == 1) {
      stepContent = (
        <div className="container">
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}
              style={{
                marginBottom: "30px"
              }}
            >
              <Typography 
                style={{
                  fontWeight: "bold"
                }}
              >
                استان
              </Typography>
              <Select
                value={this.state.invoice.address.provinceId}
                onChange={this.onProvinceChange}
                className={classes.selectBox}
              >
                {this.props.provinces.map(province => {
                  return (
                    <MenuItem key={province._id} value={province._id}>
                      { province.name }
                    </MenuItem>
                  );
                })}
              </Select>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}
              style={{
                marginBottom: "30px"
              }}
            >
              <Typography
                style={{
                  fontWeight: "bold"
                }}
              >
                شهر
              </Typography>
              <Select
                value={this.state.invoice.address.cityId}
                onChange={this.onCityChange}
                className={classes.selectBox}
              >
                {this.props.provinces
                  .find(province => {
                    return province._id === this.state.invoice.address.provinceId;
                  }) ?
                  this.props.provinces
                  .find(province => {
                    return province._id === this.state.invoice.address.provinceId;
                  })
                  .cities
                  .map(cityInProvince => {
                    return (
                      <MenuItem key={cityInProvince._id} value={cityInProvince._id}>
                        { cityInProvince.name }
                      </MenuItem>
                    );
                  }                  
                ): null
              }
              </Select>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}
              style={{
                marginBottom: "30px"
              }}
            >
              <FormControl component="fieldset" className="formControl">
                <FormLabel component="legend"
                  style={{
                    fontWeight: "bold"
                  }}
                >نوع پست</FormLabel>
                <RadioGroup
                  aria-label="MailType"
                  name="mailType"
                  className={classes.group}
                  value={this.state.invoice.mailType}
                  onChange={this.onMailTypeChange}
                  style={{display: 'flex', flexDirection: 'row'}}
                >
                  <FormControlLabel value="registered" control={<Radio />} label="عادی" />
                  <FormControlLabel value="certified" control={<Radio />} label="پیشتاز" />
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}
              style={{
                marginBottom: "30px"
              }}
            >
              <FormControl className="formControl"
                
              >
                <FormLabel component="legend"
                  
                >تاریخ تحویل</FormLabel>                
                
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <TextField
                    type="number"
                    value={this.state.invoice.deliverAfter}
                    onChange={this.ondeliverAfterChange}
                    style={{
                      display: "inline-block",
                      marginLeft: "10px"
                    }}
                  />

                  <Select
                    value={this.state.invoice.deliverAfterTimeUnit}
                    onChange={this.onDeliverAfterTimeUnit}
                    className={classes.selectBox}
                    style={{
                      display: "inline-block",
                      marginLeft: "10px"
                    }}
                  >
                    <MenuItem key="hour" value="hour">
                      ساعت
                    </MenuItem>
                    <MenuItem key="day" value="day">
                      روز
                    </MenuItem>
                    <MenuItem key="month" value="month">
                      ماه
                    </MenuItem>
                  </Select>

                  <Typography
                    style={{
                      display: "inline-block",
                      marginLeft: "10px"
                    }}
                  >
                    بعد از تاریخ ثبت سفارش
                  </Typography>

                </div>
                
              </FormControl>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
    
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.wrapper}>
          <div className={classes.root}>
            <CssBaseline />
            <Header/>
            
              <div className={classes.mainContent}>
                <div className={classes.container}>
                  <GridContainer>
                    <GridItem xs={12}>

                      <Typography
                        style={{ 
                          marginTop: "18px"
                        }}
                      >
                        ثبت فاکتور جدید
                      </Typography>
                      <Stepper activeStep={activeStep}>
                        { steps.map((label, index) => {
                          const props = {};
                          const labelProps = {};
                          return (
                            <Step key={label} {...props}>
                              <StepLabel 
                                className={{ // apply this style
                                  iconContainer: classes.iconContainer
                                }}
                                {...labelProps}>{label}</StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>        
                      { stepContent }
                      <div className="stepper_actions">
                        <Button disabled={activeStep === 0}
                          onClick={this.handleBackStep}
                          className={classes.button}
                        >
                          بازگشت
                        </Button>
                        <Button variant="contained"
                          color="primary"
                          onClick={this.handleNextStep}
                          className={classes.button}
                        >
                          { this.state.activeStep === 1 ? "ثبت" : "مرحله بعد" }
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                  
                  
                  <ToastMessage
                      variant={this.state.message.type}
                      message={this.state.message.text}
                      open={this.state.message.show}
                    />
                </div>
              </div>
            
          </div>
        </div>        
        <Footer />
      </MuiThemeProvider>
    );
  }
}

AddInvoicePage.propTypes = {
  classes: propTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    products: state.products,
    customers: state.customers,
    provinces: state.provinces
  };
};

const mapDispatchToProps = (dispatch) => ({
  startAddInvoice: (invoice) => dispatch(startAddInvoice(invoice)),
  startAddProduct: (product) => dispatch(startAddProduct(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(AddInvoicePage));

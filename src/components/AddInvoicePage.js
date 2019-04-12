import React, { Fragment } from 'react';
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
import axios from 'axios';
import propTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Stepper from '@material-ui/core/Stepper';;
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// @material-ui/icons
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// components
import Header from './Header';
import AddProductDialog from './AddProductDialog';
import ToastMessage from './ToastMessage';
import GridContainer from './Grid/GridContainer';
import GridItem from './Grid/GridItem';

// local dependencies
import appStyle from '../styles/jss/layouts/appStyle';
import { separateDigits } from '../helpers/numberHelpers';
import { generateKey } from '../helpers/keyHelper';

// actions
import { startAddInvoice } from '../actions/invoices';
import { startAddProduct } from '../actions/products';
import { startSearchCustomers } from '../actions/customers';
import { showGlobalMessage } from '../actions/message';


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
      no: '',
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
        provinceId: 0,
        cityId: 0
      },
      mailType: "registered",
      deliverAfter: "",
      deliverAfterTimeUnit: "",
      totalPrice: 0
    },
    message: {
      text: "",
      show: false,
      type: "warning"
    },
    single: '',
    popper: '',
    suggestions: [],
    showAddProductLoading: false
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

    history.pushState(null, null, location.href);
    window.onpopstate = (event) => {
      if (this.state.activeStep === 1) {
        history.pushState(null, null, location.href);
        this.handleBackStep();
      } else if (this.state.activeStep === 0) {
        history.go(-1);
      }
    };
  }
  componentWillMount() {
    console.log('AddInvoicePage componentWillMount');
  }
  componentWillUnmount() {
    window.onpopstate = () => {};
    console.log('AddInvoicePage componentWillUnmount');
  }  
  onOpenAddProductDialog = (e) => {
    this.setState(() => ({ isAddProductDialogOpen: true }));
  };
  closeAddProductDialog = ({ opStatus = {} } = {}) => {    
    this.setState(() => ({ isAddProductDialogOpen: false }));
    if (opStatus.status === true) {
      this.showMessage({
        type: "success",
        text: opStatus.message || "محصول اضافه شد."
      });
    }
  };
  onCustomerChange = (event) => {
    event.persist();
    const selectedCustomerId = event.target.value ;
    this.setState(() => ({ invoice: { ...this.state.invoice, customerId: selectedCustomerId } }));
  };
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
    }), ()=> {
      this.addNewProductToInvoice();
    });
  };
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
  };
  onAddedProductCountChange = (event) => {
    event.persist();
    const count = event.target.value;
    console.log(count);
    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      console.log('matched');
      const tempInvoiceProducts = this.state.invoice.products;
      for (let i = 0; i < this.state.invoice.products.length; i++) {
        if (this.state.invoice.products[i].id === event.target.id) {
          tempInvoiceProducts[i].count = count;
          tempInvoiceProducts[i].totalPrice = count * tempInvoiceProducts[i].unitPrice;
          this.setState(() => ({
            invoice: {
              ...this.state.invoice,
              products: tempInvoiceProducts
            }
          }))
        }
      }
    }
  };
  onAddNewProductToInvoice = (event) => {
    if (!this.state.invoice.newProduct._id || !this.state.invoice.newProduct.count) {
      this.showMessage({ type: "warning", text: "خطای اعتبارسنجی، نام محصول و تعداد اجباری است." });
      return;
    }
    this.addNewProductToInvoice();
  };
  addNewProductToInvoice = () => {
    const product = this.props.products.find(x => x._id == this.state.invoice.newProduct._id);
    
    const newInvoiceProduct = {
      id: generateKey(),
      productId: this.state.invoice.newProduct._id,
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
        totalPrice: this.state.invoice.totalPrice + newInvoiceProduct.totalPrice
      }
    }));
  };
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
  };
  handleNextStep = () => {
    // return this.props.history.push('/');;
    // return  setTimeout(() => {console.log('--------'); this.props.history.push('/');}, 2000);
    if (this.state.activeStep === 0) {
      if (!this.state.invoice.products.length && !this.state.invoice.customerId) {
        this.showMessage({ 
          type: "warning",
          text: "انتخاب مشتری و افزودن حداقل یک محصول اجباری است."
        });
        return;
      } else if (!this.state.invoice.products.length) {
        this.showMessage({ 
          type: "warning",
          text: "افزودن حداقل یک محصول اجباری است."
        });
        return;
      } else if (!this.state.invoice.customerId) {
        this.showMessage({ 
          type: "warning",
          text: "انتخاب مشتری اجباری است."
        });
        return;
      }
      
      this.setState(() => ({
        activeStep: this.state.activeStep + 1
      }));      
    } else if (this.state.activeStep === 1) {
      if (this.state.invoice.products.length 
        && this.state.invoice.customerId
        && this.state.invoice.address.provinceId
        && this.state.invoice.address.cityId
        && this.state.invoice.deliverAfter
        && this.state.invoice.deliverAfterTimeUnit
        ) {
          let { newProduct, ...invoice } = this.state.invoice;
          const invoiceData = {
            no: invoice.no,
            date: invoice.date,
            products: invoice.products,
            customerId: invoice.customerId,
            address: invoice.address,
            mailType: invoice.mailType,
            deliverAfter: invoice.deliverAfter,
            deliverAfterTimeUnit: invoice.deliverAfterTimeUnit,
            totalPrice: invoice.totalPrice
          };
          this.props.startAddInvoice(invoiceData)
          this.props.history.push('/');
            // .then(opStatus => {
            //   console.log(`opStatus`);
            //   console.log(opStatus);
            //   console.log(opStatus.status === true);
            //   if (opStatus.status === true) {
            //     this.props.history.push('/');
                
            //     // this.props.showGlobalMessage({
            //     //   type: "success",
            //     //   text: "فاکتور با موفقیت ثبت شد"
            //     // });
            //   } else {
            //     this.showMessage({ 
            //       type: "error",
            //       text: opStatus.message || "خطا در انجام عملیات"
            //     });
            //   }
            // })
            // .catch(err => {

            // });
          
        } else {
          this.showMessage({ 
            type: "warning",
            text: "اطلاعات فاکتور را جهت ثبت کامل نمایید."
          });
        }
    } else {
      console.log('Error, Unrecognized step in add new invoice form');
    }
  };
  handleBackStep = () => {
    if (this.state.activeStep === 1) {
      this.setState(() => ({
        activeStep: this.state.activeStep - 1
      }));
    }
  };
  onProvinceChange = (event) => {
    const provinceId = event.target.value;
    if (provinceId) {
      this.setState(() => ({
        invoice: {
          ...this.state.invoice,
          address: {
            provinceId: provinceId
          }
        }
      }));
    }
  };
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
  };
  onDeliverAfterTimeUnit = (event) => {
    const deliverAfterTimeUnit = event.target.value;
    this.setState(() => ({
      invoice: {
        ...this.state.invoice,
        deliverAfterTimeUnit
      }
    }));
  };
  handleSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value)
      .then(suggestions => {
        this.setState({
          suggestions
        });
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
        [name]: newValue,
        invoice: { 
          ...this.state.invoice,
          customerId: null
        }
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
  };
  getSuggestions = (value) => {
    const inputValue = value;
    const inputLength = inputValue.length;
    let count = 0;

    if (inputLength === 0)
      return [];
    else {
      return this.props.startSearchCustomers(inputValue)
        .then(opStatus => {
          return opStatus.payload;
        })
        .catch(err => console.error);
    }
  };
  getSuggestionValue = (suggestion) => {
    return suggestion.fullName;
  };
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
                    placeholder: 'نام و نام خانوادگی',
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
                
              <List>

                <ListItem className={ classes.addFactorProductsListItemHead } key={ generateKey() }>
                  <List className={ classes.addFactorProductsNestedList }>
                    <ListItem style={{width:'30%'}}
                       className={ classes.addFactorProductsNestedListItemHead }
                       key={ generateKey() }
                    >نام محصول</ListItem>
                    <ListItem style={{width:'20%'}}
                      className={ classes.addFactorProductsNestedListItemHead }
                      key={ generateKey() }
                      >تعداد</ListItem>
                    <ListItem style={{width:'20%'}}
                      className={ classes.addFactorProductsNestedListItemHead }
                      key={ generateKey() }>قیمت واحد</ListItem>
                    <ListItem style={{width:'20%'}}
                      className={ classes.addFactorProductsNestedListItemHead }
                      key={ generateKey() }>قیمت کل</ListItem>
                    <ListItem style={{width:'10%'}}
                      className={ classes.addFactorProductsNestedListItemHead }
                      key={ generateKey() }></ListItem>
                  </List>
                </ListItem>

                  
                
                  { 
                    this.state.invoice.products.map((product, index) => {
                      return (
                        <ListItem key={product.id}
                          className={ classes.addFactorProductsListItem }
                          key={ generateKey(index) }
                          >
                          <List className={ classes.addFactorProductsNestedList }>
                            <ListItem scope="product" style={{width:'30%'}}
                              className={ classes.addFactorProductsNestedListItem }
                              key={ generateKey(index) }
                            >
                              { product.name }
                            </ListItem>
                            <ListItem style={{width:'20%'}}
                              className={ classes.addFactorProductsNestedListItem }
                              key={ generateKey(index) }
                            >
                              <TextField
                                type="number"
                                value={ product.count }
                                id={product.id}
                                onChange={ this.onAddedProductCountChange }
                                className="text-center"
                              >
                              </TextField>
                            </ListItem>
                            <ListItem style={{width:'20%'}}
                              className={ classes.addFactorProductsNestedListItem }
                              key={ generateKey(index) }
                            >{ separateDigits({ number: product.unitPrice, showCurrency: true }) }</ListItem>
                            <ListItem 
                              style={{width:'20%'}}
                              className={ classes.addFactorProductsNestedListItem }
                              key={ generateKey(index) }
                            >{ separateDigits({ number: product.totalPrice }) }</ListItem>
                            <ListItem style={{width:'10%'}}
                              className={ classes.addFactorProductsNestedListItem }
                              key={ generateKey(index) }
                            >
                              <IconButton 
                                onClick={() => { 
                                  this.onRemoveProductFromInvoice(product._id);
                                }}
                              >
                                <Icon>remove_circle</Icon>
                              </IconButton>
                            </ListItem>
                          </List>
                        </ListItem>
                      );
                    })
                  }
                  
                  <ListItem className={ classes.addFactorProductsListItem } key={ generateKey() }>
                    <List className={ classes.addFactorProductsNestedList }>
                      <ListItem style={{width:'30%'}}
                        className={ classes.addFactorProductsNestedListItem }
                        key={ generateKey() }
                      >
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
                              return invoiceProduct.productId === product._id;
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
                      </ListItem>
                      <ListItem style={{width:'20%'}}
                        className={ classes.addFactorProductsNestedListItem }
                        key={ generateKey() }
                      >
                        <TextField
                          type="number"
                          value={this.state.invoice.newProduct.count}
                          onChange={this.onNewProductCountChange}
                          ref={(input) => { this.newProductCountInput = input; }} 
                          className="text-center"
                        >
                        </TextField>
                      </ListItem>
                      <ListItem style={{width:'20%'}}
                        className={ classes.addFactorProductsNestedListItem }
                        key={ generateKey() }
                      >
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.unitPrice, showCurrency: true }) }</Typography>
                      </ListItem>
                      <ListItem style={{width:'20%'}}
                        className={ classes.addFactorProductsNestedListItem }
                        key={ generateKey() }
                      >
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.totalPrice }) }</Typography>
                      </ListItem>
                      <ListItem style={{width:'10%'}}
                        className={ classes.addFactorProductsNestedListItem }
                        key={ generateKey() }
                      >
                        <IconButton 
                          onClick={this.onAddNewProductToInvoice}
                        >
                          <Icon>add_circle</Icon>
                        </IconButton>
                      </ListItem>
                    </List>
                  </ListItem>
              </List>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <AddProductDialog 
                show={this.state.isAddProductDialogOpen} 
                onClose={this.closeAddProductDialog}
              />
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
      <Fragment>
        
        <Header/>
        
        <div className={classes.mainContent}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12}>
                <Stepper activeStep={activeStep}>
                  { steps.map((label, index) => {
                    const props = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...props}>
                        <StepLabel 
                          {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>        
                { stepContent }
                <div className={classes.stepperActions}>
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
      
      </Fragment>
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
  startAddProduct: (product) => dispatch(startAddProduct(product)),
  startSearchCustomers: (customerName) => dispatch(startSearchCustomers(customerName)),
  showGlobalMessage: (message) => dispatch(showGlobalMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(AddInvoicePage));

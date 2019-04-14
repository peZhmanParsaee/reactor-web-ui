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
import { 
  invoiceFormClearState,
  invoiceFormSetAddProductDialogOpenState,
  invoiceFormSetCustomerId,
  invoiceFormSetSuggestions,
  invoiceFormSetSuggestion,
  invoiceFormSetInvoiceNo,
  invoiceFormAddNewProductToInvoice,
  invoiceFormSetNewProduct,
  invoiceFormRemoveProductFromInvoiceById,
  invoiceFormSetInvoiceProductCount,
  invoiceFormSetProvinceId,
  invoiceFormSetCityId,
  invoiceFormSetMailType,
  invoiceFormSetDeliverAfter,
  invoiceFormSetDeliverAfterTimeUnit,
  invoiceFormSetActiveStep
} 
from '../actions/addInvoiceForm';


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
  // state = {
  //   activeStep: 0,    
  //   isAddProductDialogOpen: false,
  //   invoice: {
  //     no: '',
  //     date: moment().format('jYYYY/jMM/jDD'),
  //     products: [],
  //     customerId: 0,
  //     newProduct: {
  //       _id: 0,
  //       count: 1,
  //       unitPrice: 0,
  //       totalPrice: 0
  //     },
  //     address: {
  //       provinceId: 0,
  //       cityId: 0
  //     },
  //     mailType: "registered",
  //     deliverAfter: "",
  //     deliverAfterTimeUnit: "",
  //     totalPrice: 0
  //   },
  //   message: {
  //     text: "",
  //     show: false,
  //     type: "warning"
  //   },
  //   single: '',
  //   popper: '',
  //   suggestions: [],
  //   showAddProductLoading: false
  // };
  
  async componentDidMount() {
    const res = await axios.get(`${API_ENDPOINT}/api/v1/invoice/new-invoice-no`);
    if (res.data.status === true) {
      this.props.invoiceFormSetInvoiceNo(res.data.payload);
      // this.setState(() => ({            
      //   invoice: {
      //     ...this.props.addInvoiceForm.invoice,
      //     no: res.data.payload
      //   }
      // }));
    }

    history.pushState(null, null, location.href);
    window.onpopstate = (event) => {
      if (this.props.addInvoiceForm.activeStep === 1) {
        history.pushState(null, null, location.href);
        this.handleBackStep();
      } else if (this.props.addInvoiceForm.activeStep === 0) {
        history.go(-1);
      }
    };
  }
  componentWillUnmount() {
    window.onpopstate = () => {};
  }  
  onOpenAddProductDialog = (e) => {
    // this.setState(() => ({ isAddProductDialogOpen: true }));
    this.props.invoiceFormSetAddProductDialogOpenState(true);
  };
  closeAddProductDialog = ({ opStatus = {} } = {}) => {    
    // this.setState(() => ({ isAddProductDialogOpen: false }));
    this.props.invoiceFormSetAddProductDialogOpenState(false);
    if (opStatus.status === true) {
      this.showMessage({
        type: "success",
        text: opStatus.message || "محصول اضافه شد."
      });
    }
  };
  onNewProductSelectChange = (event) => {
    event.persist();
    const _id = event.target.value;
    const product = this.props.products.find(x => x._id == _id);
    const newInvoiceProduct = {
      id: generateKey(),
      productId: event.target.value,
      count: 1,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * 1,
      name: product.name
    };
    this.props.invoiceFormAddNewProductToInvoice(newInvoiceProduct);

    // this.setState(() => ({ 
    //   invoice: { 
    //     ...this.props.addInvoiceForm.invoice,
    //     newProduct: { 
    //       _id: event.target.value,
    //       count: 1,
    //       unitPrice: product.unitPrice,
    //       totalPrice: product.unitPrice * 1
    //     }
    //   }
    // }), ()=> {
    //   this.addNewProductToInvoice();
    // });
  };
  onNewProductCountChange = (event) => {    
    event.persist();
    const count = event.target.value;
    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      this.setState(() => ({
        invoice: { ...this.props.addInvoiceForm.invoice, 
          newProduct:{ 
            ...this.props.addInvoiceForm.invoice.newProduct, 
            count: parseInt(event.target.value, 10),
            totalPrice: parseInt(event.target.value * this.props.addInvoiceForm.invoice.newProduct.unitPrice)
          }
        }}))
    }
  };
  onAddedProductCountChange = (event) => {
    event.persist();
    const count = event.target.value;
    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      // const tempInvoiceProducts = this.props.addInvoiceForm.invoice.products;
      // for (let i = 0; i < this.props.addInvoiceForm.invoice.products.length; i++) {
      //   if (this.props.addInvoiceForm.invoice.products[i].id === event.target.id) {
      //     tempInvoiceProducts[i].count = count;
      //     tempInvoiceProducts[i].totalPrice = count * tempInvoiceProducts[i].unitPrice;

      //     break;

      //     // this.setState(() => ({
      //     //   invoice: {
      //     //     ...this.props.addInvoiceForm.invoice,
      //     //     products: tempInvoiceProducts
      //     //   }
      //     // }))
      //   }
      // }

      this.props.invoiceFormSetInvoiceProductCount({
        invoiceProductId: event.target.id,
        count: count
      });

    }
  };
  onAddNewProductToInvoice = (event) => {
    if (!this.props.addInvoiceForm.invoice.newProduct._id || !this.props.addInvoiceForm.invoice.newProduct.count) {
      this.showMessage({ type: "warning", text: "خطای اعتبارسنجی، نام محصول و تعداد اجباری است." });      
      return;
    }
    this.addNewProductToInvoice();
  };
  addNewProductToInvoice = () => {
    const product = this.props.products.find(x => x._id == this.props.addInvoiceForm.invoice.newProduct._id);
    
    const newInvoiceProduct = {
      id: generateKey(),
      productId: this.props.addInvoiceForm.invoice.newProduct._id,
      count: this.props.addInvoiceForm.invoice.newProduct.count,
      unitPrice: this.props.addInvoiceForm.invoice.newProduct.unitPrice,
      totalPrice: this.props.addInvoiceForm.invoice.newProduct.totalPrice,
      name: product.name
    };

    this.props.invoiceFormAddNewProductToInvoice(newInvoiceProduct);

    // this.setState(() => ({
    //   invoice: {
    //     ...this.props.addInvoiceForm.invoice,
    //     products: [
    //       ...this.props.addInvoiceForm.invoice.products, 
    //       newInvoiceProduct
    //     ], 
    //     newProduct: {
    //       _id: 0,
    //       count: 1,
    //       unitPrice: 0,
    //       totalPrice: 0
    //     },
    //     totalPrice: this.props.addInvoiceForm.invoice.totalPrice + newInvoiceProduct.totalPrice
    //   }
    // }));
  };
  showMessage = ({ text, type }) => {
    this.props.showGlobalMessage({ type, text });
  };
  onRemoveProductFromInvoice = (_id) => {
    this.props.invoiceFormRemoveProductFromInvoiceById(_id);
    // this.setState({
    //   invoice: {
    //     ...this.props.addInvoiceForm.invoice,
    //     products: this.props.addInvoiceForm.invoice.products.filter(invoiceProduct => invoiceProduct.id != _id)
    //   }
    // });
  };
  handleNextStep = () => {
    // return this.props.history.push('/');;
    // return  setTimeout(() => {console.log('--------'); this.props.history.push('/');}, 2000);
    if (this.props.addInvoiceForm.activeStep === 0) {
      if (!this.props.addInvoiceForm.invoice.products.length && !this.props.addInvoiceForm.invoice.customerId) {
        this.showMessage({ 
          type: "warning",
          text: "انتخاب مشتری و افزودن حداقل یک محصول اجباری است."
        });
        return;
      } else if (!this.props.addInvoiceForm.invoice.products.length) {
        this.showMessage({ 
          type: "warning",
          text: "افزودن حداقل یک محصول اجباری است."
        });
        return;
      } else if (!this.props.addInvoiceForm.invoice.customerId) {
        this.showMessage({ 
          type: "warning",
          text: "انتخاب مشتری اجباری است."
        });
        return;
      }
      

      this.props.invoiceFormSetActiveStep(this.props.addInvoiceForm.activeStep + 1);
      // this.setState(() => ({
      //   activeStep: this.props.addInvoiceForm.activeStep + 1
      // }));
    } else if (this.props.addInvoiceForm.activeStep === 1) {
      if (this.props.addInvoiceForm.invoice.products.length 
        && this.props.addInvoiceForm.invoice.customerId
        && this.props.addInvoiceForm.invoice.address.provinceId
        && this.props.addInvoiceForm.invoice.address.cityId
        && this.props.addInvoiceForm.invoice.deliverAfter
        && this.props.addInvoiceForm.invoice.deliverAfterTimeUnit
      ) {
        let { newProduct, ...invoice } = this.props.addInvoiceForm.invoice;
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
        // this.props.history.push('/');
        // history.go('-1');
        this.props.invoiceFormClearState();
        this.showMessage({
          type: "success",
          text: "فاکتور با موفقیت ثبت شد"
        });

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
    } 
    
    else {
      console.log('Error, Unrecognized step in add new invoice form');
    }
  };
  handleBackStep = () => {
    if (this.props.addInvoiceForm.activeStep === 1) {
      this.props.invoiceFormSetActiveStep(this.props.addInvoiceForm.activeStep - 1);
      // this.setState(() => ({
      //   activeStep: this.props.addInvoiceForm.activeStep - 1
      // }));
    }
  };
  onProvinceChange = (event) => {
    const provinceId = event.target.value;
    if (provinceId) {
      this.props.invoiceFormSetProvinceId(provinceId);
      // this.setState(() => ({
      //   invoice: {
      //     ...this.props.addInvoiceForm.invoice,
      //     address: {
      //       provinceId: provinceId
      //     }
      //   }
      // }));
    }
  };
  onCityChange = (event) => {
    const cityId = event.target.value;
    this.props.invoiceFormSetCityId(cityId);
    // this.setState(() => ({
    //   invoice: {
    //     ...this.props.addInvoiceForm.invoice,
    //     address: {
    //       ...this.props.addInvoiceForm.invoice.address,
    //       cityId
    //     }
    //   }
    // }));
  };
  onMailTypeChange = (event) => {
    const mailType = event.target.value;
    this.props.invoiceFormSetMailType(mailType);
    // this.setState(() => ({
    //   invoice: {
    //     ...this.props.addInvoiceForm.invoice,
    //     mailType
    //   }
    // }));
  };
  onDeliverAfterChange = (event) => {
    const deliverAfter = event.target.value;
    if (deliverAfter.match(/^[1-9]{1}[0-9]{0,1}$/)) {
      this.props.invoiceFormSetDeliverAfter(deliverAfter);
      // this.setState(() => ({
      //   invoice: {
      //     ...this.props.addInvoiceForm.invoice,
      //     deliverAfter
      //   }
      // }));
    }
  };
  onDeliverAfterTimeUnit = (event) => {
    const deliverAfterTimeUnit = event.target.value;
    this.props.invoiceFormSetDeliverAfterTimeUnit(deliverAfterTimeUnit);

    // this.setState(() => ({
    //   invoice: {
    //     ...this.props.addInvoiceForm.invoice,
    //     deliverAfterTimeUnit
    //   }
    // }));
  };
  handleSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value)
      .then(suggestions => {
        this.props.invoiceFormSetSuggestions({ single: value, suggestions});
        // this.setState({
        //   suggestions
        // });
      });    
  };
  handleSuggestionsClearRequested = () => {
    this.props.invoiceFormSetSuggestions({ suggestions: []});
    // this.setState({
    //   suggestions: [],
    // });
  };
  handleChange = name => (event, { newValue }) => {
    const selectedCustomer = this.props.customers.find(x => x.fullName === newValue);
    
    if (selectedCustomer) {

      this.props.invoiceFormSetSuggestion({ 
        [name]: newValue, 
        customerId: selectedCustomer._id,
        single: newValue
      });

      // this.setState({
      //   [name]: newValue,
      //   invoice: { 
      //     ...this.props.addInvoiceForm.invoice,
      //     customerId: selectedCustomer._id
      //   }
      // });
    } else {
      this.props.invoiceFormSetSuggestion({ [name]: newValue, customerId: null, single: newValue });

      // this.setState({
      //   [name]: newValue,
      //   invoice: { 
      //     ...this.props.addInvoiceForm.invoice,
      //     customerId: null
      //   }
      // });
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
    // const { activeStep } = this.state;
    const { activeStep } = this.props.addInvoiceForm;

    let stepContent;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.props.addInvoiceForm.suggestions,
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
              <span>{ this.props.addInvoiceForm.invoice.no }</span>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} style={{marginBottom: '15px'}}>
              <Typography style={{fontWeight: 'bold'}}>
                تاریخ امروز
              </Typography>
              <span>{ this.props.addInvoiceForm.invoice.date }</span>
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
                    value: this.props.addInvoiceForm.single,
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
                  this.props.addInvoiceForm.invoice.products.map((product, index) => {
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
                                this.onRemoveProductFromInvoice(product.id);
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
                        value={this.props.addInvoiceForm.invoice.newProduct._id}
                        onChange={this.onNewProductSelectChange}
                        className={classes.selectBox}
                      >
                        {this.props.products.filter(product => {
                          const found = this.props.addInvoiceForm.invoice.products.find(invoiceProduct => {
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
                        value={this.props.addInvoiceForm.invoice.newProduct.count}
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
                      <Typography>{ separateDigits({ number: this.props.addInvoiceForm.invoice.newProduct.unitPrice, showCurrency: true }) }</Typography>
                    </ListItem>
                    <ListItem style={{width:'20%'}}
                      className={ classes.addFactorProductsNestedListItem }
                      key={ generateKey() }
                    >
                      <Typography>{ separateDigits({ number: this.props.addInvoiceForm.invoice.newProduct.totalPrice }) }</Typography>
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
                show={this.props.addInvoiceForm.isAddProductDialogOpen} 
                onCloseDialog={this.closeAddProductDialog}
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
                value={this.props.addInvoiceForm.invoice.address.provinceId}
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
                value={this.props.addInvoiceForm.invoice.address.cityId}
                onChange={this.onCityChange}
                className={classes.selectBox}
              >
                {this.props.provinces
                  .find(province => {
                    return province._id === this.props.addInvoiceForm.invoice.address.provinceId;
                  }) ?
                  this.props.provinces
                    .find(province => {
                      return province._id === this.props.addInvoiceForm.invoice.address.provinceId;
                    })
                    .cities
                    .map(cityInProvince => {
                      return (
                        <MenuItem key={cityInProvince._id} value={cityInProvince._id}>
                          { cityInProvince.name }
                        </MenuItem>
                      );
                    }): null
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
                  value={this.props.addInvoiceForm.invoice.mailType}
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
                    value={this.props.addInvoiceForm.invoice.deliverAfter}
                    onChange={this.onDeliverAfterChange}
                    style={{
                      display: "inline-block",
                      marginLeft: "10px"
                    }}
                  />

                  <Select
                    value={this.props.addInvoiceForm.invoice.deliverAfterTimeUnit}
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
                    { this.props.addInvoiceForm.activeStep === 1 ? "ثبت" : "مرحله بعد" }
                  </Button>
                </div>
              </GridItem>
            </GridContainer>
            
            
            <ToastMessage
              variant={this.props.addInvoiceForm.message.type}
              message={this.props.addInvoiceForm.message.text}
              open={this.props.addInvoiceForm.message.show}
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
    provinces: state.provinces,
    addInvoiceForm: state.addInvoiceForm
  };
};

const mapDispatchToProps = (dispatch) => ({
  startAddInvoice: (invoice) => dispatch(startAddInvoice(invoice)),
  startAddProduct: (product) => dispatch(startAddProduct(product)),
  startSearchCustomers: (customerName) => dispatch(startSearchCustomers(customerName)),
  showGlobalMessage: (message) => dispatch(showGlobalMessage(message)),
  
  invoiceFormSetInvoiceNo: (invoiceNo) => dispatch(invoiceFormSetInvoiceNo(invoiceNo)),
  invoiceFormSetAddProductDialogOpenState: (openState) => dispatch(invoiceFormSetAddProductDialogOpenState(openState)),
  invoiceFormSetCustomerId: (customerId) => dispatch(invoiceFormSetCustomerId(customerId)),
  invoiceFormSetSuggestions: ({ single, suggestions }) => dispatch(invoiceFormSetSuggestions({ single, suggestions })),
  invoiceFormSetSuggestion: ({ name, customerId, single }) => dispatch(invoiceFormSetSuggestion({ name, customerId, single })),
  invoiceFormAddNewProductToInvoice: (product) => dispatch(invoiceFormAddNewProductToInvoice(product)),
  invoiceFormSetNewProduct: ({ newProduct, newInvoiceProduct }) => dispatch(invoiceFormSetNewProduct({ newProduct, newInvoiceProduct })),
  invoiceFormRemoveProductFromInvoiceById: (invoiceProductId) => dispatch(invoiceFormRemoveProductFromInvoiceById(invoiceProductId)),
  invoiceFormSetInvoiceProductCount: ({ invoiceProductId, count }) => dispatch(invoiceFormSetInvoiceProductCount({ invoiceProductId, count })),
  invoiceFormSetProvinceId: (provinceId) => dispatch(invoiceFormSetProvinceId(provinceId)),
  invoiceFormSetCityId: (cityId) => dispatch(invoiceFormSetCityId(cityId)),  
  invoiceFormSetMailType: (mailType) => dispatch(invoiceFormSetMailType(mailType)),
  invoiceFormSetDeliverAfter: (deliverAfter) => dispatch(invoiceFormSetDeliverAfter(deliverAfter)),
  invoiceFormSetDeliverAfterTimeUnit: (deliverAfterTimeUnit) => dispatch(invoiceFormSetDeliverAfterTimeUnit(deliverAfterTimeUnit)),
  invoiceFormSetActiveStep: (activeStep) => dispatch(invoiceFormSetActiveStep(activeStep)),
  invoiceFormClearState: () => dispatch(invoiceFormClearState())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(AddInvoicePage));

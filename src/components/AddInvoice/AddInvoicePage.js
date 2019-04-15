import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';;
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// components
import Header from '../shared/Header';
import GridContainer from '../Grid/GridContainer';
import GridItem from '../Grid/GridItem';
import Step0 from '../AddInvoice/Step0';
import Step1 from '../AddInvoice/Step1';

// local dependencies
import appStyle from '../../styles/jss/layouts/appStyle';
import { generateKey } from '../../helpers/keyHelper';

// actions
import { startAddInvoice } from '../../actions/invoices';
import { startAddProduct } from '../../actions/products';
import { startSearchCustomers } from '../../actions/customers';
import { showGlobalMessage } from '../../actions/message';
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
from '../../actions/addInvoiceForm';


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
  
  async componentDidMount() {
    const res = await axios.get(`${API_ENDPOINT}/api/v1/invoice/new-invoice-no`);
    if (res.data.status === true) {
      this.props.invoiceFormSetInvoiceNo(res.data.payload);
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
    this.props.invoiceFormSetAddProductDialogOpenState(true);
  };
  closeAddProductDialog = ({ opStatus = {} } = {}) => {
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
  };
  showMessage = ({ text, type }) => {
    this.props.showGlobalMessage({ type, text });
  };
  onRemoveProductFromInvoice = (_id) => {
    this.props.invoiceFormRemoveProductFromInvoiceById(_id);
  };
  handleNextStep = () => {
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
        this.props.startAddInvoice(invoiceData);
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
    }
  };
  onProvinceChange = (event) => {
    const provinceId = event.target.value;
    if (provinceId) {
      this.props.invoiceFormSetProvinceId(provinceId);
    }
  };
  onCityChange = (event) => {
    const cityId = event.target.value;
    this.props.invoiceFormSetCityId(cityId);
  };
  onMailTypeChange = (event) => {
    const mailType = event.target.value;
    this.props.invoiceFormSetMailType(mailType);
  };
  onDeliverAfterChange = (event) => {
    const deliverAfter = event.target.value;
    if (deliverAfter.match(/^[1-9]{1}[0-9]{0,1}$/)) {
      this.props.invoiceFormSetDeliverAfter(deliverAfter);
    }
  };
  onDeliverAfterTimeUnitChange = (event) => {
    const deliverAfterTimeUnit = event.target.value;
    this.props.invoiceFormSetDeliverAfterTimeUnit(deliverAfterTimeUnit);
  };
  handleSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value)
      .then(suggestions => {
        this.props.invoiceFormSetSuggestions({ single: value, suggestions});
      });    
  };
  handleSuggestionsClearRequested = () => {
    this.props.invoiceFormSetSuggestions({ suggestions: []});
  };
  handleChange = name => (event, { newValue }) => {
    const selectedCustomer = this.props.customers.find(x => x.fullName === newValue);
    
    if (selectedCustomer) {
      this.props.invoiceFormSetSuggestion({ 
        [name]: newValue, 
        customerId: selectedCustomer._id,
        single: newValue
      });
    } else {
      this.props.invoiceFormSetSuggestion({ [name]: newValue, customerId: null, single: newValue });
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
      stepContent = <Step0 
        invoiceNo={this.props.addInvoiceForm.invoice.no} 
        invoiceDate={this.props.addInvoiceForm.invoice.date} 
        invoiceProducts={this.props.addInvoiceForm.invoice.products}
        handleAutoSuggestChage={this.handleChange}
        autosuggestProps={autosuggestProps}
        single={this.props.addInvoiceForm.single}
        newProductId={this.props.addInvoiceForm.invoice.newProduct._id}
        newProductCount={this.props.addInvoiceForm.invoice.newProduct.count}
        newProductUnitPrice={this.props.addInvoiceForm.invoice.newProduct.unitPrice}
        newProductTotalPrice={this.props.addInvoiceForm.invoice.newProduct.totalPrice}
        onNewProductSelectChange={this.onNewProductSelectChange}
        onRemoveProductFromInvoice={this.onRemoveProductFromInvoice}
        products={this.props.products}
        isAddProductDialogOpen={this.props.addInvoiceForm.isAddProductDialogOpen}
        onCloseAddProductDialog={this.closeAddProductDialog}
        onNewProductCountChange={this.onNewProductCountChange}
        onAddedProductCountChange={this.onAddedProductCountChange}
        onOpenAddProductDialog={this.onOpenAddProductDialog}
      />
    } else if (activeStep == 1) {
      stepContent = <Step1 
        provinceId={this.props.addInvoiceForm.invoice.address.provinceId}
        cityId={this.props.addInvoiceForm.invoice.address.cityId}
        onProvinceChange={this.onProvinceChange}
        onCityChange={this.onCityChange}
        provinces={this.props.provinces}
        mailType={this.props.addInvoiceForm.invoice.mailType}
        onMailTypeChange={this.onMailTypeChange}
        deliverAfter={this.props.addInvoiceForm.invoice.deliverAfter}
        onDeliverAfterChange={this.onDeliverAfterChange}
        deliverAfterTimeUnit={this.props.addInvoiceForm.invoice.deliverAfterTimeUnit}
        onDeliverAfterTimeUnitChange={this.onDeliverAfterTimeUnitChange}
      />
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
            
          </div>
        </div>
      
      </Fragment>
    );
  }
}

AddInvoicePage.propTypes = {
  classes: PropTypes.object.isRequired,

  // reducers
  products: PropTypes.object.isRequired,
  customers: PropTypes.object.isRequired,
  provinces: PropTypes.object.isRequired,
  addInvoiceForm: PropTypes.object.isRequired,

  // dispatch funcs
  startAddInvoice: PropTypes.func.isRequired,
  startAddProduct: PropTypes.func.isRequired,
  startSearchCustomers: PropTypes.func.isRequired,
  showGlobalMessage: PropTypes.func.isRequired,
  invoiceFormSetInvoiceNo: PropTypes.func.isRequired,
  invoiceFormSetAddProductDialogOpenState: PropTypes.func.isRequired,
  invoiceFormSetCustomerId: PropTypes.func.isRequired,
  invoiceFormSetSuggestions: PropTypes.func.isRequired,
  invoiceFormSetSuggestion: PropTypes.func.isRequired,
  invoiceFormAddNewProductToInvoice: PropTypes.func.isRequired,
  invoiceFormSetNewProduct: PropTypes.func.isRequired,
  invoiceFormRemoveProductFromInvoiceById: PropTypes.func.isRequired,
  invoiceFormSetInvoiceProductCount: PropTypes.func.isRequired,
  invoiceFormSetProvinceId: PropTypes.func.isRequired,
  invoiceFormSetCityId: PropTypes.func.isRequired,
  invoiceFormSetMailType: PropTypes.func.isRequired,
  invoiceFormSetDeliverAfter: PropTypes.func.isRequired,
  invoiceFormSetDeliverAfterTimeUnit: PropTypes.func.isRequired,
  invoiceFormSetActiveStep: PropTypes.func.isRequired,
  invoiceFormClearState: PropTypes.func.isRequired
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

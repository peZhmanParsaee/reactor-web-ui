import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MenuItem from '@material-ui/core/MenuItem';

// local components
import Header from '../../../components/Header';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Step0 from './Step0';
import Step1 from './Step1';
import AutoSuggestInput from './AutoSuggestInput';

// local dependencies
import appStyle from '../../../styles/jss/layouts/appStyle';
import { generateKey } from '../../../helpers/keyHelper';
import AddInvoiceContext from './AddInvoiceContext';

// action creators
import * as invoicesActions from '../../../redux/actions/invoices';
import * as addInvoiceActions from '../../../redux/actions/addInvoiceForm';
import * as productsActions from '../../../redux/actions/products';
import * as customersActions from '../../../redux/actions/customers';
import * as messageActions from '../../../redux/actions/message';

function getSteps() {
  return ['تکمیل اطلاعات اولیه', 'تاریخ تحویل'];
}

class AddInvoicePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      no: null,
      date: null,
      products: [],
      customerId: 0,
      address: null,
      totalPrice: null,

      cityId: 0,
      provinceId: 0,
      mailType: null,
      deliverAfter: null,
      deliverAfterTimeUnit: null
    };
  }

  async componentDidMount() {
    this.props.actions.setInvoiceNo();

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
    this.props.actions.invoiceFormSetAddProductDialogOpenState(true);
  };

  closeAddProductDialog = () => {
    this.props.actions.invoiceFormSetAddProductDialogOpenState(false);
  };

  onSaveAddProductDialog = (product) => {
    return this.props.actions.startAddProduct(product);
  };

  onNewProductSelectChange = (event) => {
    event.persist();
    const _id = event.target.value;
    const product = this.props.products.find((x) => x._id == _id);
    const newInvoiceProduct = {
      id: generateKey(),
      productId: event.target.value,
      count: 1,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * 1,
      name: product.name
    };
    this.props.actions.invoiceFormAddNewProductToInvoice(newInvoiceProduct);
  };

  onNewProductCountChange = (event) => {
    event.persist();
    const count = event.target.value;
    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      this.setState(() => ({
        invoice: {
          ...this.props.addInvoiceForm.invoice,
          newProduct: {
            ...this.props.addInvoiceForm.invoice.newProduct,
            count: parseInt(event.target.value, 10),
            totalPrice: parseInt(
              event.target.value *
                this.props.addInvoiceForm.invoice.newProduct.unitPrice
            )
          }
        }
      }));
    }
  };

  onAddedProductCountChange = (event) => {
    event.persist();
    const count = event.target.value;

    if (count.match(/^[1-9]{1}[0-9]{0,2}$/)) {
      this.props.actions.invoiceFormSetInvoiceProductCount({
        invoiceProductId: event.target.id,
        count: count
      });
    }
  };

  onAddNewProductToInvoice = (event) => {
    if (
      !this.props.addInvoiceForm.invoice.newProduct._id ||
      !this.props.addInvoiceForm.invoice.newProduct.count
    ) {
      this.showMessage({
        type: 'warning',
        text: 'خطای اعتبارسنجی، نام محصول و تعداد اجباری است.'
      });
      return;
    }
    this.addNewProductToInvoice();
  };

  addNewProductToInvoice = () => {
    const product = this.props.products.find(
      (x) => x._id == this.props.addInvoiceForm.invoice.newProduct._id
    );

    const newInvoiceProduct = {
      id: generateKey(),
      productId: this.props.addInvoiceForm.invoice.newProduct._id,
      count: this.props.addInvoiceForm.invoice.newProduct.count,
      unitPrice: this.props.addInvoiceForm.invoice.newProduct.unitPrice,
      totalPrice: this.props.addInvoiceForm.invoice.newProduct.totalPrice,
      name: product.name
    };

    this.props.actions.invoiceFormAddNewProductToInvoice(newInvoiceProduct);
  };

  showMessage = ({ text, type }) => {
    this.props.actions.showGlobalMessage({ type, text });
  };

  onRemoveProductFromInvoice = (_id) => {
    this.props.actions.invoiceFormRemoveProductFromInvoiceById(_id);
  };

  handleNextStep = () => {
    if (this.props.addInvoiceForm.activeStep === 0) {
      if (
        !this.props.addInvoiceForm.invoice.products.length &&
        !this.props.addInvoiceForm.invoice.customerId
      ) {
        this.showMessage({
          type: 'warning',
          text: 'انتخاب مشتری و افزودن حداقل یک محصول اجباری است.'
        });
        return;
      } else if (!this.props.addInvoiceForm.invoice.products.length) {
        this.showMessage({
          type: 'warning',
          text: 'افزودن حداقل یک محصول اجباری است.'
        });
        return;
      } else if (!this.props.addInvoiceForm.invoice.customerId) {
        this.showMessage({
          type: 'warning',
          text: 'انتخاب مشتری اجباری است.'
        });
        return;
      }

      this.props.actions.invoiceFormSetActiveStep(
        this.props.addInvoiceForm.activeStep + 1
      );
    } else if (this.props.addInvoiceForm.activeStep === 1) {
      if (
        this.props.addInvoiceForm.invoice.products.length &&
        this.props.addInvoiceForm.invoice.customerId &&
        this.props.addInvoiceForm.invoice.address.provinceId &&
        this.props.addInvoiceForm.invoice.address.cityId &&
        this.props.addInvoiceForm.invoice.deliverAfter &&
        this.props.addInvoiceForm.invoice.deliverAfterTimeUnit
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
        this.props.actions.startAddInvoice(invoiceData);
        this.props.actions.invoiceFormClearState();
        this.showMessage({
          type: 'success',
          text: 'فاکتور با موفقیت ثبت شد'
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
          type: 'warning',
          text: 'اطلاعات فاکتور را جهت ثبت کامل نمایید.'
        });
      }
    } else {
      console.log('Error, Unrecognized step in add new invoice form');
    }
  };

  handleBackStep = () => {
    if (this.props.addInvoiceForm.activeStep === 1) {
      this.props.actions.invoiceFormSetActiveStep(
        this.props.addInvoiceForm.activeStep - 1
      );
    }
  };

  onProvinceChange = (event) => {
    const provinceId = event.target.value;
    if (provinceId) {
      this.props.actions.invoiceFormSetProvinceId(provinceId);
    }
  };

  onCityChange = (event) => {
    const cityId = event.target.value;
    // this.props.actions.invoiceFormSetCityId(cityId);
    this.setState((_) => {
      cityId;
    });
  };

  onMailTypeChange = (event) => {
    const mailType = event.target.value;
    // this.props.actions.invoiceFormSetMailType(mailType);
    this.setState((_) => {
      mailType;
    });
  };

  onDeliverAfterChange = (event) => {
    const deliverAfter = event.target.value;
    if (deliverAfter.match(/^[1-9]{1}[0-9]{0,1}$/)) {
      // this.props.actions.invoiceFormSetDeliverAfter(deliverAfter);
      this.setState((_) => {
        deliverAfter;
      });
    }
  };

  onDeliverAfterTimeUnitChange = (event) => {
    const deliverAfterTimeUnit = event.target.value;
    // this.props.actions.invoiceFormSetDeliverAfterTimeUnit(deliverAfterTimeUnit);
    this.setState((_) => {
      deliverAfterTimeUnit;
    });
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value).then((suggestions) => {
      this.props.actions.invoiceFormSetSuggestions({
        single: value,
        suggestions
      });
    });
  };

  handleSuggestionsClearRequested = () => {
    this.props.actions.invoiceFormSetSuggestions({ suggestions: [] });
  };

  handleChange = (name) => (event, { newValue }) => {
    const selectedCustomer = this.props.customers.find(
      (x) => x.fullName === newValue
    );

    if (selectedCustomer) {
      this.props.actions.invoiceFormSetSuggestion({
        [name]: newValue,
        customerId: selectedCustomer._id,
        single: newValue
      });
    } else {
      this.props.actions.invoiceFormSetSuggestion({
        [name]: newValue,
        customerId: null,
        single: newValue
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
            )
          )}
        </div>
      </MenuItem>
    );
  };

  getSuggestions = (value) => {
    const inputValue = value;
    const inputLength = inputValue.length;

    if (inputLength === 0) return [];
    else {
      return this.props.actions
        .startSearchCustomers(inputValue)
        .then((opStatus) => {
          return opStatus.payload;
        })
        .catch((err) => console.error);
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
      renderInputComponent: AutoSuggestInput,
      suggestions: this.props.addInvoiceForm.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion: this.renderSuggestion
    };

    if (activeStep === 0) {
      stepContent = (
        <Step0
          autosuggestProps={autosuggestProps}
          isAddProductDialogOpen={
            this.props.addInvoiceForm.isAddProductDialogOpen
          }
          invoiceNo={this.props.addInvoiceForm.invoice.no}
          invoiceDate={this.state.date}
          invoiceProducts={this.props.addInvoiceForm.invoice.products}
          single={this.props.addInvoiceForm.single}
          newProductId={this.props.addInvoiceForm.invoice.newProduct._id}
          newProductCount={this.props.addInvoiceForm.invoice.newProduct.count}
          newProductUnitPrice={
            this.props.addInvoiceForm.invoice.newProduct.unitPrice
          }
          newProductTotalPrice={
            this.props.addInvoiceForm.invoice.newProduct.totalPrice
          }
          products={this.props.products}
          handleAutoSuggestChage={this.handleChange}
          onCloseAddProductDialog={this.closeAddProductDialog}
          onSaveAddProductDialog={this.onSaveAddProductDialog}
          onNewProductCountChange={this.onNewProductCountChange}
          onAddedProductCountChange={this.onAddedProductCountChange}
          onOpenAddProductDialog={this.onOpenAddProductDialog}
          onNewProductSelectChange={this.onNewProductSelectChange}
          onRemoveProductFromInvoice={this.onRemoveProductFromInvoice}
          showGlobalMessage={this.props.actions.showGlobalMessage}
        />
      );
    } else if (activeStep == 1) {
      stepContent = (
        <Step1
          provinces={this.props.provinces}
          provinceId={this.state.provinceId}
          cityId={this.state.cityId}
          mailType={this.state.mailType}
          deliverAfter={this.state.deliverAfter}
          deliverAfterTimeUnit={this.state.deliverAfterTimeUnit}
          onProvinceChange={this.onProvinceChange}
          onCityChange={this.onCityChange}
          onDeliverAfterTimeUnitChange={this.onDeliverAfterTimeUnitChange}
          onMailTypeChange={this.onMailTypeChange}
          onDeliverAfterChange={this.onDeliverAfterChange}
        />
      );
    }

    return (
      <AddInvoiceContext.Provider
        value={{
          onRemoveProductFromInvoice: this.onRemoveProductFromInvoice
        }}
      >
        <Fragment>
          <Header />

          <div className={classes.mainContent}>
            <div className={classes.container}>
              <GridContainer>
                <GridItem xs={12}>
                  <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label, index) => {
                      const props = {};
                      const labelProps = {};
                      return (
                        <Step key={label} {...props}>
                          <StepLabel
                            {...labelProps}
                            classes={{
                              iconContainer: classes.iconContainer
                            }}
                            className={classes.StepLabel}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {stepContent}
                  <div className={classes.stepperActions}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBackStep}
                      className={classes.button}
                    >
                      بازگشت
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNextStep}
                      className={classes.button}
                    >
                      {this.props.addInvoiceForm.activeStep === 1
                        ? 'ثبت'
                        : 'مرحله بعد'}
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </Fragment>
      </AddInvoiceContext.Provider>
    );
  }
}

AddInvoicePage.propTypes = {
  classes: PropTypes.object.isRequired,

  // reducers
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  provinces: PropTypes.array.isRequired,
  addInvoiceForm: PropTypes.object.isRequired,

  // dispatch funcs
  actions: PropTypes.object.isRequired
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
  actions: {
    startAddInvoice: (invoice) =>
      dispatch(invoicesActions.startAddInvoice(invoice)),
    setInvoiceNo: () => dispatch(invoicesActions.setInvoiceNo()),

    startAddProduct: (product) =>
      dispatch(productsActions.startAddProduct(product)),

    startSearchCustomers: (customerName) =>
      dispatch(customersActions.startSearchCustomers(customerName)),

    showGlobalMessage: (message) =>
      dispatch(messageActions.showGlobalMessage(message)),

    invoiceFormSetAddProductDialogOpenState: (openState) =>
      dispatch(
        addInvoiceActions.invoiceFormSetAddProductDialogOpenState(openState)
      ),
    invoiceFormSetSuggestions: ({ single, suggestions }) =>
      dispatch(
        addInvoiceActions.invoiceFormSetSuggestions({ single, suggestions })
      ),
    invoiceFormSetSuggestion: ({ name, customerId, single }) =>
      dispatch(
        addInvoiceActions.invoiceFormSetSuggestion({ name, customerId, single })
      ),
    invoiceFormAddNewProductToInvoice: (product) =>
      dispatch(addInvoiceActions.invoiceFormAddNewProductToInvoice(product)),
    invoiceFormRemoveProductFromInvoiceById: (invoiceProductId) =>
      dispatch(
        addInvoiceActions.invoiceFormRemoveProductFromInvoiceById(
          invoiceProductId
        )
      ),
    invoiceFormSetInvoiceProductCount: ({ invoiceProductId, count }) =>
      dispatch(
        addInvoiceActions.invoiceFormSetInvoiceProductCount({
          invoiceProductId,
          count
        })
      ),
    invoiceFormSetProvinceId: (provinceId) =>
      dispatch(addInvoiceActions.invoiceFormSetProvinceId(provinceId)),
    invoiceFormSetCityId: (cityId) =>
      dispatch(addInvoiceActions.invoiceFormSetCityId(cityId)),
    invoiceFormSetMailType: (mailType) =>
      dispatch(addInvoiceActions.invoiceFormSetMailType(mailType)),
    invoiceFormSetDeliverAfter: (deliverAfter) =>
      dispatch(addInvoiceActions.invoiceFormSetDeliverAfter(deliverAfter)),
    invoiceFormSetDeliverAfterTimeUnit: (deliverAfterTimeUnit) =>
      dispatch(
        addInvoiceActions.invoiceFormSetDeliverAfterTimeUnit(
          deliverAfterTimeUnit
        )
      ),
    invoiceFormSetActiveStep: (activeStep) =>
      dispatch(addInvoiceActions.invoiceFormSetActiveStep(activeStep)),
    invoiceFormClearState: () =>
      dispatch(addInvoiceActions.invoiceFormClearState())
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(appStyle)(AddInvoicePage));

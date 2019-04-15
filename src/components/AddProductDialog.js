import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import persianRex from 'persian-rex';

// @material-ui/core
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// local dependencies
import { startAddProduct } from '../actions/products';
import appStyle from '../styles/jss/layouts/appStyle';
import { showGlobalMessage } from '../actions/message';

// actions
import {
  addProductDialogSetFormFields,
  addProductDialogClearState,
  addProductDialogSetLoadingStatus
} from '../actions/addProductDialog';



class AddProductDialog extends PureComponent {  
  clearState() {
    this.props.addProductDialogClearState();
  };
  showMessage = ({ text, type }) => {
    this.props.showGlobalMessage({ type, text });
  };
  onAddProduct = () => {
    if (!this.props.addProductDialog.name || !this.props.addProductDialog.stock || !this.props.addProductDialog.unitPrice) {
      this.showMessage({ 
        type: "warning",
        text: "خطای اعتبارسنجی، ورودیها را بررسی کنید."
      });
      return;
    }

    this.onShowAddProductLoading()
      .then(ack => {
        this.props.startAddProduct(this.props.addProductDialog)
          .then(opStatus => {
            if (opStatus.status === true) {
              this.props.addProductDialogClearState();
              this.props.onCloseDialog({ opStatus });
            } else {
              this.showMessage({ 
                type: "error",
                text: opStatus.message || "خطا در انجام عملیات"
              });
            }
          })
          .catch(err => {
            this.showMessage({ 
              type: "error",
              text: "خطا در انجام عملیات!"
            });
          })
          .finally(() =>{
            this.onHideAddProductLoading();
          });;
      });
    
  };
  onShowAddProductLoading = () => {
    return new Promise((resolve, reject) => {
      this.props.addProductDialogSetLoadingStatus(true);
      resolve('done');
    });
  };
  onHideAddProductLoading = () => {
    this.props.addProductDialogSetLoadingStatus(false);
  };
  onCloseDialog = () => {
    this.props.addProductDialogClearState();
    this.props.onCloseDialog();    
  };
  onNameChage = (event) => {
    event.persist();
    const name = event.target.value;
    if (
      (persianRex.letter.test(name) 
      || persianRex.text.test(name)             
      || !name) && name.length <= 50
    ) {
      this.props.addProductDialogSetFormFields({ name });
    }
  };
  onStockChange = (event) => {
    event.persist();
    const stock = event.target.value;
    if (stock.match(/^[1-9]{1}[0-9]{0,6}$/)) {
      this.props.addProductDialogSetFormFields({ stock });
    }
  };
  onUnitPriceChange = (event) => {
    event.persist();
    const unitPrice = event.target.value;
    if (unitPrice.match(/^[1-9]{1}[0-9]{0,5}$/)) {
      this.props.addProductDialogSetFormFields({ unitPrice });
    }
  };
  moveNextElementInForm = (event) => {
    event.persist();
    if (event.keyCode == 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Dialog 
          open={this.props.show}
          onClose={this.onCloseDialog}
        >
          <DialogTitle>اضافه کردن محصول جدید</DialogTitle>
          <DialogContent>
            <form>
              <FormControl fullWidth 
                className={classes.textField}>
                <InputLabel htmlFor="name"
                  className="form-control__input-label"
                >نام محصول</InputLabel>
                <Input id="name"
                  onChange={this.onNameChage}
                  value={this.props.addProductDialog.name}
                  autoComplete='off'
                  onKeyDown={ this.moveNextElementInForm }
                  ref={this.focusInput}
                />
              </FormControl>
              <FormControl fullWidth
                className={classNames(classes.withoutLabel, classes.textField)} >
                <InputLabel 
                  htmlFor="stock"
                  className="form-control__input-label"
                >موجودی</InputLabel>
                <Input id="stock"
                  value={this.props.addProductDialog.stock}
                  onChange={this.onStockChange}
                  type="text"
                  endAdornment={<InputAdornment position="start">عدد</InputAdornment>}
                  autoComplete='off'
                  onKeyDown={ this.moveNextElementInForm }
                />
              </FormControl>
              <FormControl fullWidth
                className={classNames(classes.withoutLabel, classes.textField)}
              >
                <InputLabel htmlFor="unit-price"            
                  className="form-control__input-label"
                >قیمت واحد</InputLabel>
                <Input id="unit-price"
                  value={this.props.addProductDialog.unitPrice}
                  onChange={this.onUnitPriceChange}
                  type="text"
                  endAdornment={<InputAdornment position="start">تومان</InputAdornment>}
                  autoComplete='off'
                  onKeyDown={(event) => {
                    if (event.keyCode == 13) {
                      this.onAddProduct();
                    }
                  }}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            { this.props.addProductDialog.showAddProductLoading && (
                <CircularProgress
                  size={24}
                  thickness={4}
                />
              )
            }
            
            <Button onClick={this.onAddProduct}
              disabled={this.props.addProductDialog.showAddProductLoading }
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
      </Fragment>
    );
  }
}

AddProductDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  addProductDialog: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
};

const mapStatetoProps = (state) => {
  return {
    addProductDialog: state.addProductDialog,
    message: state.message
  }
};

const mapDispatchToProps = (dispatch) => ({
  startAddProduct: (product) => dispatch(startAddProduct(product)),
  addProductDialogSetFormFields: (formFields) => dispatch(addProductDialogSetFormFields(formFields)),
  addProductDialogClearState: () => dispatch(addProductDialogClearState()),
  addProductDialogSetLoadingStatus: (loadingStatus) => dispatch(addProductDialogSetLoadingStatus(loadingStatus)),
  showGlobalMessage: (message) => dispatch(showGlobalMessage(message))
});

export default connect(mapStatetoProps, mapDispatchToProps)(withStyles(appStyle)(AddProductDialog));

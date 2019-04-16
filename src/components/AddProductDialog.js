import React, { PureComponent, Fragment } from 'react';
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
import appStyle from '../styles/jss/layouts/appStyle';
import RESOURCES from '../resources';


class AddProductDialog extends PureComponent {  
  state = {
    name: '',
    stock: '',
    unitPrice: '',
    loadingStatus: false
  };

  clearState() {
    this.setState(() => ({
      name: '',
      stock: '',
      unitPrice: '',
      loadingStatus: false
    }));
  };
  showMessage = ({ text, type }) => {
    this.props.showGlobalMessage({ type, text });
  };
  onAddProduct = () => {
    if (!this.state.name || !this.state.stock || !this.state.unitPrice) {
      this.showMessage({ 
        type: "warning",
        text: "خطای اعتبارسنجی، ورودیها را بررسی کنید."
      });
      return;
    }

    this.onShowAddProductLoading()
      .then(ack => {
        const product = { 
          name: this.state.name,
          stock: this.state.stock, 
          unitPrice: this.state.unitPrice
        };

        this.props.onSaveAddProductDialog(product)
          .then(opStatus => {
            if (opStatus.status === true) {
              this.clearState();
              this.onCloseDialog();
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
          });
      });
    
  };
  onShowAddProductLoading = () => {    
    return new Promise((resolve, reject) => {
      this.setState({ loadingStatus: true }, () => resolve('done'));
    });
  };
  onHideAddProductLoading = () => {
    this.setState({ loadingStatus: false });
  };
  onCloseDialog = () => {
    this.setState(() =>({
      name: '',
      stock: '',
      unitPrice: '',
      loadingStatus: false
    }));
    this.props.onCloseDialog();
  };
  onNameChage = (event) => {
    const name = event.target.value;
    if (
      (persianRex.letter.test(name) 
      || persianRex.text.test(name)             
      || !name) && name.length <= 50
    ) {
      this.setState(() => ({ name }));
    }
  };
  onStockChange = (event) => {
    const stock = event.target.value;
    if (stock.match(/^[1-9]{1}[0-9]{0,6}$/) || !stock) {
      this.setState(() => ({ stock }));
    }
  };
  onUnitPriceChange = (event) => {
    const unitPrice = event.target.value;
    if (unitPrice.match(/^[1-9]{1}[0-9]{0,5}$/) || !unitPrice) {
      this.setState(() => ({ unitPrice }));
    }
  };
  moveNextElementInForm = (event) => {
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
                >
                  { RESOURCES.FIELDS.ADD_PRODUCT__PRODUCT_NAME }
                </InputLabel>
                <Input id="name"
                  onChange={this.onNameChage}
                  value={this.state.name}
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
                  value={this.state.stock}
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
                  value={this.state.unitPrice}
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
            { this.state.loadingStatus && (
                <CircularProgress
                  size={24}
                  thickness={4}
                />
              )
            }
            
            <Button onClick={this.onAddProduct}
              disabled={this.state.loadingStatus }
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
  onCloseDialog: PropTypes.func.isRequired
};

export default withStyles(appStyle)(AddProductDialog);

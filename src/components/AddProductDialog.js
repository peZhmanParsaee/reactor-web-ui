import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
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
import ToastMessage from './ToastMessage';
import appStyle from '../styles/jss/layouts/appStyle';


class AddProductDialog extends React.PureComponent {  
  state = {
    name: '',
    stock: '',
    unitPrice: '',
    message: "خطای اعتبارسنجی، ورودیها را بررسی کنید.",
    showMessage: false,
    messageType: "warning",
    showAddProductLoading: false
  };
  clearState() {
    this.setState(() => ({ 
      name: '',
      stock: '',
      unitPrice: '',
      message: "خطای اعتبارسنجی، ورودیها را بررسی کنید.",
      showMessage: false,
      messageType: "warning"
    }));
  };
  showMessage = ({ text, type }) => {
    this.setState(() => ({      
      messageType: type,
      showMessage: true,
      message: text
    }));
    
    setTimeout(function() {
      this.setState(() => ({
        messageType: type,
        showMessage: false,
        message: text
      }));
    }.bind(this), 2000);
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
        this.props.startAddProduct(this.state)
          .then(opStatus => {
            if (opStatus.status === true) {
              this.clearState();
              this.props.onClose({ opStatus });
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
      this.setState(() => ({ showAddProductLoading: true }), () => {
        resolve('done')
      });
    });
  };
  onHideAddProductLoading = () => {
    this.setState(() => ({ showAddProductLoading: false }));
  };
  onCloseDialog = () => {
    this.clearState();
    this.props.onClose();    
  };
  onNameChage = (event) => {
    event.persist();
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
    event.persist();
    const stock = event.target.value;
    if (stock.match(/^[1-9]{1}[0-9]{0,6}$/)) {
      this.setState(() => ({ stock }));  
    }
  };
  onUnitPriceChange = (event) => {
    event.persist();
    const unitPrice = event.target.value;
    if (unitPrice.match(/^[1-9]{1}[0-9]{0,5}$/)) {
      this.setState(() => ({ unitPrice }));
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
      <React.Fragment>
        
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
            { this.state.showAddProductLoading && (
              <CircularProgress
                size={24}
                thickness={4}
              />
            )
            }
            
            <Button onClick={this.onAddProduct}
              disabled={this.state.showAddProductLoading }
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
        
        <ToastMessage
          variant={this.state.messageType}
          message={this.state.message}
          open={this.state.showMessage}
        />
      </React.Fragment>

    );
  }
}

AddProductDialog.propTypes = {
  classes: propTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  startAddProduct: (product) => dispatch(startAddProduct(product))
});

export default connect(undefined, mapDispatchToProps)(withStyles(appStyle)(AddProductDialog));

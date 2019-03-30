import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { startAddProduct } from '../actions/products';
import { withStyles } from '@material-ui/core/styles';
import ToastMessage from './ToastMessage';


class AddProductDialog extends React.Component {  
  state = {
    name: '',
    stock: 0,
    unitPrice: 0,
    message: "خطای اعتبارسنجی، ورودیها را بررسی کنید.",
    showMessage: false,
    messageType: "warning"
  };
  clearState() {
    this.setState(() => ({ 
      name: '',
      stock: 0,
      unitPrice: 0,
      message: "خطای اعتبارسنجی، ورودیها را بررسی کنید.",
      showMessage: false,
      messageType: "warning"
    }));
  }
  onAddProduct = () => {
    if (!this.state.name || !this.state.stock || !this.state.unitPrice) {
      this.setState(() => ({ 
        showMessage: true, 
        messageType: "warning",
        message: "خطای اعتبارسنجی، ورودیها را بررسی کنید."
      }));
      return;
    }
    
    this.props.startAddProduct(this.state);
    this.clearState();
    this.props.onClose();
  }
  onCloseDialog = () => {
    this.clearState();
    this.props.onClose();
  }
  onNameChage = (event) => {
    event.persist();
    const name = event.target.value;
    this.setState(() => ({ name }));
  }
  onStockChange = (event) => {
    event.persist();
    const stock = event.target.value;
    if (stock.match(/^[1-9]{1}[0-9]{0,6}$/)) {
      this.setState(() => ({ stock }));  
    }
  }
  onUnitPriceChange = (event) => {
    event.persist();
    const unitPrice = event.target.value;
    if (unitPrice.match(/^[1-9]{1}[0-9]{0,5}$/)) {
      this.setState(() => ({ unitPrice }));
    }
  }
  render() {
    return (
      <Dialog open={this.props.show}>
        <DialogTitle>اضافه کردن محصول جدید</DialogTitle>
        <DialogContent>
          <ToastMessage
            variant={this.state.messageType}
            message={this.state.message}
            open={this.state.showMessage}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="name"
              className="form-control__input-label"
            >نام محصول</InputLabel>
            <Input id="name"
              onChange={this.onNameChage}
              value={this.state.name}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="stock"
              className="form-control__input-label"
            >موجودی</InputLabel>
            <Input id="stock"
              value={this.state.stock}
              onChange={this.onStockChange}
              type="number"
              startAdornment={<InputAdornment position="start">عدد</InputAdornment>}
            />
          </FormControl>
          <FormControl fullWidth
          >
            <InputLabel htmlFor="unit-price"            
              className="form-control__input-label"
            >قیمت واحد</InputLabel>
            <Input id="unit-price"
              value={this.state.unitPrice}
              onChange={this.onUnitPriceChange}
              type="number"
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
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startAddProduct: (product) => dispatch(startAddProduct(product))
});

export default connect(undefined, mapDispatchToProps)(AddProductDialog);

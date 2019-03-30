import React from 'react';
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
import axios from 'axios';

import { withStyles, MuiThemeProvider, createMuiTheme,  } from '@material-ui/core/styles';
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


import theme from '../themes/AppTheme';


import { separateDigits } from '../helpers/numberHelpers';
import { startAddInvoice } from '../actions/invoices';


// const styles = theme => ({
//   root: {
//     // width: '90%'
//     display: 'flex',
//     flexWrap: 'wrap'
//   },
//   TextField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: 200
//   },
//   totalPrice: {
//     fontWeight: 500
//   },
//   stepper_actions: {
//     textAlign: "right"
//   }
// });


const drawerWidth = 256;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#ff4400',
  },
};

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
    }
  };
  async componentDidMount() {
    const res = await axios.get(`${API_ENDPOINT}/api/v1/invoice/new-invoice-no`);
    if (res.data.status === true) {
      console.log('res.data.payload ', res.data.payload);
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
    console.log(event.target.value);
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
    console.log(event.target.value);
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
  render() {
    // this.initNewFactor();

    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    let stepContent;

    if (activeStep === 0) {
      stepContent = (
        <div className="container">
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Typography>
                شماره فاکتور
              </Typography>
              { this.state.invoice.no }
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Typography>
                تاریخ امروز
              </Typography>
              { this.state.invoice.date }     
            </GridItem>          
            <GridItem xs={12} sm={12} md={6}>
              <FormControl>
                <InputLabel htmlFor="customer">نام و نام خانوادگی</InputLabel>
                <Select
                  value={this.state.invoice.customerId}
                  onChange={this.onCustomerChange}                  
                >
                  {this.props.customers.map(customer => {
                    return (
                      <MenuItem key={customer._id} value={customer._id}>
                        { customer.fullName }
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام محصول</TableCell>
                    <TableCell>تعداد</TableCell>
                    <TableCell>قیمت واحد</TableCell>
                    <TableCell>قیمت کل</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { this.state.invoice.products.map(product => {
                    return (
                      <TableRow key={product._id}>
                        <TableCell component="th" scope="product">
                          { product.name }
                        </TableCell>
                        <TableCell>{ product.count }</TableCell>
                        <TableCell>{ separateDigits({ number: product.unitPrice, showCurrency: true }) }</TableCell>
                        <TableCell className="totalPrice">{ separateDigits({ number: product.totalPrice }) }</TableCell>
                        <TableCell>
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
                      <TableCell>
                        <IconButton onClick={this.onOpenAddProductDialog}>
                          <Icon>add_circle</Icon>
                        </IconButton>
                        <Select
                          value={this.state.invoice.newProduct._id}
                          onChange={this.onNewProductSelectChange}                  
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
                      <TableCell>
                        <TextField
                          type="number"
                          value={this.state.invoice.newProduct.count}
                          onChange={this.onNewProductCountChange}
                        >
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.unitPrice, showCurrency: true }) }</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{ separateDigits({ number: this.state.invoice.newProduct.totalPrice }) }</Typography>
                      </TableCell>
                      <TableCell>
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
            <GridItem xs={12} sm={12} md={6}>
              <Typography>
                استان
              </Typography>
              <Select
                value={this.state.invoice.address.provinceId}
                onChange={this.onProvinceChange}
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
            <GridItem xs={12} sm={12} md={6}>
              <Typography>
                شهر
              </Typography>
              <Select
                value={this.state.invoice.address.cityId}
                onChange={this.onCityChange}
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
            <GridItem xs={12} sm={12} md={12}>
              <FormControl component="fieldset" className="formControl">
                <FormLabel component="legend">نوع پست</FormLabel>
                <RadioGroup
                  aria-label="MailType"
                  name="mailType"
                  className={classes.group}
                  value={this.state.invoice.mailType}
                  onChange={this.onMailTypeChange}
                >
                  <FormControlLabel value="registered" control={<Radio />} label="عادی" />
                  <FormControlLabel value="certified" control={<Radio />} label="پیشتاز" />
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl component="fieldset" className="formControl">
                <FormLabel component="legend">تاریخ تحویل</FormLabel>                
                  
                <TextField
                  type="number"
                  value={this.state.invoice.deliverAfter}
                  onChange={this.ondeliverAfterChange}
                />

                <Select
                  value={this.state.invoice.deliverAfterTimeUnit}
                  onChange={this.onDeliverAfterTimeUnit}                  
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


              </FormControl>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
    
    return (
      <MuiThemeProvider theme={theme}>
        <div classes={classes.wrapper}>
          <div classes={classes.root}>
            <CssBaseline />
            <Header/>
            <div classes={classes.appContent}>
              <div classes={classes.mainContent}>
                <Stepper activeStep={activeStep}>
                  { steps.map((label, index) => {
                    const props = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...props}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
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
  startAddInvoice: (invoice) => dispatch(startAddInvoice(invoice))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddInvoicePage));

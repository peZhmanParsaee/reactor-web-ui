import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';

// material-ui/core
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

// @material-ui/icons
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// local dependencies
import appStyle from '../../styles/jss/layouts/appStyle';
import { separateDigits } from '../../helpers/numberHelpers';

// local components
import AddProductDialog from '../AddProductDialog';
import GridContainer from '../Grid/GridContainer';
import GridItem from '../Grid/GridItem';
import InvoiceProductsListItem from './InvoiceProductsListItem';

class Step0 extends PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6} style={{marginBottom: '15px'}}>
            <Typography style={{fontWeight: 'bold'}}>
              شماره فاکتور
            </Typography>              
            <span>{ this.props.invoiceNo }</span>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} style={{marginBottom: '15px'}}>
            <Typography style={{fontWeight: 'bold'}}>
              تاریخ امروز
            </Typography>
            <span>{ this.props.invoiceDate }</span>
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
                {...this.props.autosuggestProps}
                inputProps={{
                  classes,
                  placeholder: 'نام و نام خانوادگی',
                  value: this.props.single,
                  onChange: this.props.handleAutoSuggestChage('single'),
                }}
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion
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
              <ListItem className={ classes.addFactorProductsListItemHead } key={ `iplh_1` }>
                <List className={ classes.addFactorProductsNestedList }>
                  <ListItem style={{width:'30%'}}
                    className={ classes.addFactorProductsNestedListItemHead }
                    key={ `iplh_1_1` }
                  >نام محصول</ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItemHead }
                    key={ `iplh_1_2` }
                  >تعداد</ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItemHead }
                    key={ `iplh_1_3` }>قیمت واحد</ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItemHead }
                    key={ `iplh_1_4` }>قیمت کل</ListItem>
                  <ListItem style={{width:'10%'}}
                    key={ `iplh_1_5` }></ListItem>
                </List>
              </ListItem>
              
              { 
                this.props.invoiceProducts.map((product, index) => {
                  return <InvoiceProductsListItem 
                    key={ `ipli1_${index}` }
                    itemKey={ `ipli_${index}_i` }
                    onAddedProductCountChange={ this.props.onAddedProductCountChange }
                    product={{
                      id: product.id,
                      name: product.name,
                      unitPrice: product.unitPrice,                              
                      count: product.count,
                      totalPrice: product.totalPrice
                    }}
                  />
                })
              }
              
              <ListItem className={ classes.addFactorProductsListItem } key={ `ipli_add` }>
                <List className={ classes.addFactorProductsNestedList }>
                  <ListItem style={{width:'30%'}}
                    className={ classes.addFactorProductsNestedListItem }
                    key={ `ipli_add_1` }
                  >
                    <IconButton onClick={this.props.onOpenAddProductDialog}>
                      <Icon>add_circle</Icon>
                    </IconButton>
                    <Select
                      value={this.props.newProductId}
                      onChange={this.props.onNewProductSelectChange}
                      className={classes.selectBox}
                    >
                      {this.props.products.filter(product => {
                        const found = this.props.invoiceProducts.find(invoiceProduct => {
                          return invoiceProduct.productId === product._id;
                        });
                        return !found;
                      }).map(product => {
                        return (
                          <MenuItem key={product._id} value={product._id}>
                            { product.name }
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItem }
                    key={ `ipli_add_2` }
                  >
                    <TextField
                      type="number"
                      value={this.props.newProductCount}
                      onChange={this.props.onNewProductCountChange}
                      className="text-center"
                    >
                    </TextField>
                  </ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItem }
                    key={ `ipli_add_3` }
                  >
                    <Typography>{ separateDigits({ number: this.props.newProductUnitPrice, showCurrency: true }) }</Typography>
                  </ListItem>
                  <ListItem style={{width:'20%'}}
                    className={ classes.addFactorProductsNestedListItem }
                    key={ `ipli_add_4` }
                  >
                    <Typography>{ separateDigits({ number: this.props.newProductTotalPrice }) }</Typography>
                  </ListItem>
                  <ListItem style={{width:'10%'}}
                    className={ classes.addFactorProductsNestedListItem }
                    key={ `ipli_add_5` }
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
              show={this.props.isAddProductDialogOpen} 
              onCloseDialog={this.props.onCloseAddProductDialog}
              showGlobalMessage={this.props.showGlobalMessage}
              onSaveAddProductDialog={this.props.onSaveAddProductDialog}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

Step0.propTypes = {
  classes: PropTypes.object.isRequired,
  invoiceNo: PropTypes.number.isRequired,
  invoiceDate: PropTypes.string.isRequired,
  invoiceProducts: PropTypes.array.isRequired,
  handleAutoSuggestChage: PropTypes.func.isRequired,
  single: PropTypes.string.isRequired,
  newProductId: PropTypes.number.isRequired,
  newProductCount: PropTypes.number.isRequired,
  newProductUnitPrice: PropTypes.number.isRequired,
  newProductTotalPrice: PropTypes.number.isRequired,
  onNewProductSelectChange: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  isAddProductDialogOpen: PropTypes.bool.isRequired,
  onCloseAddProductDialog: PropTypes.func.isRequired,
  onNewProductCountChange: PropTypes.func.isRequired,
  onAddedProductCountChange: PropTypes.func.isRequired,
  onOpenAddProductDialog: PropTypes.func.isRequired,
  onRemoveProductFromInvoice: PropTypes.func.isRequired,
  showGlobalMessage: PropTypes.func.isRequired
};

export default withStyles(appStyle)(Step0);

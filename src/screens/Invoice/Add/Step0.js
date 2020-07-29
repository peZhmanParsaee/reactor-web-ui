import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';

// material-ui/core
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

// local components
import AddProductDialog from './AddProductDialog';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';

class Step0 extends PureComponent {
  render() {
    const {
      classes,
      invoiceNo,
      invoiceDate,
      autosuggestProps,
      single,
      handleAutoSuggestChage,
      isAddProductDialogOpen,
      onCloseAddProductDialog,
      showGlobalMessage,
      onSaveAddProductDialog
    } = this.props;

    return (
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6} style={{ marginBottom: '15px' }}>
            <Typography style={{ fontWeight: 'bold' }}>شماره فاکتور</Typography>
            <span>{invoiceNo}</span>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} style={{ marginBottom: '15px' }}>
            <Typography style={{ fontWeight: 'bold' }}>تاریخ امروز</Typography>
            <span>{invoiceDate}</span>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={6}
            className="autosuggest"
            style={{ marginBottom: '15px' }}
          >
            <FormControl>
              <Typography style={{ fontWeight: 'bold' }}>
                نام و نام خانوادگی
              </Typography>
              <Autosuggest
                {...autosuggestProps}
                inputProps={{
                  classes,
                  placeholder: 'نام و نام خانوادگی',
                  value: single,
                  onChange: handleAutoSuggestChage('single')
                }}
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion
                }}
                renderSuggestionsContainer={(options) => (
                  <Paper {...options.containerProps} square>
                    {options.children}
                  </Paper>
                )}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} />
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <AddProductDialog
              show={isAddProductDialogOpen}
              onCloseDialog={onCloseAddProductDialog}
              showGlobalMessage={showGlobalMessage}
              onSaveAddProductDialog={onSaveAddProductDialog}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
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

export default Step0;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// @material-ui/core
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

// @material-ui/icons
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// local components
import AddInvoiceContext from './AddInvoiceContext';

// local dependencies
import { separateDigits } from '../../../helpers/numberHelpers';
import invoiceProductsListItemStyle from '../../../styles/jss/components/addInvoice/invoiceProductsListItemStyle';

class InvoiceProductListItem extends PureComponent {
  render() {
    const { classes, itemKey } = this.props;

    return (
      <ListItem key={itemKey} className={classes.addFactorProductsListItem}>
        <AddInvoiceContext.Consumer>
          {(context) => {
            return (
              <List className={classes.addFactorProductsNestedList}>
                <ListItem
                  scope="product"
                  style={{ width: '30%' }}
                  className={classes.addFactorProductsNestedListItem}
                  key={`${itemKey}_1`}
                >
                  {this.props.product.name}
                </ListItem>
                <ListItem
                  style={{ width: '20%' }}
                  className={classes.addFactorProductsNestedListItem}
                  key={`${itemKey}_2`}
                >
                  <TextField
                    type="number"
                    value={this.props.product.count}
                    id={this.props.product.id}
                    onChange={this.props.onAddedProductCountChange}
                    className="text-center"
                  ></TextField>
                </ListItem>
                <ListItem
                  style={{ width: '20%' }}
                  className={classes.addFactorProductsNestedListItem}
                  key={`${itemKey}_3`}
                >
                  {separateDigits({
                    number: this.props.product.unitPrice,
                    showCurrency: true
                  })}
                </ListItem>
                <ListItem
                  style={{ width: '20%' }}
                  className={classes.addFactorProductsNestedListItem}
                  key={`${itemKey}_4`}
                >
                  {separateDigits({ number: this.props.product.totalPrice })}
                </ListItem>
                <ListItem
                  style={{ width: '10%' }}
                  className={classes.addFactorProductsNestedListItem}
                  key={`${itemKey}_5`}
                >
                  <IconButton
                    onClick={() => {
                      context.onRemoveProductFromInvoice(this.props.product.id);
                    }}
                  >
                    <Icon>remove_circle</Icon>
                  </IconButton>
                </ListItem>
              </List>
            );
          }}
        </AddInvoiceContext.Consumer>
      </ListItem>
    );
  }
}

InvoiceProductListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  itemKey: PropTypes.string.isRequired,
  onAddedProductCountChange: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired
};

InvoiceProductListItem.contextType = AddInvoiceContext;

const styles = (theme) => invoiceProductsListItemStyle;

export default withStyles(styles)(InvoiceProductListItem);

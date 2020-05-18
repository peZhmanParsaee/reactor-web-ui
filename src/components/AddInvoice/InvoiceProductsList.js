import React from 'react';
import {
  List, ListItem, Select, MenuItem, TextField
} from '@material-ui/core';

// @material-ui/icons
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import InvoiceProductsListItem from './InvoiceProductsListItem';
import { separateDigits } from '../../helpers/numberHelpers';

export default InvoiceProductsList = (props) => {
  const onAddNewProductToInvoice = () => {

  };

  return (
    <List>
      <ListItem className={props.classes.addFactorProductsListItemHead} key="iplh_1">
        <List className={props.classes.addFactorProductsNestedList}>
          <ListItem style={{width:'30%'}}
            className={props.classes.addFactorProductsNestedListItemHead}
            key={`iplh_1_1`}
          >نام محصول</ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItemHead}
            key={`iplh_1_2`}
          >تعداد</ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItemHead}
            key={`iplh_1_3`}>قیمت واحد</ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItemHead}
            key={`iplh_1_4`}>قیمت کل</ListItem>
          <ListItem style={{width:'10%'}}
            key={`iplh_1_5`}></ListItem>
        </List>
      </ListItem>
      {
        props.products.map((product) => {
          return <InvoiceProductsListItem 
            key={`ipli1_${product.id}`}
            itemKey={`ipli_${product.id}_i`}
            onAddedProductCountChange={props.onAddedProductCountChange}
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
      
      <ListItem className={props.classes.addFactorProductsListItem} key={`ipli_add`}>
        <List className={props.classes.addFactorProductsNestedList}>
          <ListItem style={{width:'30%'}}
            className={props.classes.addFactorProductsNestedListItem}
            key={`ipli_add_1`}
          >
            <IconButton onClick={props.onOpenAddProductDialog}>
              <Icon>add_circle</Icon>
            </IconButton>
            <Select
              value={props.newProductId}
              onChange={props.onNewProductSelectChange}
              className={props.classes.selectBox}
            >
              {props.products.filter(product => {
                const found = props.products.find(invoiceProduct => {
                  return invoiceProduct.productId === product._id;
                });
                return !found;
              }).map(product => {
                return (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                );
              })}
            </Select>
          </ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItem}
            key={`ipli_add_2`}
          >
            <TextField
              type="number"
              value={props.newProductCount}
              onChange={props.onNewProductCountChange}
              className="text-center"
            >
            </TextField>
          </ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItem}
            key={`ipli_add_3`}
          >
            <Typography>{separateDigits({number: props.newProductUnitPrice, showCurrency: true})}</Typography>
          </ListItem>
          <ListItem style={{width:'20%'}}
            className={props.classes.addFactorProductsNestedListItem}
            key={`ipli_add_4`}
          >
            <Typography>{separateDigits({number: props.newProductTotalPrice})}</Typography>
          </ListItem>
          <ListItem style={{width:'10%'}}
            className={props.classes.addFactorProductsNestedListItem}
            key={`ipli_add_5`}
          >
            <IconButton 
              onClick={onAddNewProductToInvoice}
            >
              <Icon>add_circle</Icon>
            </IconButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
};

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import GridContainer from '../Grid/GridContainer';
import GridItem from '../Grid/GridItem';

// material-ui/core
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// local dependencies
import appStyle from '../../styles/jss/layouts/appStyle';

class Step1 extends PureComponent {
    render() {
        const { classes } = this.props;
        return (
            <div className="container">
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}
                    style={{
                        marginBottom: "30px"
                    }}
                    >
                    <Typography 
                        style={{
                        fontWeight: "bold"
                        }}
                    >
                        استان
                    </Typography>
                    <Select
                        value={this.props.provinceId}
                        onChange={this.props.onProvinceChange}
                        className={classes.selectBox}
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
                    <GridItem xs={12} sm={12} md={6}
                    style={{
                        marginBottom: "30px"
                    }}
                    >
                    <Typography
                        style={{
                        fontWeight: "bold"
                        }}
                    >
                        شهر
                    </Typography>
                    <Select
                        value={this.props.cityId}
                        onChange={this.props.onCityChange}
                        className={classes.selectBox}
                    >
                        {this.props.provinces
                        .find(province => {
                            return province._id === this.props.provinceId;
                        }) ?
                        this.props.provinces
                            .find(province => {
                            return province._id === this.props.provinceId;
                            })
                            .cities
                            .map(cityInProvince => {
                            return (
                                <MenuItem key={cityInProvince._id} value={cityInProvince._id}>
                                { cityInProvince.name }
                                </MenuItem>
                            );
                            }): null
                        }
                    </Select>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}
                    style={{
                        marginBottom: "30px"
                    }}
                    >
                    <FormControl component="fieldset" className="formControl">
                        <FormLabel component="legend"
                        style={{
                            fontWeight: "bold"
                        }}
                        >نوع پست</FormLabel>
                        <RadioGroup
                            aria-label="MailType"
                            name="mailType"
                            className={classes.group}
                            value={this.props.mailType}
                            onChange={this.props.onMailTypeChange}
                            style={{display: 'flex', flexDirection: 'row'}}
                        >
                        <FormControlLabel value="registered" control={<Radio />} label="عادی" />
                        <FormControlLabel value="certified" control={<Radio />} label="پیشتاز" />
                        </RadioGroup>
                    </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}
                    style={{
                        marginBottom: "30px"
                    }}
                    >
                        <FormControl className="formControl" >
                            <FormLabel component="legend"
                            
                            >تاریخ تحویل</FormLabel>                
                            
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <TextField
                                    type="number"
                                    value={this.props.deliverAfter}
                                    onChange={this.props.onDeliverAfterChange}
                                    style={{
                                        display: "inline-block",
                                        marginLeft: "10px"
                                    }}
                                />

                                <Select
                                    value={this.props.deliverAfterTimeUnit}
                                    onChange={this.props.onDeliverAfterTimeUnitChange}
                                    className={classes.selectBox}
                                    style={{
                                        display: "inline-block",
                                        marginLeft: "10px"
                                    }}
                                >
                                    <MenuItem key="hour" value="hour">ساعت</MenuItem>
                                    <MenuItem key="day" value="day">روز</MenuItem>
                                    <MenuItem key="month" value="month">ماه</MenuItem>
                                </Select>

                                <Typography
                                    style={{
                                        display: "inline-block",
                                        marginLeft: "10px"
                                    }}
                                >
                                    بعد از تاریخ ثبت سفارش
                                </Typography>

                            </div>
                            
                        </FormControl>
                    </GridItem>
                </GridContainer>
            </div>
        )
    }
}

Step1.propTypes = {
    classes: PropTypes.object.isRequired,
    provinceId: PropTypes.string.isRequired,
    cityId: PropTypes.string.isRequired,
    onProvinceChange: PropTypes.func.isRequired,
    onCityChange: PropTypes.func.isRequired,
    provinces: PropTypes.array.isRequired,
    mailType: PropTypes.string.isRequired,
    onMailTypeChange: PropTypes.func.isRequired,
    deliverAfter: PropTypes.string.isRequired,
    onDeliverAfterChange: PropTypes.func.isRequired,
    deliverAfterTimeUnit: PropTypes.string.isRequired,
    onDeliverAfterTimeUnitChange: PropTypes.func.isRequired
};

export default withStyles(appStyle)(Step1);

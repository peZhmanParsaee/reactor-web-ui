import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

// @material-ui/core
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

// @material-ui/icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

// actions
import { setMessageOpenState } from '../../actions/message';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class ToastMessage extends React.PureComponent {
  handleClose = (event, reason) => {
    this.props.setMessageOpenState({ open: false });
  };

  render() {
    const { classes, className } = this.props;
    const { text: message, open, type: variant } = this.props.state;
    const Icon = variantIcon[variant];


    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <SnackbarContent
          className={classNames(classes[variant], className)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
          
        />
      </Snackbar>      
    );
  }
}

ToastMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  // variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const mapStateToProps = (state) => ({
  state: state.message
});

const mapDispatchToProps = (dispatch) => ({
  setMessageOpenState: ({ open }) => dispatch(setMessageOpenState({ open }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles1)(ToastMessage));

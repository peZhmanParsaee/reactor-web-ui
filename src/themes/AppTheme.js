import { createMuiTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

const AppTheme = createMuiTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      'VazirFD',
      'Tahoma',
      'Arial',
      'sans-serif'
    ].join(','),
    textAlign: 'right',
    useNextVariants: true
  },
  appBar: {
    // transition: theme.transitions.create(['margin', 'width'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    // transition: theme.transitions.create(['margin', 'width'], {
    //   easing: theme.transitions.easing.easeOut,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    // ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }
});

export default AppTheme;

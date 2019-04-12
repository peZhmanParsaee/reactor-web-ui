import {
  drawerWidth,
  transition,
  container
} from "../styles";

const appStyle = theme => ({
  mainContent: {
    // marginTop: "70px",
    padding: "0px 15px"
  },
  container,
  map: {
    marginTop: "70px"
  },
  iconContainer: { // define styles for icon container
    // transform: 'scale(1)',
    paddingRight: 0,
    paddingLeft: "8px"
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  drawer: {
    overflow: "visible"
  },
  drawerPaper: {
    width: drawerWidth,
    overflow: "visible"
  },
  selectBox: {
    width: 180
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  reportListItemRow: {
    justifyContent: "center"
  },
  reportListItemHeadRow: {
    justifyContent: "center"
  },
  reportNestedListItemHeadRow: {
    display: 'flex', 
    flexDirection: 'row'
  },  
  reportNestedListItemRow: {
    display: 'flex', 
    flexDirection: 'row'
  },  
  reportNestedListItemHead: {
    textAlign: "center", 
    fontWeight: "bold",
    justifyContent: "center",    
    borderBottom: "1px solid #0e0e0e",
    marginLeft: 15,
    width: 150
  },
  reportNestedListItem: {
    textAlign: "center",
    width: 150,
    justifyContent: "center",
    marginLeft: 15
  },
  reportInfiniteScrollContainer: {
    maxHeight: 400, 
    overflow: "auto",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 50
  },
  '@media screen and (max-width: 800px)': {
    reportListItemRow: {
      borderBottom: "1px solid #0e0e0e"
    },
    reportListItemHeadRow: {
      display: 'none'
    },
    reportNestedListItemRow: {
      flexDirection: 'column'
    },
  },
  addFactorProductsListItemHead: {
    
  },
  addFactorProductsListItem: {
    textAlign: "center"

  },
  addFactorProductsNestedList: {
    display: 'flex', 
    flexDirection: 'row',
    width: "100%"
  },
  addFactorProductsNestedListItem: {
    textAlign: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  addFactorProductsNestedListItemHead: {
    textAlign: "center", 
    fontWeight: "bold",
    justifyContent: "center",    
    borderBottom: "1px solid #0e0e0e",
    marginLeft: 15,
  },
  textCenter: {
    textAlign: "center",
    justifyContent: "center"
  },
  stepperActions: {
    textAlign: "left",
    marginTop: 10
  }
});

export default appStyle;

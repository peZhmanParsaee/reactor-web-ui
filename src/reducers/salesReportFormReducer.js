import * as TYPES from '../actions/types';

const INITIAL_STATE = {
    loadingState: false,
    invoices: [],
    offset: 0,
    limit: 10,
    finished: false,
    open: false,
    fromDate: null,
    toDate: null,
    fromDateCalendarFocused: false,
    toDateCalendarFocused: false,
    invoiceType: "INVOICE_ITEMS",
    selectedDate: new Date('2014-08-18T21:11:54'),
    startDate: null,
    endDate: null
};

export default (state = INITIAL_STATE, action) => {    
  switch(action.type) {
    case TYPES.SALES_REPORT_FORM_SET_OPEN_DRAWER_STATE:
        return {
            ...state,
            open: action.payload.openDrawerState
        };
    case TYPES.SALES_REPORT_FORM_SET_START_DATE:
        return {
            ...state,
            startDate: action.payload.startDate
        };
    case TYPES.SALES_REPORT_FORM_SET_END_DATE:
        return {
            ...state,
            endDate: action.payload.endDate
        };
    case TYPES.SALES_REPORT_FORM_SET_INVOICE_TYPE:
        return {
            ...state,
            invoiceType: action.payload.invoiceType,
            invoices: []
        };
    case TYPES.SALES_REPORT_FORM_SET_LOADING_STATE: 
        return {
            ...state,
            loadingState: action.payload.loadingState
        };
    case TYPES.SALES_REPORT_FORM_SET_LIST_PAGE:
        return {
            ...state,
            offset: action.payload.offset,
            loadingState: action.payload.loadingState,
            invoices: [
                ...state.invoices,
                ...action.payload.listPage
            ]
        };
    case TYPES.SALES_REPORT_FORM_SET_FINISH_LIST_PAGES:
        return {
            ...state,
            finished: action.payload.finished,
            loadingState: action.payload.loadingState
        };
    case TYPES.SALES_REPORT_FORM_SEARCH:
        return {
            ...state,
            offset: 0,
            invoices: [],
            open: false,
            finished: false
        };
    default:
        return state;
  }
};

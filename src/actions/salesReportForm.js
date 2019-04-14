import * as TYPES from './types';

export const salesReportFormSetOpenDrawerState = (openDrawerState) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_OPEN_DRAWER_STATE,
        payload: { openDrawerState }
    };
};

export const salesReportFormSetStartDate = (startDate) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_START_DATE,
        payload: { startDate }
    };
};

export const salesReportFormSetEndDate = (endDate) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_END_DATE,
        payload: { endDate }
    };
};

export const salesReportFormSetInvoiceType = (invoiceType) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_INVOICE_TYPE,
        payload: { invoiceType }
    };
};

export const salesReportFormSetLoadingState = (loadingState) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_LOADING_STATE,
        payload: { loadingState }
    };
};

export const salesReportFormSetListPage = ({ offset, loadingState, listPage  }) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_LIST_PAGE,
        payload: { 
            offset, 
            loadingState, 
            listPage
        }
    };
};

export const salesReportFormSetFinishListPages = ({ finished, loadingState }) => {
    return {
        type: TYPES.SALES_REPORT_FORM_SET_FINISH_LIST_PAGES,
        payload: { 
            finished, 
            loadingState
        }
    };
};

export const salesReportFormSearch = () => {
    return {
        type: TYPES.SALES_REPORT_FORM_SEARCH
    };
};

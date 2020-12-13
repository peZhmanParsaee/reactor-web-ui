import axios, { CancelToken } from 'axios';

// NOTE: API_ENDPOINT is a global variable

const getUrl = (route) => `${API_ENDPOINT}/api/${route}`;

const getRequestHeaders = (withAuth) => ({
  Authorization: withAuth ? `Bearer ${localStorage.token}` : undefined,
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
});

export const apiCall = ({
  url,
  method = 'GET',
  data = null,
  withAuth = false,
  params = null,
  cancelToken = null
}) => {
  return axios
    .request({
      url: getUrl(url),
      method,
      // headers: getRequestHeaders(withAuth),
      data,
      params,
      cancelToken
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        console.log(`Request cancelled, ${error.message}`);
      } else if (error.response && error.response.status === 403) {
        // dispatch(accessDenied(window.location.pathname));
      } else {
        throw error;
      }
    });
};

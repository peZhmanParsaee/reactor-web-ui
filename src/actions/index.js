import { SET_PROVINCES, API, FETCH_PROVINCES } from "./types";

export function fetchProvinces() {
  return apiAction({
    url: `${API_ENDPOINT}/api/v1/province`,
    onSuccess: setProvinces,
    onFailure: console.log("Error occured loading provinces"),
    label: FETCH_PROVINCES
  });
}

function setProvinces(data) {
  const provinces = data.status == true ? data.payload : [];
  
  return {
    type: SET_PROVINCES,
    payload: provinces
  };  
}

function apiAction({
  url = "",
  method = "GET",
  data = null,
  accessToken = null,
  onSuccess = () => {},
  onFailure = () => {},
  label = "",
  headersOverride = null
}) {
  return {
    type: API,
    payload: {
      url,
      method,
      data,
      accessToken,
      onSuccess,
      onFailure,
      label,
      headersOverride
    }
  };
}

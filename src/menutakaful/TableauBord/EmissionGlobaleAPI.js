import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request,
} from "../../constants/index";

export function getAllEmissionGlobale(pageNumber,pageSize,sortCol,direction) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log("getAllEmissions APICALL : ")
  console.log(pageNumber,pageSize,direction,sortCol)
  return request({
    url: API_BASE_URL + "/private/EmissionsGlobales?pageNumber="+pageNumber+"&pageSize="+pageSize+"&sortCol="+sortCol+"&direction="+false,
    method: "GET",
  });
}

export function findByNumeroLot(numeroLot) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/EmissionGlobale/" + numeroLot,
    method: "GET",
  });
}
export function DeleteByNumeroLot(Lot) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/encaissement/deleteCotisation/" + Lot,
    method: "GET",
  });
}

export function EncaisserLotApi(model) {
  console.log("API Encaissement", model);
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/encaissement/EncaissementLot",
    data: model,
    method: "POST",
  });
}

export function jasperBordereauApi(model) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/bordereauEncaissement/pdf",
    method: "POST",
    data: model,
    responseType: "blob"
  });
}

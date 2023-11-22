import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../../constants/index";

export function lettreOrientation(lettre) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/lettreOrientation/pdf",
    method: "POST",
    data: lettre,
    responseType: "blob"
  });
}

export function getNormeByCapitalAndAge(age, capital, decesProduit) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/normeSelection/select?age=" +
      age +
      "&capitale=" +
      capital +
      "&deceProduit=" +
      decesProduit,
    method: "GET"
  });
}
export function getCinIfExist(cin) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/personnePhysique/" + cin,
    method: "GET"
  });
}
export function conditionParticulier(condition) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/conditionParticuliere/pdf",
    method: "POST",
    data: condition,
    responseType: "blob"
  });
}
export function getRibIfExist(rib) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/personnePhysique/rib/" + rib,
    method: "GET"
  });
}
export function getContratById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/contratId/" + id,
    method: "GET"
  });
}
export function updateDecesContratOrientation(id, orientation) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/decescontratOrientation/" +
      id +
      "/" +
      orientation,
    method: "PUT"
  });
}

export function ReglemntGestion(partenaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/reglementGestion/pdf/" + partenaire,
    method: "GET",
    responseType: "blob"
  });
}

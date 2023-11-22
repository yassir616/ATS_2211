import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";

export function getAuxiliaires() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/auxiliaire?page=0&sort=nom&direction=asc",
    method: "GET"
  });
}

export function getAuxiliairesByStatut() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/auxiliairebystatut",
    method: "GET"
  });
}

export function updateAuxiliaire(auxiliaireId, updatedAuxiliaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/auxiliaire/" + auxiliaireId,
    method: "PUT",
    data: updatedAuxiliaire
  });
}

export function ajoutAuxiliaire(values) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/auxiliaire/add",
    method: "POST",
    data: values
  });
}

export function getTypeAuxiliaire() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/Typeauxiliaire?page=0&sort=code&direction=asc",
    method: "GET"
  });
}

export function getAuxiliairesByType(type) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/auxiliairebytype?type=" + type,
    method: "GET"
  });
}

import {
  API_BASE_URL,
  ACCESS_TOKEN,
  REQUEST as request
} from "../../../constants/index";

export function getAllProductMrb() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/getAllProductMrb?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function getAllExclusionMrb() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/getAllExclusionMrb?page=0&sort=exclusionMrb&direction=asc",
    method: "GET"
  });
}
export function addProduitMrb(model) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addProductMrb",
    data: model,
    method: "POST"
  });
}
export function updateProductMrb(id, updatedProduct) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/updateProductMrb/" + id,
    data: updatedProduct,
    method: "PUT"
  });
}
export function getTarificationsMrb(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/tarificationsMrb/" + id + "?page=0",
    method: "GET"
  });
}
export function ajoutSinistreMrb(sinistreRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addSinistreMrb",
    data: sinistreRequest,
    method: "POST"
  });
}

export function recupereDataSinistreMrb(sinistreMrb) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/recupereDataSinistreMrb",
    data: sinistreMrb,
    method: "POST"
  });
}

export function getSinistreMrb(contratId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/getSinistreMrb/" + contratId,
    method: "GET"
  });
}
export function updateSinistreMrb(updatedSinistre, id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/updateSinistreMrb/" + id,
    method: "PUT",
    data: updatedSinistre
  });
}
export function getTarificationMrb(produit) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/tarrificationMrb?produit=" +
      produit,
    method: "GET"
  });
}

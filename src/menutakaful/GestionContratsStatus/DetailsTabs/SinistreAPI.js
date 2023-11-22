import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../../constants/index";

export function getSinistre(contratId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/getSinistre/" + contratId,
    method: "GET"
  });
}

export function deleteSinistre(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/Sinistre/delete/" + id,
    method: "DELETE"
  });
}

export function ajoutSinistre(sinistreRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/addSinistre",
    data: sinistreRequest,
    method: "POST"
  });
}
export function setStatut(id, statut, requestModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/sinistre/setStatus/" +
      id +
      "/" +
      statut +
      "?page=0",
    data: requestModel,
    method: "POST"
  });
}
export function ajoutReglement(id, type, requested) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/sinistre/" + id + "/" + type,
    data: requested,
    method: "POST"
  });
}
export function getReglements() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/reglements?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}

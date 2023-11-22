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

export function searchSinistre(searchby,searchfor){
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/findSinistre?searchby="+searchby+"&"+"searchfor="+searchfor,
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
export function ajoutReglement(type, requested) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/sinistre/" + type,
    data: requested,
    method: "POST"
  });
}
export function getReglements(pageNumber) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/reglements?page="+pageNumber+"&limit=5&sort=libelle&direction=asc",
    method: "GET"
  });
}

export function lettreRelance(lettre) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/lettreRelance/pdf",
    method: "POST",
    data: lettre,
    responseType: "blob"
  });
}

export function notifierLettreRelance(numContrat,pointVente) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/notif-lettre-relance?numContrat="+numContrat+"&"+"pointVente="+pointVente,
    method: "POST"
  });
}



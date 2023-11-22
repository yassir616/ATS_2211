import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";

export function getAllPartenaire() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/partenaires?direction=asc&page=0&sort=code",
    method: "GET"
  });
}
export function getPartenaireByCode(codePartenaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/partenaire/code/" + codePartenaire,
    method: "GET"
  });
}
export function getCompteBancaireById(idCpt) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/compteBancaireId/" + idCpt,
    method: "GET"
  });
}
export function getPartenaireById(idPartenaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/partenaire/" + idPartenaire,
    method: "GET"
  });
}
export function addPartenaire(createPartenaireRequest) {
  return request({
    url: API_BASE_URL + "/private/partenaire",
    method: "POST",
    data: createPartenaireRequest
  });
}
export function updatePartenaire(partenaireId, updatedPartenaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/partenaire/" + partenaireId,
    data: updatedPartenaire,
    method: "PUT"
  });
}

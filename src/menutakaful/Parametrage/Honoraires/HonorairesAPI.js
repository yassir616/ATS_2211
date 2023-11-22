import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";

export function createPrestationHonoraire(prestationRequestModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/prestation-honoraire",
    data: prestationRequestModel,
    method: "POST"
  });
}
export function getHonoraire() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/honoraires/?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function updateHonoraire(honoraireId, updatedHonoraire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/honoraire/" + honoraireId,
    method: "PUT",
    data: updatedHonoraire
  });
}
export function ajoutHonoraire(honoraireRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/honoraire/add",
    method: "POST",
    data: honoraireRequest
  });
}

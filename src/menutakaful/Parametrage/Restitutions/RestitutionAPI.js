import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";

export function ajoutCauseRes(causeResRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/causerestitution",
    method: "POST",
    data: causeResRequest
  });
}
export function getCauseRes() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/causerestitution/?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function updateCauseRes(causeResId, updatedCauseRes) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/causerestitution/" + causeResId,
    method: "PUT",
    data: updatedCauseRes
  });
}
export function getRestitutions() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/restitutions?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function updateRestitutions(restitutionId, updatedRestitution) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/restitution/" + restitutionId,
    method: "PUT",
    data: updatedRestitution
  });
}
export function ajoutRestitution(restitutionRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/restitution",
    method: "POST",
    data: restitutionRequest
  });
}

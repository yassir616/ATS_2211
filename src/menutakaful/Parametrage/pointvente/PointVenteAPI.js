import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";
export function getAllPointVente() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/pointventes?direction=asc&page=0&sort=abb",
    method: "GET"
  });
}
export function addPointVente(createPointVenteRequest) {
  return request({
    url: API_BASE_URL + "/private/pointvente",
    method: "POST",
    data: createPointVenteRequest
  });
}
export function getTypePointVente() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/typepointventes?direction=asc&page=0&sort=id",
    method: "GET"
  });
}
export function updatePointVente(PointVenteId, PointVenteToUpdate) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/pointvente/" + PointVenteId,
    method: "PUT",
    data: PointVenteToUpdate
  });
}
export function getPointVenteByCodeInterne(code) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/pointventebycode/" + code,
    method: "GET"
  });
}

import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";

export function updateAvenant(avenantId, updatedAvenant) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/typeavenant/" + avenantId,
    method: "PUT",
    data: updatedAvenant
  });
}
export function getAllAvenants() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/TypeAvenant?direction=asc&limit=4&page=0&sort=code",
    method: "GET"
  });
}
export function addTypeAvenant(createTypeAvenantRequest) {
  return request({
    url: API_BASE_URL + "/private/TypeAvenant/add",
    method: "POST",
    data: createTypeAvenantRequest
  });
}
export function addAvenant(id, updatedContrat) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/decescontrat/" + id,
    method: "PUT",
    data: updatedContrat
  });
}
export function addAvenantRetrait(id, updatedContrat) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/retraitcontrat/" + id,
    method: "PUT",
    data: updatedContrat
  });
}
export function getAvenant(contratId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/avenant/" + contratId,
    method: "GET"
  });
}
export function getTypeAvenant() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/TypeAvenant?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function getCodeTypeAvenantById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/TypeAvenant/" + id,
    method: "GET"
  });
}

export function ajouterAvenant(avenant, typeContart) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/avenant/" + typeContart,
    method: "POST",
    data: avenant
  });
}

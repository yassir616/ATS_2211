import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../constants/index";

export function searchFlux(modelRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/flux",
    data: modelRequest,
    method: "POST"
  });
}
export function addFlux(modelRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addflux",
    data: modelRequest,
    method: "POST"
  });
}

export function downloadFlux(title) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/downloadFlux/" + title,
    method: "GET"
  });
}

export function listFiles() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/listFluxFiles",
    method: "GET"
  });
}
export function getPieceJoint(code) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/piecejointe/" +
      code +
      "?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}

export function getPieceJointByNumeroSinistre(numeroSinistre) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/piecejointe/NumeroSinistre/" +
      numeroSinistre,
    method: "GET"
  });
}

export function getUploadedFilesByPrestationId(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/uploadedFiles?prestationId=" + id,
    method: "GET"
  });
}

export function deleteFile(fileId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/uploadedFiles/delete/" + fileId,
    method: "DELETE"
  });
}

export function updateNecessityPieceJointe(id, requestData) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/updateNecessityPieceJointe/" + id, 
    data: requestData,
    method: "PUT"
  });
}

export function getOption() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/optionassurances?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function getExclusion(famille) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/exclusions/" +
      famille +
      "?page=0&sort=exclusion_nom&direction=asc",
    method: "GET"
  });
}
export function jasperFile(devis) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/jasper/pdf",
    method: "POST",
    data: devis,
    responseType: "blob"
  });
}
export function jasperFileMrb(devisMrb) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/devisMrb/pdf",
    method: "POST",
    data: devisMrb,
    responseType: "blob"
  });
}

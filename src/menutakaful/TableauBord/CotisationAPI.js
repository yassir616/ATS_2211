import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request,
} from "../../constants/index";

export function ajoutCotisation(cotisationRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addCotisation",
    data: cotisationRequest,
    method: "POST",
  });
}

export function ajoutCotisations(cotisationListRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addCotisations",
    data: cotisationListRequest,
    method: "POST",
  });
}

export function ajoutEncaissement(encaissementRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addEncaissement",
    data: encaissementRequest,
    method: "POST",
  });
}
export function getCotisationById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/cotisation/contrat/" + id,
    method: "GET",
  });
}

export function getEncaissementById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/encaissement/cotisation/" + id,
    method: "GET",
  });
}
export function getCompteBancaire() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/compteBancaires?page=0&sort=code&direction=asc",
    method: "GET",
  });
}
export function getPrelevement() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/cotisations?page=0",
    method: "GET",
  });
}

export function AnnulationCotisation(id, cotisationRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/annulationCotisation/" + id,
    data: cotisationRequest,
    method: "POST",
  });
}

export function getEmissionGlobale(
  partenaireid,
  produitId,
  searchStartDate,
  searchEndDate
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/cotisation/emissionGlobale/" +
      partenaireid +
      "/" +
      produitId +
      "/" +
      searchStartDate +
      "/" +
      searchEndDate,
    method: "GET",
  });
}

export function validationGlobaleCotisation(
  cotisationList,
  dataCalcule,
  Reference
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log("dataCalculé API: ", dataCalcule[0]);
  console.log("Reference API: ", Reference);
  return request({
    url: API_BASE_URL + "/private/cotisation/validationGlobale",
    data: {
      listCotisation: cotisationList,
      createEmissionGlobale: dataCalcule[0],
      reference: Reference,
    },
    method: "PUT",
  });
}

export function findCotisationsByNumeroLot(numeroLot) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/cotisation/findLot/" + numeroLot,
    method: "GET",
  });
}

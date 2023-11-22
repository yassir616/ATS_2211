import {
  API_BASE_URL,
  ACCESS_TOKEN,
  REQUEST as request
} from "../../../constants/index";

export function getPrestation() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL + "/private/typeprestation/?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function updateMontant(
  idDetail,
  numeroSinistre,
  montantHonoraire,
  typeFiscal
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log("test data 2");
  console.log(
    idDetail + " " + numeroSinistre + " " + montantHonoraire + " " + typeFiscal
  );
  return request({
    url:
      API_BASE_URL +
      "/private/updateMontant?idDetail=" +
      idDetail +
      "&numeroSinistre=" +
      numeroSinistre +
      "&montantHonoraire=" +
      montantHonoraire +
      "&typeFiscal=" +
      typeFiscal,
    method: "PUT"
  });
}

export function updateStatus(updatedStatus, statusId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/updatestatus/" + statusId,
    method: "PUT",
    data: updatedStatus
  });
}
export function updatePrestation(prestationId, updatedPrestation) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/typeprestation/" + prestationId,
    method: "PUT",
    data: updatedPrestation
  });
}
export function ajoutPrestation(prestationRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/typeprestation",
    method: "POST",
    data: prestationRequest
  });
}
export function getTypePrestation() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/typeprestation?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function getTypePrestationFamille(famille) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/typeprestationFamille/" + famille,
    method: "GET"
  });
}

export function virement2(data) {
  console.log("good");
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/virement2",
    method: "POST",
    data: data
  });
}

export function cheque2(data) {
  console.log("good");
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/cheque2",
    method: "POST",
    data: data
  });
}

export function getPrestationStatus() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/prestation-status",
    method: "GET"
  });
}
export function updatePrestationSinistre(updatedSinistre, id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/updateSinistre/" + id,
    method: "PUT",
    data: updatedSinistre
  });
}
export function ajoutPrestationRachatTotal(requestModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/addPrestationRachatTotal",
    data: requestModel,
    method: "POST"
  });
}
export function getPrestationRachatTotal(contratId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/getPrestationsRachatTotal/" + contratId,
    method: "GET"
  });
}
export function getPrestationSearch(
  auxiliaire,
  status,
  produit,
  typeAuxiliaire,
  nomParticipant,
  contrat
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/prestation-honoraire-auxiliare?auxiliaire=" +
      auxiliaire +
      "&status=" +
      status +
      "&produit=" +
      produit +
      "&type-auxiliaire=" +
      typeAuxiliaire +
      "&participant=" +
      nomParticipant +
      "&contrat=" +
      contrat,
    method: "GET"
  });
}
export function setPrestationStatut(id, statut) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/reglement/" + id + "/" + statut,
    method: "GET"
  });
}

export function addPrestationHonoraire(
  ModeReglement,
  Auxiliaire,
  statut,
  model
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/reglementHonoraire/" +
      ModeReglement +
      "/" +
      Auxiliaire +
      "/" +
      statut,
    data: model,
    method: "POST"
  });
}

export function lettreRegHonoraire(lettreRequest, rapport, modeReglement) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/lettreRequest/pdf?path=" +
      rapport +
      "&modeReglement=" +
      modeReglement,
    method: "POST",
    data: lettreRequest,
    responseType: "blob"
  });
}

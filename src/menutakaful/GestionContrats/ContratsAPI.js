import {
  API_BASE_URL,
  ACCESS_TOKEN,
  REQUEST as request,
  UserID
} from "../../constants/index";

export function createContratDeces(body) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/decescontrat",
    data: body,
    method: "POST"
  });
}
export function createContratRetrait(body) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/retraitcontrat",
    data: body,
    method: "POST"
  });
}
export function getDecesContrat(status, page, limit, sort, direction) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/decescontrat/status/" +
      status +
      "?page=" +
      page +
      "&limit=" +
      limit +
      "&sort=" +
      sort +
      "&direction=" +
      direction,
    method: "GET"
  });
}
export function getDecesContrats(page, limit, sort, direction) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/decescontrat/" +
      "?page=" +
      page +
      "&limit=" +
      limit +
      "&sort=" +
      sort +
      "&direction=" +
      direction,
    method: "GET"
  });
}

export function getDecesContratsByPartenaire(page, limit, sort, direction) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/decescontrats/" +
      "?page=" +
      page +
      "&limit=" +
      limit +
      "&sort=" +
      sort +
      "&direction=" +
      direction,
    method: "GET"
  });
}

export function getRetraiteContrat(status, page, limit) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/retraitcontrat?sort=id&direction=asc&page=" +
      page +
      "&limit=" +
      limit,
    method: "GET"
  });
}
export function searchContrat(page, limit, searchby, searchfor) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/contrat/search?page=" +
      page +
      "&limit=" +
      limit +
      "&by=" +
      searchby +
      "&for=" +
      searchfor,
    method: "GET"
  });
}
export function searchRetraitContrat(page, limit, searchby, searchfor) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/retraitcontrat/search?page=" +
      page +
      "&limit=" +
      limit +
      "&by=" +
      searchby +
      "&for=" +
      searchfor,
    method: "GET"
  });
}
export function addContratMrb(model) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/contratMrb",
    data: model,
    method: "POST"
  });
}
export function getAllContratMrb() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/contratMrbs?page=0&sort=numeroContrat&direction=asc",
    method: "GET"
  });
}
export function updateDecesContratStatus(id, updatedStatus) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/decescontratStatus/" + id,
    data: updatedStatus,
    method: "PUT"
  });
}

export function updateContratDateEffetAPI(id, updatedDateEffet) {
 
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/updateContratDateEffet/" + id,
    data: updatedDateEffet,
    method: "PUT"
  });
}

export function updateRetraiteContratStatus(id, updatedStatus) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  } else {
    return request({
      url: API_BASE_URL + "/private/decescontratStatus/" + id,
      data: updatedStatus,
      method: "PUT"
    });
  }
}
export function searchContratMrb(page, limit, searchby, searchfor) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/contratMrb/search?page=" +
      page +
      "&limit=" +
      limit +
      "&by=" +
      searchby +
      "&for=" +
      searchfor,
    method: "GET"
  });
}
export function getPeriodicite() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/periodicite?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function addBeneficiaire(beneficiareResponseModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/beneficiaireendeces",
    data: beneficiareResponseModel,
    method: "POST"
  });
}
export function editBeneficiaire(id, beneficiareToUpdate) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/beneficiaireendeces/" + id,
    data: beneficiareToUpdate,
    method: "PUT"
  });
}
export function getBeneficiaireById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/beneficiaireendeces/" + id,
    method: "GET"
  });
}

export function updateContartDeces(id, changementCapitaleDureeUpdateModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/decescontrat/" + id,
    method: "PUT",
    data: changementCapitaleDureeUpdateModel
  });
}
export function getBConditionGenerale(partenaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/conditionGeneral/pdf/" + partenaire,
    method: "GET",
    responseType: "blob"
  });
}

export function getConsumeDataByCodeClientOrRefDossier(refDossierOrCodeClient) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/consumeData/refDossier?ref=" +
      refDossierOrCodeClient,
    method: "GET"
  });
}
export function getDataFromBankingWebService(partenaireCode, refDossier) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/getDataByPartenaire?partenaireCode=" +
      partenaireCode +
      "&referenceDossier=" +
      refDossier,
    method: "GET"
  });
}

export function getProduitByCode(codeProduit) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/produitByCode?code=" + codeProduit,
    method: "GET"
  });
}
export function getTypePersonneMoraleByLibelle(libelle) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/typePersonneMoraleByLibelle?libelle=" + libelle,
    method: "GET"
  });
}

export function getSecteurActiviteByLibelle(libelle) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/secteurByLibelle?libelle=" + libelle,
    method: "GET"
  });
}
export function getTypePersonneMoralByLibelle(libelle) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/typePersonneMoraleByLibelle?libelle=" + libelle,
    method: "GET"
  });
}
export function getPeriodiciteByAbreviation(abbreviation) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/periodiciteByAbb?abreviation=" + abbreviation,
    method: "GET"
  });
}
export function cpMrb(cpModel) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/cpMrb/pdf",
    method: "POST",
    data: cpModel,
    responseType: "blob"
  });
}
export function postFile(file) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/upload",
    method: "POST",
    data: file,
    headers: {
      Authorization: localStorage.getItem(ACCESS_TOKEN),
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>"
    }
    // responseType: "blob"
  });
}
export function getAcceptationByContrat(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptationContrat/" + id,
    method: "GET"
  });
}

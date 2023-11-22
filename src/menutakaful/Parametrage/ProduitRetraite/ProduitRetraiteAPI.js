import { API_BASE_URL,REQUEST as request,ACCESS_TOKEN  } from "../../../constants/index";
export function getRetraiteProduit() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url:
        API_BASE_URL + "/private/retraitproduit?page=0&sort=code&direction=asc",
      method: "GET",
    });
  }
  export function getRetraiteProduitByCode(codeProduit) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url: API_BASE_URL + "/private/retraitproduit/code/" + codeProduit,
      method: "GET",
    });
  }
  export function ajoutRetraitProduit(productRequest) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
  
    return request({
      url: API_BASE_URL + "/private/retraitproduit",
      data: productRequest,
      method: "POST",
    });
  }
  export function updateRetraiteProduct(productId, updatedProduct) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
  
    return request({
      url: API_BASE_URL + "/private/retraitproduit/" + productId,
      method: "PUT",
      data: updatedProduct,
    });
  }export function getRetraiteContratByNumeroContrat(numero) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url: API_BASE_URL + "/private/retraitcontratbynumero/" + numero,
      method: "GET",
    });
  }
  export function getPoolInvestissment() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url:
        API_BASE_URL +
        "/private/poolinvestissment?page=0&sort=libelle&direction=asc",
      method: "GET",
    });
  }
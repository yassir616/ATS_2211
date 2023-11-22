import React from "react";
import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../../constants/index";
import { Form, Select } from "antd";
const { Option } = Select;
export function getDecesProduit() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/decesproduit?page=0&sort=code&direction=asc",
    method: "GET"
  });
}
export function ajoutDecesProduit(productRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/decesproduit",
    data: productRequest,
    method: "POST"
  });
}
export function updateDecesProduct(productId, updatedProduct) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/decesproduit/" + productId,
    method: "PUT",
    data: updatedProduct
  });
}
export function getTarification(
  duree,
  age,
  capital,
  differe,
  typeProduit,
  decesProduit
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/tarrification?age=" +
      age +
      "&duree=" +
      duree +
      "&differe=" +
      differe +
      "&capitale=" +
      capital +
      "&type=" +
      typeProduit +
      "&deceProduit=" +
      decesProduit,
    method: "GET"
  });
}
export function getFamilleProduitByName(name) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/familleProduit/" + name,
    method: "GET"
  });
}
export function getRisque(theme) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/risque?page=0&sort=libelle&direction=asc&theme=" +
      theme,
    method: "GET"
  });
}
export function getCategorie() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/categorie?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function getNormeById(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/normeSelection?id=" + id,
    method: "GET"
  });
}

export function updateNorme(id, updatedNorme) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/normeSelection/" + id,
    method: "PUT",
    data: updatedNorme
  });
}
export function getFamilleProduit() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL + "/private/familleproduit?page=0&sort=name&direction=asc",
    method: "GET"
  });
}
export function selectStepZero(
  label,
  field,
  fieldDecorater,
  mappped,
  change,
  elementToReturn
) {
  let fieldSelect = field;
  return (
    <Form.Item label={label} hasFeedback>
      {fieldDecorater(fieldSelect, {
        rules: [
          {
            required: true,
            message: "Choisissez un element"
          }
        ]
      })(
        <Select placeholder="-sélectionnez -" onChange={change}>
          {mappped.map(element => {
            switch (elementToReturn) {
              case "risque":
                return (
                  <Option value={element.id} label={element.name}>
                    {element.name}
                  </Option>
                );
              case "categorie":
                return (
                  <Option value={element.id} label={element.libelle}>
                    {element.libelle}
                  </Option>
                );
              case "partenaire":
                return (
                  <Option value={element.id} label={element.raisonSocial}>
                    {element.raisonSocial}
                  </Option>
                );
              default:
                return null;
            }
          })}
        </Select>
      )}
    </Form.Item>
  );
}
export function getSousCategorie() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/souscategorie?page=0&sort=code&direction=asc",
    method: "GET"
  });
}

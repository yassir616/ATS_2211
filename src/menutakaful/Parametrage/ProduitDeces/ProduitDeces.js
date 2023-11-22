/* eslint-disable react/prop-types */
import "./ProduitDeces.css";
import "antd/dist/antd.css";

import { notification, Steps } from "antd";
import React, { Component } from "react";

import ComponentTitle from "../../../util/Title/ComponentTitle";
import StepFive from "./Steps/StepFive";
import StepFour from "./Steps/StepFour";
import StepOne from "./Steps/StepOne";
import StepTarification from "./Steps/StepTarification";
import StepThree from "./Steps/StepThree";
import StepTwo from "./Steps/StepTwo";
import StepZero from "./Steps/StepZero";
import { ajoutDecesProduit, getFamilleProduitByName } from "./ProduitDecesAPI";

const { Step } = Steps;
let name = "Deces";
class ProduitDeces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      prestation: {},
      modalites: {},
      restitutionList: {},
      normesSelection: {},
      commission: {},
      reference: {},
      type: "",
      tarrificationL: {},
      familleProduit: "",
      optionAssurance: {},
      champs: {},
      typeRisque: [],
      fields: {
        ///////////Step0//////////////////////

        risque: { value: "" },
        categorie: { value: "" },
        partenaire: { value: "" },
        sousCategorie: { value: "" },

        ///////////Step1///////////////////////

        libelle: { value: "" },
        code: { value: "" },
        numeroHomologation: { value: "" },
        dateHomologation: { value: "" },
        periodicites: {},

        ////////////////Step2////////////////

        fraisGestion: { value: "" },
        fraisAcquisition: { value: "" },
        differeMin: { value: "" },
        differeMax: { value: "" },
        dureeMin: { value: "" },
        dureeMax: { value: "" },
        ageMin: { value: "" },
        ageVisite: { value: "" },
        tvaFraisAcquisition: { value: "" },
        tvaFraisGestion: { value: "" },
        delaiSansSouscription: { value: "" },
        delaiEnAttente: { value: "" },
        ageMaxEligibilite: { value: "" },
        echeanceImpayees: { value: "" },
        taxe: { value: "" },
        taxeParafiscale: { value: "" },
        montantAccessoire: { value: "" },
        plafondFrais: { value: "" },
        exclusion: {},
        delai: { value: "" },
        type: { value: "" },
        piece: { value: "" },
        visibilite: { value: "" },

        /////////////////////Step3/////////////

        seuilConseil: { value: "" },
        seuilExaminateur: { value: "" },
        seuilReassurance: { value: "" },
        delaiPreavis: { value: "" },
        delaiResiliation: { value: "" },

        //////////////Step4//////////////////

        restitutionPiece: [],

        ///////////////////////Step5////////

        ageEcheance: { value: "" },

        numeroCompte: { value: "" },

        codeCompte: { value: "" },

        libelleAgence: { value: "" },

        pointVente: {},

        commissions: [],

        tarrification: []
      }
    };
  }
  componentDidMount() {
    this.getFamilleProduit(name);
    console.log("fields:", this.state.fields);
  }
  async getFamilleProduit(id) {
    let response = await getFamilleProduitByName(id);
    this.setState({
      familleProduit: response.data
    });
  }
  checkCurrent = compteur => {
    this.setState({ current: compteur });
  };
  checkCurrentZero = (risque, compteur) => {
    this.setState({ current: compteur, typeRisque: risque });
  };
  checkSelectedLists = (arrayPrestation, arrayModalites, compteur) => {
    this.setState({
      modalites: arrayModalites,
      prestation: arrayPrestation,
      current: compteur
    });
  };

  checkSelectedRest = (arrayRestitution, compteur, arrayNormes) => {
    this.setState({
      restitutionList: arrayRestitution,
      current: compteur,
      normesSelection: arrayNormes
    });
  };

  checkTarification = (tarrificationList, typeTar, compteur) => {
    console.log("tarif:", tarrificationList);
    this.setState(
      { tarrificationL: tarrificationList, type: typeTar, current: compteur },
      () => {
        this.handleSubmit();
      }
    );
  };
  checkSelectedTar = (dataCommission, dataReference, dataOption, compteur) => {
    this.setState(
      {
        reference: dataReference,
        commission: dataCommission,
        optionAssurance: dataOption,
        current: compteur
      },
      () => {
        this.handleSubmit();
      }
    );
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  handleSubmit() {
    if (this.state.current === 6) {
      let exclus = [];
      this.state.fields.exclusion.value.forEach(element => {
        exclus.push({ id: element });
      });
      let periodicit = [];
      this.state.fields.periodicites.value.forEach(element => {
        periodicit.push({ id: element });
      });
      let point = [];
      this.state.reference.pointVente.forEach(element => {
        point.push({ id: element });
      });
      let productRequest = {};
      if (this.state.fields.visibilite.value === true) {
        productRequest = {
          code: this.state.fields.code.value,
          libelle: this.state.fields.libelle.value,
          numeroHomologation: this.state.fields.numeroHomologation.value,
          dateHomologation: this.state.fields.dateHomologation.value,
          fraisGestion: this.state.fields.fraisGestion.value,
          fraisAcquisition: this.state.fields.fraisAcquisition.value,
          tvaFraisGestion: this.state.fields.tvaFraisGestion.value,
          tvaFraisAcquisition: this.state.fields.tvaFraisAcquisition.value,
          plafondFrais: this.state.fields.plafondFrais.value,
          taxe: this.state.fields.taxe.value,
          taxeParaFiscale: this.state.fields.taxeParafiscale.value,
          delaiResiliation: this.state.modalites.delaiResiliation,
          delaiPreavis: this.state.modalites.delaiPreavis,
          delaiSansSouscription: this.state.fields.delaiSansSouscription.value,
          delaiEnAttente: this.state.fields.delaiEnAttente.value,
          seuilConseil: this.state.modalites.seuilConseil,
          seuilExaminateur: this.state.modalites.seuilExaminateur,
          seuilReassurance: this.state.modalites.seuilReassurance,
          dureeMax: this.state.fields.dureeMax.value,
          dureeMin: this.state.fields.dureeMin.value,
          differeMax: this.state.fields.differeMax.value,
          differeMin: this.state.fields.differeMin.value,
          ageMaxEligibilite: this.state.fields.ageMaxEligibilite.value,
          echeanceImpayees: this.state.fields.echeanceImpayees.value,
          ageMin: this.state.fields.ageMin.value,
          ageVisite: this.state.fields.ageVisite.value,
          numeroCompte: this.state.reference.numeroCompte,
          codeCompte: this.state.reference.codeCompte,
          libelleCompte: this.state.reference.libelleAgence,
          ageEcheance: this.state.reference.ageEcheance,
          responsableProduction: this.state.reference.responsableProduction,
          responsablePrestation: this.state.reference.responsablePrestation,
          exclusions: exclus,
          periodicites: periodicit,
          pointVentes: point,
          risqueId: this.state.fields.risque.value,
          categorieId: this.state.fields.categorie.value,
          partenaireId: this.state.fields.partenaire.value,
          sousCategorieId: this.state.fields.sousCategorie.value,
          commissions: this.state.commission,
          tarrifications: this.state.tarrificationL,
          decesCauseRestitution: this.state.restitutionList,
          normes: this.state.normesSelection,
          prestations: this.state.prestation,
          options: this.state.optionAssurance,
          produitType: this.state.type.toLowerCase(),
          familleId: this.state.familleProduit,
          montantAccessoire: this.state.fields.montantAccessoire.value
        };
      } else {
        productRequest = {
          code: this.state.fields.code.value,
          libelle: this.state.fields.libelle.value,
          numeroHomologation: this.state.fields.numeroHomologation.value,
          dateHomologation: this.state.fields.dateHomologation.value,
          fraisGestion: this.state.fields.fraisGestion.value,
          fraisAcquisition: this.state.fields.fraisAcquisition.value,
          tvaFraisGestion: this.state.fields.tvaFraisGestion.value,
          tvaFraisAcquisition: this.state.fields.tvaFraisAcquisition.value,
          plafondFrais: this.state.fields.plafondFrais.value,
          taxe: this.state.fields.taxe.value,
          taxeParaFiscale: this.state.fields.taxeParafiscale.value,
          delaiResiliation: this.state.modalites.delaiResiliation,
          delaiPreavis: this.state.modalites.delaiPreavis,
          delaiSansSouscription: this.state.fields.delaiSansSouscription.value,
          delaiEnAttente: this.state.fields.delaiEnAttente.value,
          seuilConseil: this.state.modalites.seuilConseil,
          seuilExaminateur: this.state.modalites.seuilExaminateur,
          seuilReassurance: this.state.modalites.seuilReassurance,
          dureeMax: this.state.fields.dureeMax.value,
          dureeMin: this.state.fields.dureeMin.value,
          differeMax: this.state.fields.differeMax.value,
          differeMin: this.state.fields.differeMin.value,
          ageMaxEligibilite: this.state.fields.ageMaxEligibilite.value,
          ageMin: this.state.fields.ageMin.value,
          ageVisite: this.state.fields.ageVisite.value,
          numeroCompte: this.state.reference.numeroCompte,
          codeCompte: this.state.reference.codeCompte,
          libelleCompte: this.state.reference.libelleAgence,
          ageEcheance: this.state.reference.ageEcheance,
          exclusions: exclus,
          periodicites: periodicit,
          pointVentes: point,
          responsableProduction: this.state.reference.responsableProduction,
          responsablePrestation: this.state.reference.responsablePrestation,
          risqueId: this.state.fields.risque.value,
          categorieId: this.state.fields.categorie.value,
          partenaireId: this.state.fields.partenaire.value,
          sousCategorieId: this.state.fields.sousCategorie.value,
          commissions: this.state.commission,
          tarrifications: this.state.tarrificationL,
          decesCauseRestitution: this.state.restitutionList,
          normes: this.state.normesSelection,
          prestations: this.state.prestation,
          options: this.state.optionAssurance,
          produitType: this.state.type.toLowerCase(),
          familleId: this.state.familleProduit,
          montantAccessoire: this.state.fields.montantAccessoire.value
        };
      }
      console.log("request:", productRequest);
      debugger;
      ajoutDecesProduit(productRequest)
        .then(response => {
          notification.success({
            message: "TAKAFUL",
            description: "L'insertion est bien faite"
          });
          this.props.record.history.push("/consultproduitdeces");
        })
        .catch(error => {
          if (error.response.data.message === "400 product already exists") {
            notification.error({
              message: "TAKAFUL",
              description: "Ce produit existe déjà"
            });
          } else if (error.response.data.status === 400) {
            notification.error({
              message: "TAKAFUL",
              description: "Merci de vérifier le type des champs"
            });
          } else {
            notification.error({
              message: "TAKAFUL",
              description: "l'insertion est mal passée Merci de réessayer"
            });
          }
        });
    }
  }

  render() {
    const { current, fields, modalites, typeRisque } = this.state;
    const steps = [
      {
        title: "Etape 1",
        content: (
          <StepZero
            check={this.checkCurrentZero}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Informations"
      },
      {
        title: "Etape 2",
        content: (
          <StepOne
            check={this.checkCurrent}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Informations générales"
      },
      {
        title: "Etape 3",
        content: (
          <StepTwo
            check={this.checkCurrent}
            {...fields}
            risque={typeRisque}
            onChange={this.handleFormChange}
          />
        ),
        description: "Paramètres globaux"
      },
      {
        title: "Etape 4",
        content: (
          <StepTarification
            check={this.checkTarification}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Tarification"
      },
      {
        title: "Etape 5",
        content: (
          <StepThree
            check={this.checkSelectedLists}
            {...modalites}
            onChange={this.handleFormChange}
          />
        ),
        description: "Modalités prestations"
      },
      {
        title: "Etape 6",
        content: (
          <StepFour
            check={this.checkSelectedRest}
            {...fields}
            dataProp={this.state.modalites}
            onChange={this.handleFormChange}
          />
        ),
        description: "Norme Sélection/Restitution"
      },
      {
        title: "Etape 7",
        content: (
          <StepFive
            check={this.checkSelectedTar}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Edition"
      }
    ];

    return (
      <div>
        <ComponentTitle title="Nouveau produit" />
        <Steps current={current}>
          {steps.map(item => (
            <Step
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </Steps>
        <div className="steps-content-style">{steps[current].content}</div>
      </div>
    );
  }
}

export default ProduitDeces;

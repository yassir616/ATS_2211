import "./ProduitRetraite.css";

import { Button, notification, Steps } from "antd";
import React from "react";
import {
  formatDateToFormatOne,
  formatDateToFormatTwo
} from "../../../util/Helpers";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import StepModalite from "./Steps/StepModalite";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import StepZero from "./Steps/StepZero";
import { ajoutRetraitProduit } from "./ProduitRetraiteAPI";

const { Step } = Steps;

class ProduitRetraite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      fields: {
        //--------------Step 0------------------//
        risque: { value: "" },
        categorie: { value: "" },
        partenaire: { value: "" },
        //--------------Step 1-----------------//
        libelle: { value: "" },
        code: { value: "" },
        numeroHomologation: { value: "" },
        dateHomologation: { value: "" },
        periodicites: {},
        fraisGestion: { value: "" },
        fraisAcquisition: { value: "" },
        tvaFraisGestion: { value: "" },
        taxe: { value: "" },
        tvaFraisAcquisition: { value: "" },
        //--------------Step 2-----------------//
        rachatTotal: { value: false },
        dureeMinimalSouscriptionAvantRachatTotal: { value: "" },
        conditionDisciplinaireTotale: { value: false },
        natureConditionDisciplinaireTotale: { value: "" },
        valeurConditionDisciplinaireTotale: { value: "" },
        rachatPartiel: { value: false },
        maximumMontantRachatPartiel: { value: "" },
        nombreMaximumRachatPartiel: { value: "" },
        dureeMinimalSouscriptionAvantRachatPartiel: { value: "" },
        conditionDisciplinairePartiel: { value: false },
        natureConditionDisciplinairePartiel: { value: "" },
        valeurConditionDisciplinairePartiel: { value: "" },
        //--------------Step 3-----------------//
        numeroCompte: { value: "" },
        libelleCompte: { value: "" },
        dureeMinimalSouscription: { value: "" },
        renouvellementContratTaciteReconduction: { value: false },
        montantMinContribution: { value: "" },
        tauxRendementAvantImposition: { value: "" },
        poolInvestissment: {},
        natureFiscale: { value: "" },
        revenuGlobal: { value: "" },
        regimeFiscal: { value: "" },
        modeGestion: { value: "" },
        fraisFixeWakalabilIstithmar: { value: "" },
        surperformanceWakalabilIstithmar: { value: "" },
        profitMoudaraba: { value: "" },
        modeCalculCapitalConstitue: { value: "" },
        visibilite: { value: false }
      }
    };
  }

  checkCurrent = compteur => {
    this.setState({ current: compteur });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };
  submit = () => {
    const fields = this.state.fields;

    let productToSend = {};
    productToSend.categorie = {
      id: fields.categorie.value
    };
    productToSend.code = fields.code.value;
    productToSend.conditionDisciplinairePartiel =
      fields.conditionDisciplinairePartiel.value;
    productToSend.conditionDisciplinaireTotale =
      fields.conditionDisciplinaireTotale.value;
    productToSend.creationDate = formatDateToFormatOne(new Date());
    productToSend.dateHomologation = formatDateToFormatTwo(
      fields.dateHomologation.value.toDate()
    );
    productToSend.dateModification = "";
    productToSend.dureeMinimalSouscription =
      fields.dureeMinimalSouscription.value;
    productToSend.dureeMinimalSouscriptionAvantRachatPartiel =
      fields.dureeMinimalSouscriptionAvantRachatPartiel.value;
    productToSend.dureeMinimalSouscriptionAvantRachatTotal =
      fields.dureeMinimalSouscriptionAvantRachatTotal.value;
    productToSend.fraisAcquisition = fields.fraisAcquisition.value;
    productToSend.fraisFixeWakalabilIstithmar =
      fields.fraisFixeWakalabilIstithmar.value;
    productToSend.fraisGestion = fields.fraisGestion.value;
    productToSend.libelle = fields.libelle.value;
    productToSend.libelleCompte = fields.libelleCompte.value;
    productToSend.maximumMontantRachatPartiel =
      fields.maximumMontantRachatPartiel.value;
    productToSend.modeCalculCapitalConstitue =
      fields.modeCalculCapitalConstitue.value;
    productToSend.modeGestion = fields.modeGestion.value;
    productToSend.montantMinContribution = fields.montantMinContribution.value;
    productToSend.natureConditionDisciplinairePartiel =
      fields.natureConditionDisciplinairePartiel.value;
    productToSend.natureConditionDisciplinaireTotale =
      fields.natureConditionDisciplinaireTotale.value;
    productToSend.natureFiscale = fields.natureFiscale.value;
    productToSend.nombreMaximumRachatPartiel =
      fields.nombreMaximumRachatPartiel.value;
    productToSend.numeroCompte = fields.numeroCompte.value;
    productToSend.numeroHomologation = fields.numeroHomologation.value;
    productToSend.partenaire = {
      id: fields.partenaire.value
    };
    productToSend.periodicites = fields.periodicites.value.map(e => {
      return {
        id: e
      };
    });
    productToSend.poolInvestissment = fields.poolInvestissment.value.map(e => {
      return {
        id: e
      };
    });
    productToSend.profitMoudaraba = fields.profitMoudaraba.value;
    productToSend.rachatPartiel = fields.rachatPartiel.value;
    productToSend.rachatTotal = fields.rachatTotal.value;
    productToSend.regimeFiscal = fields.regimeFiscal.value;
    productToSend.renouvellementContratTaciteReconduction =
      fields.renouvellementContratTaciteReconduction.value;
    productToSend.revenuGlobal = fields.revenuGlobal.value;
    productToSend.risque = {
      id: fields.risque.value
    };
    productToSend.surperformanceWakalabilIstithmar =
      fields.surperformanceWakalabilIstithmar.value;
    productToSend.tauxRendementAvantImposition =
      fields.tauxRendementAvantImposition.value;
    productToSend.taxe = fields.taxe.value;
    productToSend.tvaFraisAcquisition = fields.tvaFraisAcquisition.value;
    productToSend.tvaFraisGestion = fields.tvaFraisGestion.value;
    productToSend.valeurConditionDisciplinairePartiel =
      fields.valeurConditionDisciplinairePartiel.value;
    productToSend.valeurConditionDisciplinaireTotale =
      fields.valeurConditionDisciplinaireTotale.value;

    ajoutRetraitProduit(productToSend)
      .then(value => {
        notification.open({
          message: "Votre Produit Retraite a été bien crée!",
          btn: btn,
          duration: null
        });
      })
      .catch(e => {
        notification.open({
          message: "Erreur issue lors de la création du produit : " + e.message
        });
      });

    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => window.open("/consultproduitretraite", "_self")}
      >
        Confirmer
      </Button>
    );
  };

  render() {
    const { current, fields } = this.state;
    const steps = [
      {
        title: "Etape 1",
        content: (
          <StepZero
            check={this.checkCurrent}
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
          <StepModalite
            check={this.checkCurrent}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Modalités de rachat"
      },
      {
        title: "Etape 4",
        content: (
          <StepTwo
            check={this.checkCurrent}
            {...fields}
            onChange={this.handleFormChange}
            submit={this.submit}
          />
        ),
        description: "Paramètres globaux"
      }
    ];
    return (
      <div>
        <ComponentTitle title="Nouveau produit investissement" />
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

export default ProduitRetraite;

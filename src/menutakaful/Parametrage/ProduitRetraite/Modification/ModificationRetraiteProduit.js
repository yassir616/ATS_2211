/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Button, Icon, notification, Steps } from "antd";
import React, { Component } from "react";
import { formatDateToFormatOne } from "../../../../util/Helpers";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import { getHonoraire } from "../../Honoraires/HonorairesAPI";
import { updateRetraiteProduct } from "../ProduitRetraiteAPI";

const { Step } = Steps;
let Hon = {};
class ModificationRetraiteProduit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      honoraire: {},
      fields: {
        // ///////////Step1//////////////////////
        risque: { value: this.props.record.location.state.record.risque.id },
        categorie: {
          value: this.props.record.location.state.record.categorie.id
        },
        partenaire: {
          value: this.props.record.location.state.record.partenaire.id
        },
        periodicites: {
          value: this.props.record.location.state.record.periodicites.map(
            element => {
              return element.id;
            }
          )
        },
        numeroHomologation: {
          value: this.props.record.location.state.record.numeroHomologation
        },
        dateHomologation: {
          value: this.props.record.location.state.record.dateHomologation
        },
        libelle: { value: this.props.record.location.state.record.libelle },
        code: { value: this.props.record.location.state.record.code },
        fraisGestion: {
          value: this.props.record.location.state.record.fraisGestion
        },
        fraisAcquisition: {
          value: this.props.record.location.state.record.fraisAcquisition
        },
        tvaFraisAcquisition: {
          value: this.props.record.location.state.record.tvaFraisAcquisition
        },
        tvaFraisGestion: {
          value: this.props.record.location.state.record.tvaFraisGestion
        },
        montantAccessoire: {
          value: this.props.record.location.state.record.montantAccessoire
        },
        taxe: { value: this.props.record.location.state.record.taxe },
        rachatTotal: {
          value: this.props.record.location.state.record.rachatTotal
        },

        dureeMinimalSouscriptionAvantRachatTotal: {
          value: this.props.record.location.state.record
            .dureeMinimalSouscriptionAvantRachatTotal
        },
        conditionDisciplinaireTotale: {
          value: this.props.record.location.state.record
            .conditionDisciplinaireTotale
        },
        natureConditionDisciplinaireTotale: {
          value: this.props.record.location.state.record
            .natureConditionDisciplinaireTotale
        },
        valeurConditionDisciplinaireTotale: {
          value: this.props.record.location.state.record
            .valeurConditionDisciplinaireTotale
        },
        rachatPartiel: {
          value: this.props.record.location.state.record.rachatPartiel
        },
        dureeMinimalSouscriptionAvantRachatPartiel: {
          value: this.props.record.location.state.record
            .dureeMinimalSouscriptionAvantRachatPartiel
        },
        conditionDisciplinairePartiel: {
          value: this.props.record.location.state.record
            .conditionDisciplinairePartiel
        },
        natureConditionDisciplinairePartiel: {
          value: this.props.record.location.state.record
            .natureConditionDisciplinairePartiel
        },
        valeurConditionDisciplinairePartiel: {
          value: this.props.record.location.state.record
            .valeurConditionDisciplinairePartiel
        },
        maximumMontantRachatPartiel: {
          value: this.props.record.location.state.record
            .maximumMontantRachatPartiel
        },
        nombreMaximumRachatPartiel: {
          value: this.props.record.location.state.record
            .nombreMaximumRachatPartiel
        },

        numeroCompte: {
          value: this.props.record.location.state.record.numeroCompte
        },
        libelleCompte: {
          value: this.props.record.location.state.record.libelleCompte
        },
        natureFiscale: {
          value: this.props.record.location.state.record.natureFiscale
        },
        revenuGlobal: {
          value: this.props.record.location.state.record.revenuGlobal
        },
        tauxRendementAvantImposition: {
          value: this.props.record.location.state.record
            .tauxRendementAvantImposition
        },
        dureeMinimalSouscription: {
          value: this.props.record.location.state.record
            .dureeMinimalSouscription
        },
        renouvellementContratTaciteReconduction: {
          value: this.props.record.location.state.record
            .renouvellementContratTaciteReconduction
        },
        montantMinContribution: {
          value: this.props.record.location.state.record.montantMinContribution
        },
        modeGestion: {
          value: this.props.record.location.state.record.modeGestion
        },
        fraisFixeWakalabilIstithmar: {
          value: this.props.record.location.state.record
            .fraisFixeWakalabilIstithmar
        },
        surperformanceWakalabilIstithmar: {
          value: this.props.record.location.state.record
            .surperformanceWakalabilIstithmar
        },
        profitMoudaraba: {
          value: this.props.record.location.state.record.profitMoudaraba
        },
        modeCalculCapitalConstitue: {
          value: this.props.record.location.state.record
            .modeCalculCapitalConstitue
        },
        regimeFiscal: {
          value: this.props.record.location.state.record.regimeFiscal
        },
        poolInvestissment: {
          value: this.props.record.location.state.record.poolInvestissment.map(
            element => {
              return element.id;
            }
          )
        }
      }
    };
  }
  componentDidMount() {
    this.getAllHonoraire();
  }
  async getAllHonoraire() {
    let response = await getHonoraire();
    Hon = response.data.content;
  }

  checkForm1Validity() {
    return (
      this.state.fields.libelle.value !== "" &&
      this.state.fields.code.value !== "" &&
      this.state.fields.fraisAcquisition.value !== "" &&
      this.state.fields.fraisGestion.value !== "" &&
      this.state.fields.taxe.value !== "" &&
      this.state.fields.tvaFraisAcquisition.value !== "" &&
      this.state.fields.tvaFraisGestion.value !== "" &&
      this.state.fields.periodicites.value.length !== 0
    );
  }
  checkForm2Validity() {
    let checkRachatPartiel = true;
    let checkRachatTotal = true;
    if (this.state.fields.rachatTotal.value) {
      if (
        this.state.fields.natureConditionDisciplinaireTotale.value !== "ASAISIR"
      ) {
        checkRachatTotal =
          this.state.fields.dureeMinimalSouscriptionAvantRachatTotal.value !==
            "" &&
          this.state.fields.valeurConditionDisciplinaireTotale.value !== "";
      }
    }

    if (this.state.fields.rachatPartiel.value) {
      if (
        this.state.fields.natureConditionDisciplinairePartiel.value !==
        "ASAISIR"
      ) {
        checkRachatPartiel =
          this.state.fields.dureeMinimalSouscriptionAvantRachatPartiel.value !==
            "" &&
          this.state.fields.valeurConditionDisciplinairePartiel.value !== "" &&
          this.state.fields.maximumMontantRachatPartiel.value !== "" &&
          this.state.fields.nombreMaximumRachatPartiel.value !== "";
      }
    }
    return checkRachatPartiel && checkRachatTotal;
  }
  checkForm3Validity() {
    let checkMoudaraba,
      checkWakalaBilIstithmar,
      validityOfOtherFields = false;

    checkMoudaraba =
      this.state.fields.modeGestion.value === "MOUDARABA" ? true : false;
    checkWakalaBilIstithmar =
      this.state.fields.modeGestion.value !== "MOUDARABA" ? true : false;

    validityOfOtherFields =
      this.state.fields.libelleCompte.value !== "" &&
      this.state.fields.numeroCompte.value !== "" &&
      this.state.fields.montantMinContribution.value !== "" &&
      this.state.fields.dureeMinimalSouscription.value !== "" &&
      this.state.fields.tauxRendementAvantImposition.value !== "" &&
      this.state.fields.poolInvestissment.value.length !== 0;
    if (checkMoudaraba) {
      return (
        validityOfOtherFields && this.state.fields.profitMoudaraba.value !== ""
      );
    }
    if (checkWakalaBilIstithmar) {
      return (
        validityOfOtherFields &&
        this.state.fields.fraisFixeWakalabilIstithmar.value !== "" &&
        this.state.fields.surperformanceWakalabilIstithmar.value !== ""
      );
    }
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };
  handleSubmit() {
    if (this.state.current === 2) {
      let periodicit = [];
      let poolInvestissments = [];
      this.state.fields.periodicites.value.forEach(element => {
        periodicit.push({ id: element });
      });

      this.state.fields.poolInvestissment.value.forEach(element => {
        poolInvestissments.push({ id: element });
      });

      let productRequest = {
        id: this.props.record.location.state.record.id,
        creationDate: this.props.record.location.state.record.creationDate,
        code: this.state.fields.code.value,
        libelle: this.state.fields.libelle.value,
        fraisGestion: this.state.fields.fraisGestion.value,
        fraisAcquisition: this.state.fields.fraisAcquisition.value,
        tvaFraisGestion: this.state.fields.tvaFraisGestion.value,
        tvaFraisAcquisition: this.state.fields.tvaFraisAcquisition.value,
        periodicites: periodicit,
        risque: {
          id: this.state.fields.risque.value
        },
        categorie: {
          id: this.state.fields.categorie.value
        },
        partenaire: {
          id: this.state.fields.partenaire.value
        },
        rachatTotal: this.state.fields.rachatTotal.value,
        dureeMinimalSouscriptionAvantRachatTotal: this.state.fields
          .dureeMinimalSouscriptionAvantRachatTotal.value,
        conditionDisciplinaireTotale: this.state.fields
          .conditionDisciplinaireTotale.value,
        natureConditionDisciplinaireTotale: this.state.fields
          .natureConditionDisciplinaireTotale.value,
        valeurConditionDisciplinaireTotale: this.state.fields
          .valeurConditionDisciplinaireTotale.value,
        rachatPartiel: this.state.fields.rachatPartiel.value,
        dureeMinimalSouscriptionAvantRachatPartiel: this.state.fields
          .dureeMinimalSouscriptionAvantRachatPartiel.value,
        conditionDisciplinairePartiel: this.state.fields
          .conditionDisciplinairePartiel.value,
        natureConditionDisciplinairePartiel: this.state.fields
          .natureConditionDisciplinairePartiel.value,
        valeurConditionDisciplinairePartiel: this.state.fields
          .valeurConditionDisciplinairePartiel.value,
        maximumMontantRachatPartiel: this.state.fields
          .maximumMontantRachatPartiel.value,
        tauxRendementAvantImposition: this.state.fields
          .tauxRendementAvantImposition.value,
        nombreMaximumRachatPartiel: this.state.fields.nombreMaximumRachatPartiel
          .value,

        numeroCompte: this.state.fields.numeroCompte.value,
        libelleCompte: this.state.fields.libelleCompte.value,
        dateModification: formatDateToFormatOne(new Date()),
        poolInvestissment: poolInvestissments,
        natureFiscale: this.state.fields.natureFiscale.value,
        revenuGlobal: this.state.fields.revenuGlobal.value,
        dureeMinimalSouscription: this.state.fields.dureeMinimalSouscription
          .value,
        renouvellementContratTaciteReconduction: this.state.fields
          .renouvellementContratTaciteReconduction.value,
        montantMinContribution: this.state.fields.montantMinContribution.value,
        modeGestion: this.state.fields.modeGestion.value,
        fraisFixeWakalabilIstithmar: this.state.fields
          .fraisFixeWakalabilIstithmar.value,
        surperformanceWakalabilIstithmar: this.state.fields
          .surperformanceWakalabilIstithmar.value,
        profitMoudaraba: this.state.fields.profitMoudaraba.value,
        modeCalculCapitalConstitue: this.state.fields.modeCalculCapitalConstitue
          .value,
        numeroHomologation: this.state.fields.numeroHomologation.value,
        dateHomologation: this.state.fields.dateHomologation.value,
        taxe: this.state.fields.taxe.value,
        montantAccessoire: this.state.fields.montantAccessoire.value,
        regimeFiscal: this.state.fields.regimeFiscal.value
      };
      updateRetraiteProduct(
        this.props.record.location.state.record.id,
        productRequest
      )
        .then(response => {
          notification.success({
            message: "TAKAFUL",
            description: "La modification est bien faite"
          });
          this.props.record.history.push("/consultproduitretraite");
        })
        .catch(error => {
          notification.error({
            message: "TAKAFUL",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        });
    }
  }

  render() {
    const { current, fields } = this.state;
    const steps = [
      {
        title: "Etape 1",
        content: (
          <StepOne
            record={this.props.record.location.state.record}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Informations générales "
      },
      {
        title: "Etape 2",
        content: (
          <StepTwo
            record={this.props.record.location.state.record}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Modalités de Rachat"
      },
      {
        title: "Etape 3",
        content: (
          <StepThree
            record={this.props.record.location.state.record}
            honoraire={Hon}
            {...fields}
            onChange={this.handleFormChange}
          />
        ),
        description: "Paramètres globaux"
      }
    ];

    return (
      <div>
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
        <div className="steps-action">
          {current > 0 && (
            <Button onClick={() => this.prev()}>
              <Icon type="arrow-left" />
              Précédent
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              style={{
                marginLeft: "25px"
              }}
              onClick={() => {
                if (this.state.current === 0) {
                  if (this.checkForm1Validity()) {
                    this.next();
                  }
                }
                if (this.state.current === 1) {
                  if (this.checkForm2Validity()) {
                    this.next();
                  }
                }
              }}
            >
              Suivant
              <Icon type="arrow-right" />
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={() => {
                if (this.checkForm3Validity()) {
                  this.handleSubmit();
                }
              }}
            >
              <Icon type="save" />
              Enregistrer
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default ModificationRetraiteProduit;

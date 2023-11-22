/* eslint-disable react/prop-types */
import "./SouscriptionRetraiteContrat.css";
import "antd/dist/antd.css";
import { Button, Descriptions, Divider, notification, Steps } from "antd";
import React, { Component } from "react";
import { connectedUserContext } from "../../../../app/App";
import ComponentTitle from "../../../../util/Title/ComponentTitle";
import StepOne from "./StepOne/StepOne";
import StepThree from "./StepThree/StepThree";
import StepTwo from "./StepTwo/StepTwo";
import { formatDateToFormatTwo } from "../../../../util/Helpers";
import { getAllPartenaire } from "../../../Parametrage/partenaire/PartenaireAPI";
import { getRetraiteProduit } from "../../../Parametrage/ProduitRetraite/ProduitRetraiteAPI";
import { createContratRetrait, getPeriodicite } from "../../ContratsAPI";
import { addBeneficiaireEnDeces } from "../../../Participants/ParticipantAPI";
const { Step } = Steps;

class SouscriptionRetraiteContrat extends Component {
  constructor(props) {
    super(props);
    this.setBenefeciaire = this.setBenefeciaire.bind(this);
    this.state = {
      assure: false,
      souscripteur: false,
      allow: false,
      allowSec: false,
      souscripteurObj: {},
      assureObj: {},
      current: 0,
      produits: [],
      Partenaires: [],
      periodicites: [],
      fields: {
        // step one
        moraleOuPhysique: { value: "morale" },
        cin: { value: "" },
        patente: { value: "" },
        assure: { value: "" },
        cinAssure: { value: "" },
        numeroDossierFinancement: { value: "" },
        souscripteur: { value: "" },
        souscripteurIsAssure: { value: "" },
        assurePresent: { value: false },
        //stepOne View inputs
        //step twos
        partenaire: { value: "" },
        periodicite: { value: "" },
        dureeContrat: { value: "" },
        dateEffet: { value: "" },
        dateEcheance: { value: "" },
        produit: { value: "" },
        pointVente: { value: "" },
        compteJoint: { value: false },
        NombreMensualitesEtalementLaPrimeUnique: { value: "" },
        agence: { value: "" },
        //step three
        attributionIrrevocable: { value: false },
        beneficiaireCasDeces: { value: "" },
        deductibiliteFiscale: { value: false },
        montantContributionInitiale: { value: "" },
        montantContributionPeriodique: { value: "" },
        nombrePeriodicite: { value: "" },
        beneficiaireEnDeces: { value: [] },
        datePrelevement: { value: "" }
      }
    };
  }

  setBenefeciaire = valueBeneficiare => {
    let newBeneficiaireEnDeces = this.state.fields.beneficiaireEnDeces;
    newBeneficiaireEnDeces.value = valueBeneficiare;
    this.setState({
      newBeneficiaireEnDeces: newBeneficiaireEnDeces
    });
  };

  async getDroppDownData() {
    const responsePartenaire = await getAllPartenaire();
    let responsePereiodecite = await getPeriodicite();
    let responseProduit = await getRetraiteProduit();
    this.setState({
      Partenaires: responsePartenaire.data.content,
      produits: responseProduit.data.content,
      periodicites: responsePereiodecite.data.content
    });
  }

  componentDidMount() {
    this.getDroppDownData();
  }

  handleCallback = beneficiaireData => {
    this.setState({ beneficiaireEnDeces: beneficiaireData });
  };

  async addBeneficiaires() {
    let benefecaireBD = [];
    if (this.state.fields.beneficiaireEnDeces.value !== []) {
      this.state.fields.beneficiaireEnDeces.value.forEach(async element => {
        let result = await addBeneficiaireEnDeces(element);
        let benef = result.data;
        benefecaireBD.push(benef);
      });
      let newBeneficiaireEnDeces = this.state.fields.beneficiaireEnDeces;
      newBeneficiaireEnDeces.value = benefecaireBD;
      this.setState({
        newBeneficiaireEnDeces: newBeneficiaireEnDeces
      });
    }
  }

  async createRetraitContrat(body) {
    await createContratRetrait(body)
      .then(response => {
        notification.success({
          message: "TAKAFUL",
          description: "Contrat bien enregistrée"
        });
        this.setState({
          current: 0,
          fields: {
            // step one
            moraleOuPhysique: { value: "morale" },
            cin: { value: "" },
            patente: { value: "" },
            assure: { value: "" },
            cinAssure: { value: "" },
            numeroDossierFinancement: { value: "" },
            souscripteur: { value: "" },
            souscripteurIsAssure: { value: "" },
            assurePresent: { value: false },
            //step two
            periodicite: { value: "" },
            dureeContrat: { value: "" },
            dateEffet: { value: "" },
            dateEcheance: { value: "" },
            produit: { value: "" },
            partenaire: { value: "" },
            pointVente: { value: "" },
            compteJoint: { value: false },
            //step three
            attributionIrrevocable: { value: false },
            beneficiaireCasDeces: { value: "" },
            deductibiliteFiscale: { value: false },
            montantContributionInitiale: { value: "" },
            montantContributionPeriodique: { value: "" },
            beneficiaireEnDeces: { value: [] },
            nombrePeriodicite: { value: "" },
            datePrelevement: { value: "" }
          }
          
        });
        this.props.record.history.push("/consultRetraiteContrat");
        
      })
      .catch(error => {
        notification.error({
          message: "TAKAFUL",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  checkSelectedPers = (
    souscripteurIsAssure,
    assurePresent,
    souscripteurPresent,
    souscripteurObject,
    assureObject
  ) => {
    if (assurePresent && souscripteurPresent) {
      if (this.state.allow === false) {
        
        let newStateSouscripteur = this.state.fields.souscripteur;
        newStateSouscripteur.value = souscripteurObject;
        let newStateAssure = this.state.fields.assure;
        newStateAssure.value = assureObject;
        let newStateSouscripteurIsAssure = this.state.fields
          .souscripteurIsAssure;
        newStateSouscripteurIsAssure.value = souscripteurIsAssure;
        let newStateAssurePresent = this.state.fields.assurePresent;
        newStateAssurePresent.value = newStateAssurePresent;
        this.setState({
          allow: true,
          souscripteurObj: souscripteurObject,
          assureObj: assureObject,
          newStateSouscripteur: newStateSouscripteur,
          newStateAssure: newStateAssure,
          newStateSouscripteurIsAssure: newStateSouscripteurIsAssure,
          newStateAssurePresent: newStateAssurePresent
        });
      }
    } else {
      if (this.state.allow === true) this.setState({ allow: false });
    }
  };

  next = () => {
    if (this.state.allow && this.state.current === 0) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
    if (
      this.state.fields.produit.value !== "" &&
      this.state.fields.periodicite.value !== "" &&
      this.state.fields.dateEcheance.value !== "" &&
      this.state.current === 1
    ) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
    if (
      this.state.fields.beneficiaireCasDeces.value !== "" &&
      this.state.fields.deductibiliteFiscale.value !== "" &&
      this.state.fields.montantContributionPeriodique.value !== "" &&
      this.state.fields.montantContributionInitiale.value !== "" &&
      this.state.fields.nombrePeriodicite.value !== "" &&
      this.state.current === 2
    ) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  };

  handleConfirm = (value, key) => {
    this.createRetraitContrat(value);
    notification.close(key);
  };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  async done(event) {
    const { fields } = this.state;
    if (
      fields.beneficiaireCasDeces.value !== "" &&
      fields.montantContributionPeriodique.value !== "" &&
      fields.montantContributionInitiale.value !== "" &&
      fields.nombrePeriodicite.value !== "" &&
      fields.datePrelevement.value !== ""
    ) {
      await this.addBeneficiaires();
      const fieldsToRequest = {
        // step one
        assure: this.state.assureObj,
        souscripteur: this.state.souscripteurObj,
        numeroDossierFinancement: fields.numeroDossierFinancement.value,
        souscripteurIsAssure: fields.souscripteurIsAssure.value,
        //step two
        periodicite: { id: fields.periodicite.value.key },
        dureeContrat: fields.dureeContrat.value,
        dateEffet: formatDateToFormatTwo(fields.dateEffet.value.toDate()),
        dateEcheance: formatDateToFormatTwo(fields.dateEcheance.value.toDate()),
        produit: this.state.produits.filter(
          item => item.code === fields.produit.value.label
        )[0],
        pointVente: { id: fields.pointVente.value },
        compteJoint: fields.compteJoint.value,
        partenaire: fields.partenaire.value,
        //step three
        beneficiaireCasDeces: fields.beneficiaireCasDeces.value,
        deductibiliteFiscale: fields.deductibiliteFiscale.value,
        montantContributionPeriodique:
          fields.montantContributionPeriodique.value,
        montantContributionInitiale: fields.montantContributionInitiale.value,
        nombrePeriodicite: fields.nombrePeriodicite.value,
        beneficiaireEnDeces: fields.beneficiaireEnDeces.value,
        attributionIrrevocable: fields.attributionIrrevocable.value,
        datePrelevement: fields.datePrelevement.value,
        //TODO : this field is static
        status: "ACCEPTED"
      };
      if (event === "SIMULATION") {
        fieldsToRequest.status = "SIMULATION";
      }
      const key = `open${Date.now()}`;
      const btn = (
        <div>
          <Button
            type="primary"
            onClick={() => this.handleConfirm(fieldsToRequest, key)}
            className="not-rounded"
          >
            Confirmer
          </Button>
          <Button
            onClick={() => notification.close(key)}
            style={{ marginLeft: 8 }}
            className="not-rounded"
          >
            Fermer
          </Button>
        </div>
      );
      notification.info({
        message: "Confirmation",
        description: (
          <div>
            <Divider />
            <Descriptions bordered>
              <Descriptions.Item label="Durée de contrat">
                {fields.dureeContrat.value}
              </Descriptions.Item>

              <Descriptions.Item label="Bénéficiaire Cas Decès" span={2}>
                {fields.beneficiaireCasDeces.value}
              </Descriptions.Item>

              <Descriptions.Item label="Déductibilité fiscale">
                {fields.deductibiliteFiscale.value}
              </Descriptions.Item>

              <Descriptions.Item
                label="Montant contribution periodique"
                span={2}
              >
                {fields.montantContributionPeriodique.value}
              </Descriptions.Item>

              <Descriptions.Item label="Montant contribution initiale">
                {fields.montantContributionInitiale.value}
              </Descriptions.Item>

              <Descriptions.Item label="Montant simulé" span={2}>
                {parseFloat(fields.montantContributionInitiale.value) +
                  parseFloat(fields.montantContributionPeriodique.value) *
                    parseFloat(fields.nombrePeriodicite.value)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ),
        btn,
        key,
        style: {
          width: 880,
          marginLeft: 335 - 1280
        },
        duration: 0
      });
    }
  }

  render() {
    const { current, fields } = this.state;
    const { beneficiaireEnDeces } = this.state;
    const steps = [
      {
        title: "Première étape",
        content: (
          <StepOne
            check={this.checkSelectedPers}
            {...fields}
            onChange={this.handleFormChange}
          />
        )
      },
      {
        title: "Deuxième étape",
        content: (
          <connectedUserContext.Consumer>
            {value => (
              <StepTwo
                produits={this.state.produits}
                periodicites={this.state.periodicites}
                partenaires={this.state.Partenaires}
                {...fields}
                onChange={this.handleFormChange}
                currentUser={value}
              />
            )}
          </connectedUserContext.Consumer>
        )
      },
      {
        title: "Troisième étape",
        content: (
          <div>
            <StepThree
              dateEffet={this.state.fields.dateEffet.value}
              assureObj={this.state.assureObj}
              dureeContrat={this.state.fields.dureeContrat.value}
              selectedproduit={
                this.state.produits.filter(
                  item => item.code === this.state.fields.produit.value.label
                )[0]
              }
              souscriptionCallBack={this.handleCallback}
              {...fields}
              onChange={this.handleFormChange}
              getBenefeciaireState={this.setBenefeciaire}
            />
            {beneficiaireEnDeces}
          </div>
        )
      }
    ];
    let title;
    if (fields.produit.value === "")
      title = "Nouvelle souscription retraite produit";
    else
      title =
        "Nouvelle souscription retraite produit  " +
        this.state.produits.filter(
          item => item.code === fields.produit.value.label
        )[0].code;
    return (
      <div>
        <ComponentTitle title={title} />
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
          {current === 0 && (
            <Button
              type="primary"
              className="multisteps-btn-next"
              htmlType="submit"
              form="formadd"
              onClick={() => this.next()}
            >
              Suivant
            </Button>
          )}
          {current === 1 && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-next"
              form="steptwo"
              onClick={() => this.next()}
            >
              Suivant
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-next"
              form="stepfour"
              onClick={() => this.done("CREATION")}
            >
              Terminer la création
            </Button>
          )}
          {current > 0 && (
            <Button onClick={() => this.prev()}>Précédent</Button>
          )}
        </div>
      </div>
    );
  }
}

export default SouscriptionRetraiteContrat;

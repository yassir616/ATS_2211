/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Button, Icon, notification, Steps } from "antd";
import React, { Component } from "react";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import { getHonoraire } from "../../Honoraires/HonorairesAPI";
import { updateDecesProduct } from "../ProduitDecesAPI";

const { Step } = Steps;
let Hon = {};
class Modification extends Component {
  constructor(props) {
    super(props);
    console.log("this.props.record.location", this.props.record.location);
    this.state = {
      current: 0,
      honoraire: {},

      fields: {
        // ///////////Step0//////////////////////
        risque: { value: this.props.record.location.state.record.risque.id },
        categorie: {
          value: this.props.record.location.state.record.categorie.id
        },
        periodicites: {
          value: this.props.record.location.state.record.periodicites.map(
            element => {
              return element.id;
            }
          )
        },
        ///////////Step1///////////////////////

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
        exclusion: {
          value: this.props.record.location.state.record.exclusions.map(
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
      let exclus = [];
      this.state.fields.exclusion.value.forEach(element => {
        exclus.push({ id: element });
      });

      let periodicit = [];
      this.state.fields.periodicites.value.forEach(element => {
        periodicit.push({ id: element });
      });

      let productRequest = {
        code: this.state.fields.code.value,
        libelle: this.state.fields.libelle.value,
        fraisGestion: this.state.fields.fraisGestion.value,
        fraisAcquisition: this.state.fields.fraisAcquisition.value,
        tvaFraisGestion: this.state.fields.tvaFraisGestion.value,
        tvaFraisAcquisition: this.state.fields.tvaFraisAcquisition.value,
        exclusions: exclus,
        periodicites: periodicit,
        risqueId: this.state.fields.risque.value,
        categorieId: this.state.fields.categorie.value,
        taxe: this.state.fields.taxe.value,
        montantAccessoire: this.state.fields.montantAccessoire.value
      };
      updateDecesProduct(
        this.props.record.location.state.record.id,
        productRequest
      )
        .then(response => {
          notification.success({
            message: "TAKAFUL",
            description: "La est bien faite"
          });
          this.props.record.history.push("/consultproduitdeces");
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
    console.log(
      "this.props.record.location.state.record",
      this.props.record.location.state.record
    );
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
        description: "Informations"
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
        description: "Informations générales"
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
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Suivant
              <Icon type="arrow-right" />
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => this.handleSubmit()}>
              <Icon type="save" />
              Enregistrer
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              <Icon type="arrow-left" />
              Précédent
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default Modification;

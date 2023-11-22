/* eslint-disable react/prop-types */
import "./StepThree.css";
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Table,
  InputNumber
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { getTarification } from "../../../Parametrage/ProduitDeces/ProduitDecesAPI";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";

const dateFormat = "DD-MM-YYYY";
const currentDate = moment(moment(), dateFormat).add(1, "days");

class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TarificationFound: this.props.TarificationFound,
      calculResultVisibilty: false,
      OptionsAssurance: [],
      tarification: {},
      capital: null,
      option: null,
      differe: null,
      tauxSurprime: null,
      tauxFrais: null,
      tauxParafiscale: null,
      tauxGestion: null,
      tvaFrais: null,
      tvaGestion: null,
      montantSurprime: 0,
      montantCotisation: 0,
      cotisationTotale: 0,
      tauxTaxe: null,
      prorata: 0,
      encours: null,
      cumul: 0,
      fraisAcquisitionTTC: 0,
      fraisGestionTTC: 0,
      contributionPure: null,
      datePrelevement: null,
      PrelevementSource: this.props.PrelevementSource.value,
      dateEcheance:this.props.dateEcheance.value
    };
  }
  async getTariffication(capital, differe) {
    const duree = this.props.dureeContrat.value;
    const typeProduit = this.props.selectedproduit.produitType;

    if (
      this.props.consumeData === null ||
      this.props.consumeData === undefined
    ) {
      const age = moment().diff(
        moment(this.props.assureObj.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
      let response = await getTarification(
        duree,
        age,
        capital,
        differe,
        typeProduit,
        this.props.selectedproduit.id
      );

      this.setState({ tarification: response.data });
      this.props.TarificationFound.value=this.state.tarification.found;
      console.log("Tarification "+this.props.TarificationFound.value+"  Tarification found "+this.state.tarification.found);

    } else {
      const age = moment().diff(
        moment(
          this.props.consumeData.assure.dateNaissance,
          "DD-MM-YYYY"
        ).format(),
        "years"
      );
      let response = await getTarification(
        duree,
        age,
        capital,
        differe,
        typeProduit,
        this.props.selectedproduit.id
      );

      this.setState({ tarification: response.data });
      this.props.TarificationFound.value=this.state.tarification.found;
      console.log("tarification else "+this.state.tarification.found);
    }
  }

  componentDidMount() {
    if (this.props.consumeData !== null) {
      if (this.props.consumeData.differe === null) {
        notification.open({
          message: "Le différé manquant."
        });
      }
      if (this.props.consumeData.capitalAssure === null) {
        notification.open({
          message: "Le capital assuré manquant."
        });
      }
      // if (this.props.consumeData.datePrelevement === null) {
      //   notification.open({
      //     message: "La date de prélévement manquante."
      //   });
      // }
      if (this.props.consumeData.dateEcheance !== null) {
        var d1 = Date.parse(this.props.consumeData.dateEcheance);
        var d2 = new Date();
        if (d1 >= d2) {
          this.setState({ dateEcheance: this.props.consumeData.dateEcheance });
          this.props.form.setFieldsValue({
            dateEcheance: moment(
              this.props.consumeData.dateEcheance,
              "DD/MM/YYYY"
            )
          });
        }
      }
      if (this.props.consumeData.encours === null) {
        notification.open({
          message: "L'encours manquant."
        });
      }

      this.setState({
        differe: this.props.consumeData.differe,
        capital: this.props.consumeData.capitalAssure,

        encours: this.props.consumeData.encours
      });
      this.props.form.setFieldsValue({
        Differe: this.state.differe,
        capitalAssure: this.props.consumeData.capitalAssure,
        encours: this.props.consumeData.encours,
        montantSurprime: this.props.consumeData.montantSurprime
      });
    }
    if (this.props.selectedproduit.options.length === 1) {
      this.props.form.setFieldsValue({
        optionAssurance: this.props.selectedproduit.options[0].id
      });
    }
    this.props.form.setFieldsValue({
      tauxTaxe: this.props.selectedproduit.taxe.toFixed(2),
      tauxInteret: 0,
      dureeContrat: this.props.dureeContrat.value
    });
    this.setState({
      tauxTaxe: this.props.selectedproduit.taxe.toFixed(2),
      tauxFrais: this.props.selectedproduit.fraisAcquisition,
      tauxGestion: this.props.selectedproduit.fraisGestion,
      tauxParafiscale: this.props.selectedproduit.taxeParaFiscale,
      tvaFrais: this.props.selectedproduit.tvaFraisAcquisition,
      tvaGestion: this.props.selectedproduit.tvaFraisGestion,
      tauxInteret: 0,
      OptionsAssurance: this.props.selectedproduit.options
    });
    this.props.form.setFieldsValue({
      montantSurprime: 0,
      tauxSurprime: 0
    });
  }
  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {});
  };

  componentDidUpdate(_, prevState) {
    const typeProduit = this.props.selectedproduit.produitType;

    if (
      prevState.differe !== this.state.differe ||
      prevState.capital !== this.state.capital
    ) {
      if (
        this.state.capital !== "" &&
        this.state.differe !== "" &&
        this.state.differe !== null &&
        this.state.capital !== null
      )
        this.getTariffication(this.state.capital, this.state.differe);
    }
    // else if (
    //   prevState.differe !== this.props.consumeData.differe ||
    //   prevState.capital !== this.props.consumeData.capital
    // )
    if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "taux"
    ) {
      // {
      //
      //   if (
      //     this.props.consumeData.capital !== "" &&
      //     this.props.consumeData.differe !== "" &&
      //     this.props.consumeData.differe !== null &&
      //     this.props.consumeData.capital !== null
      //   )
      //     this.getTariffication(
      //       this.props.consumeData.capital,
      //       this.props.consumeData.differe
      //     );
      // }
      if (this.props.preiodicite.value.label === "Annuelle") {
        const capital = this.props.form.getFieldValue("capitalAssure");
        this.setState({
          montantCotisation: (this.state.tarification.taux * capital) / 100
        });
        this.props.form.setFieldsValue({
          montantCotisation: (this.state.tarification.taux * capital) / 100
        });
      } else {
        const capital = this.props.form.getFieldValue("capitalAssure");
        this.setState({
          montantCotisation:
            (this.state.tarification.tauxMensuelle * capital) / 100
        });
        this.props.form.setFieldsValue({
          montantCotisation:
            (this.state.tarification.tauxMensuelle * capital) / 100
        });
      }
    } else if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "forfait"
    ) {
      this.setState({ montantCotisation: this.state.tarification.forfait });
      this.props.form.setFieldsValue({
        montantCotisation: this.state.tarification.forfait
      });
      this.setState({
        fraisAcquisitionTTC:
          (this.state.tauxFrais / 100) * this.state.montantCotisation
          // old one (this.state.tauxFrais / 100) * (1 + this.state.tvaFrais / 100) * this.state.montantCotisation
      });
      this.setState({
        fraisGestionTTC:
          (this.state.tauxGestion / 100) *
          (1 + this.state.tvaGestion / 100) *
          this.state.montantCotisation
      });
      this.setState({
        contributionPure:
          this.state.montantCotisation -
          this.state.fraisAcquisitionTTC -
          this.state.fraisGestionTTC
      });
    }
    if (prevState.montantCotisation !== this.state.montantCotisation) {
      this.props.form.setFieldsValue({
        montantTaxe: (this.state.montantCotisation * this.state.tauxTaxe) / 100
      });
      this.setState({
        montantTaxe: (this.state.montantCotisation * this.state.tauxTaxe) / 100
      });
      this.setState({
        fraisAcquisitionTTC:
          (this.state.tauxFrais / 100) * this.state.montantCotisation
          // old one (this.state.tauxFrais / 100) * (1 + this.state.tvaFrais / 100) * this.state.montantCotisation
      });
      console.log(this.state.montantCotisation);
      console.log(this.state.fraisAcquisitionTTC);
      console.log(this.state.tauxFrais);
      console.log(this.state.fraisAcquisitionTTC);

      this.props.form.setFieldsValue({
        fraisAcquisitionTTC: (
          (this.state.tauxFrais / 100) *
          this.state.montantCotisation
        ).toFixed(2)
      });
      this.props.form.setFieldsValue({
        montantTaxeParafiscale: (
          (this.state.tauxParafiscale / 100) *
          this.state.montantCotisation
        ).toFixed(2)
      });
      this.props.form.setFieldsValue({
        montantAccessoire: this.props.selectedproduit.montantAccessoire.toFixed(
          2
        )
      });
      this.setState({
        fraisGestionTTC:
          (this.state.tauxGestion / 100) *
          (1 + this.state.tvaGestion / 100) *
          this.state.montantCotisation
      });
      this.props.form.setFieldsValue({
        fraisGestionTTC: (
          (this.state.tauxGestion / 100) *
          (1 + this.state.tvaGestion / 100) *
          this.state.montantCotisation
        ).toFixed(2)
      });
    }
    if (prevState.fraisGestionTTC !== this.state.fraisGestionTTC) {
      this.setState({
        contributionPure:
          this.state.montantCotisation -
          this.state.fraisAcquisitionTTC -
          this.state.fraisGestionTTC
      });
      this.props.form.setFieldsValue({
        contributionPure: (
          this.state.montantCotisation -
          this.state.fraisAcquisitionTTC -
          this.state.fraisGestionTTC
        ).toFixed(2)
      });
    }
    if (
      prevState.montantSurprime !== this.state.montantSurprime &&
      this.state.montantCotisation !== null
    ) {
      this.props.form.validateFields(["montantSurprime"], (err, values) => {
        if (!err) {
          this.props.form.setFieldsValue({
            tauxSurprime:
              (this.state.montantSurprime / this.state.montantCotisation) * 100
          });
          this.setState({
            tauxSurprime:
              (this.state.montantSurprime / this.state.montantCotisation) * 100
          });
        }
      });
    }
    if (
      prevState.tauxSurprime !== this.state.tauxSurprime &&
      this.state.montantCotisation !== null
    ) {
      this.props.form.validateFields(["tauxSurprime"], (err, values) => {
        if (!err) {
          this.props.form.setFieldsValue({
            montantSurprime:
              (this.state.tauxSurprime * this.state.montantCotisation) / 100
          });
          this.setState({
            montantSurprime:
              (this.state.tauxSurprime * this.state.montantCotisation) / 100
          });
        }
      });
    }
    if (this.state.montantCotisation !== prevState.montantCotisation) {
      if (this.state.montantCotisation !== null) {
        this.props.form.validateFields(["montantSurprime"], (err, values) => {
          if (!err) {
            var montantTaxe =
              (this.state.montantCotisation / 100) * this.state.tauxTaxe;
            this.props.form.setFieldsValue({
              cotisationTotale:
                this.state.montantSurprime +
                this.state.montantCotisation +
                montantTaxe
            });
            this.setState({
              cotisationTotale:
                this.state.montantSurprime +
                this.state.montantCotisation +
                montantTaxe
            });
          }
        });
      }
    }
    if (
      prevState.montantCotisation !== this.state.montantCotisation &&
      this.props.preiodicite.value.label !== "Mensuelle"
    ) {
      if (this.state.montantCotisation !== null) {
        this.props.form.setFieldsValue({
          prorata:
            this.state.montantCotisation * ((13 - moment().format("M")) / 12)
        });
        this.setState({
          prorata:
            this.state.montantCotisation * ((13 - moment().format("M")) / 12)
        });
      }
    }
    // if (
    //   prevState.prorata !== this.state.prorata &&
    //   this.state.tauxTaxe !== null
    // ) {
    //   this.props.form.setFieldsValue({
    //     montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
    //   });
    //   this.setState({
    //     montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
    //   });
    // }
    if (
      prevState.prorata !== this.state.prorata &&
      this.state.tauxFrais !== null
    ) {
      this.props.form.setFieldsValue({
        montantFrais: (this.state.prorata * this.state.tauxFrais) / 100
      });
      this.setState({
        montantFrais: (this.state.prorata * this.state.tauxFrais) / 100
      });
    }
    if (
      prevState.encours !== this.state.encours &&
      this.state.capital !== null
    ) {
      this.setState({
        cumul: parseFloat(this.state.encours) + parseFloat(this.state.capital)
      });

      this.props.form.setFieldsValue({
        cumul: parseFloat(this.state.encours) + parseFloat(this.state.capital)
      });
    }
  }

  onChangeDatePrelevement = v => {
    this.setState({ datePrelevement: v });
  };

  disabledDatePrelevement = current => {
    return  current < currentDate  || current > this.state.dateEcheance;
  };
  onChangeDiffere = e => {
    this.setState({ differe: e });
  };
  onChangeCapital = e => {
    this.setState({ capital: e });

    if (this.state.encours !== null) {
      let index = parseFloat(this.state.encours) + parseFloat(e);

      this.setState({
        cumul: parseFloat(this.state.encours) + parseFloat(e)
      });

      this.props.form.setFieldsValue({
        cumul: parseFloat(this.state.encours) + parseFloat(e)
      });
    }

    // const age = moment().diff(
    //   moment(this.props.assureObj.dateNaissance, "DD-MM-YYYY").format(),
    //   "years"
    // );
    // this.normeCapitalAge(age, e.target.value, this.props.selectedproduit.id);
  };
  onChangeOption = value => {
    this.setState({ option: value });
  };
  onChangemontantSurprime = e => {
    this.setState({ montantSurprime: e.value });
  };
  onChangetauxSurprime = e => {
    this.setState({ tauxSurprime: e.value });
  };
  onChangeEncours = e => {
    this.setState({ encours: e });
  };
  calculer = () => {
    if (this.state.tarification.found === true)
      this.setState({ calculResultVisibilty: true });
    else {
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          Confirm
        </Button>
      );
      notification.warn({
        message: "Tarification produit invalide",
        description:
          "le produit que vous avez choisi ne contient pas de tarification avec les valeurs saisie, merci d'avoir vérifier les valeurs et réssayer!",
        btn,
        duration: 0,
        key
      });
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };
    const columnsSimulation = [
      {
        title: "MONTANT DE PARTICIPATION HT (DH)",
        dataIndex: "cotisation"
      },
      {
        title: "Montant de taxe (DH)",
        dataIndex: "montantTaxe"
      },
      {
        title: "Montant de participation TTC (DH)",
        dataIndex: "total"
      },
      {
        title: "Prorata HT (DH)",
        dataIndex: "Prorata"
      },
      {
        title: "Montant taxe 10% au prorata (DH)",
        dataIndex: "taxeProrata"
      },
      {
        title: "Prorata TTC (DH)",
        dataIndex: "ProrataTTC"
      }
    ];
    const columns = [
      {
        title: "MONTANT DE PARTICIPATION HT (DH)",
        dataIndex: "cotisation"
      },
      {
        title: "Montant de taxe (DH)",
        dataIndex: "montantTaxe"
      },
      {
        title: "Montant de participation TTC (DH)",
        dataIndex: "total"
      }
    ];
    const dataSimulation = [
      {
        key: "1",
        cotisation: parseFloat(this.state.montantCotisation).toFixed(2),
        montantTaxe: parseFloat(
          (this.state.montantCotisation * this.state.tauxTaxe) / 100
        ).toFixed(2),
        total: parseFloat(this.state.cotisationTotale).toFixed(2),
        Prorata: parseFloat(this.state.prorata).toFixed(2),
        taxeProrata: parseFloat((this.state.prorata * 10) / 100).toFixed(2),
        ProrataTTC: parseFloat(
          (this.state.prorata * 10) / 100 + this.state.prorata
        ).toFixed(2)
      }
    ];
    const data = [
      {
        key: "1",
        cotisation: parseFloat(this.state.montantCotisation).toFixed(2),
        montantTaxe: parseFloat(
          (this.state.montantCotisation * this.state.tauxTaxe) / 100
        ).toFixed(2),
        total: parseFloat(this.state.cotisationTotale).toFixed(2)
      }
    ];
    const dataSemestrelle = [
      {
        key: "1",
        cotisation: parseFloat(this.state.montantCotisation).toFixed(2),
        montantTaxe: parseFloat(
          (this.state.montantCotisation * this.state.tauxTaxe) / 100
        ).toFixed(2),
        total: (parseFloat(this.state.cotisationTotale).toFixed(2))*6
      }
    ];
    const dataTrimestrielle = [
      {
        key: "1",
        cotisation: parseFloat(this.state.montantCotisation).toFixed(2),
        montantTaxe: parseFloat(
          (this.state.montantCotisation * this.state.tauxTaxe) / 100
        ).toFixed(2),
        total: (parseFloat(this.state.cotisationTotale).toFixed(2))*3
      }
    ];

    return (
      <div>
        <Row>
          <Col span={24} offset={1}>
            <Form
              {...formItemLayout}
              onSubmit={this.handleSabmit}
              id="stepthree"
            >
              <Col span={10}>
                <Form.Item label="Différé">
                  {getFieldDecorator("Differe", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      addonAfter="Mois"
                      className="number-input"
                      required="true" 
                      onChange={this.onChangeDiffere}
                      //formatter={currencyFormatter}
                      //parser={currencyParser}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Taux surprime" hidden={true}>
                  {getFieldDecorator("tauxSurprime", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="%"
                      className="number-input"
                      onChange={this.onChangetauxSurprime}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Montant surprime" hidden={true}>
                  {getFieldDecorator("montantSurprime", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="DH"
                      className="number-input"
                      onChange={this.onChangemontantSurprime}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Encours">
                  {getFieldDecorator("encours", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    // this.props.consumeData == null ? (
                    <InputNumber
                      addonAfter="DH"
                      className="number-input"
                      onChange={this.onChangeEncours}
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                    // ) : (
                    // <Input disabled addonAfter="MAD"></Input>
                    // )
                  )}
                </Form.Item>
                <Form.Item label="Date de prélèvement">
                  {getFieldDecorator("datePrelevement", {
                    rules: [
                      { required: true, message: "ce champ est obligatoire" }
                    ]
                  })(
                    <DatePicker 
                      onChange={this.onChangeDatePrelevement}
                      disabledDate={this.disabledDatePrelevement}
                      defaultValue={currentDate}
                      format={dateFormat}
                      className="date-style"
                    ></DatePicker>
                  )}
                </Form.Item>

                {this.state.OptionsAssurance.length !== 0 && (
                  <Form.Item label="">
                    <Input
                      style={{ backgroundColor: "#fafafa", border: "none" }}
                      disabled
                    ></Input>
                  </Form.Item>
                )}
                {/* fin saisie col left */}
                <Form.Item label="Montant Taxe" hidden={true}>
                  {getFieldDecorator("montantTaxe", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!",
                        required: true
                      }
                    ]
                  })(
                    <Input addonAfter="MAD" className="number-input" disabled />
                  )}
                </Form.Item>
                <Form.Item label="Taux de taxe" hidden={true}>
                  {getFieldDecorator("tauxTaxe", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="  %  "
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Montant de cotisation" hidden={true}>
                  {getFieldDecorator("montantCotisation", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      addonBefore="MC"
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Frais Acquisition TTC" hidden={true}>
                  {getFieldDecorator("fraisAcquisitionTTC", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Frais gestion TTC" hidden={true}>
                  {getFieldDecorator("fraisGestionTTC", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Contribution Pure" hidden={true}>
                  {getFieldDecorator("contributionPure", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={11}>
                <Form.Item label="Durée du contrat">
                  {getFieldDecorator("dureeContrat", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="Mois"
                      className="number-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Taux de financement" hidden={true}>
                  {getFieldDecorator("tauxInteret", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="%" className="number-input" />)}
                </Form.Item>
                <Form.Item label="Capital assuré">
                  {getFieldDecorator("capitalAssure", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    // this.props.consumeData == null ? (
                    <InputNumber
                      addonAfter="DH"
                      onChange={this.onChangeCapital}
                      className="number-input"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                    // ) : (
                    //   <Input disabled addonAfter="DH" />
                    // )
                  )}
                </Form.Item>

                <Form.Item label="Montant du frais" hidden={true}>
                  {getFieldDecorator("montantFrais", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!",
                        required: true
                      }
                    ]
                  })(
                    <Input addonAfter="DH" className="number-input" disabled />
                  )}
                </Form.Item>
                <Form.Item label="Montant taxe parafiscale" hidden={true}>
                  {getFieldDecorator("montantTaxeParafiscale", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!",
                        required: true
                      }
                    ]
                  })(
                    <Input addonAfter="DH" className="number-input" disabled />
                  )}
                </Form.Item>
                <Form.Item label="Montant Accessoire" hidden={true}>
                  {getFieldDecorator("montantAccessoire", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        message: "Format invalide!",
                        required: true
                      }
                    ]
                  })(
                    <Input addonAfter="DH" className="number-input" disabled />
                  )}
                </Form.Item>
                <Form.Item label="Cumul" hidden={true}>
                  {getFieldDecorator("cumul", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Cotisation totale" hidden={true}>
                  {getFieldDecorator("cotisationTotale", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      addonBefore="CT"
                      addonAfter="DH"
                      className="number-input simulation-input"
                      disabled
                    />
                  )}
                </Form.Item>
                <Form.Item label="Prorata" hidden={true}>
                  {getFieldDecorator("prorata", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <Input addonAfter="DH" className="number-input" disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={10}></Col>
              <Col span={2}>
                <Button
                  type="primary"
                  className="nouveau-btn"
                  style={{ float: "right" }}
                  onClick={this.calculer}
                >
                  Calculer
                </Button>
              </Col>
            </Form>
          </Col>
        </Row>

        {this.state.calculResultVisibilty ? (
          this.props.preiodicite.value.label === "Mensuelle" ? (
            <Row>
              <Table
                className="table-simulation"
                columns={columns}
                dataSource={data}
                pagination={false}
                align="center"
                size="middle"
              />
            </Row>
          ) : this.props.preiodicite.value.label === "Trimestrielle" ? (
            <Row>
              <Table
                className="table-simulation"
                columns={columns}
                dataSource={dataTrimestrielle}
                pagination={false}
                align="center"
                size="middle"
              />
            </Row>
          ) :  this.props.preiodicite.value.label === "Semestrielle" ? (
              <Row>
                <Table
                  className="table-simulation"
                  columns={columns}
                  dataSource={dataSemestrelle}
                  pagination={false}
                  align="center"
                  size="middle"
                />
              </Row>
             ) : 
            (
            <Row>
              <Table
                className="table-simulation"
                columns={columnsSimulation}
                dataSource={dataSimulation}
                pagination={false}
                align="center"
                size="middle"
              />
            </Row>
          )
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      Differe: Form.createFormField({
        ...props.Differe,
        value: props.Differe.value
      }),
      optionAssurance: Form.createFormField({
        ...props.optionAssurance,
        value: props.optionAssurance.value
      }),
      prorata: Form.createFormField({
        ...props.prorata,
        value: props.prorata.value
      }),
      capitalAssure: Form.createFormField({
        ...props.capitalAssure,
        value: props.capitalAssure.value
      }),
      montantSurprime: Form.createFormField({
        ...props.montantSurprime,
        value: props.montantSurprime.value
      }),
      montantFrais: Form.createFormField({
        ...props.montantFrais,
        value: props.montantFrais.value
      }),
      montantTaxe: Form.createFormField({
        ...props.montantTaxe,
        value: props.montantTaxe.value
      }),
      tauxTaxe: Form.createFormField({
        ...props.tauxTaxe,
        value: props.tauxTaxe.value
      }),
      montantCotisation: Form.createFormField({
        ...props.montantCotisation,
        value: props.montantCotisation.value
      }),
      datePrelevement: Form.createFormField({
        ...props.datePrelevement,
        value: props.datePrelevement.value
      }),
      tauxInteret: Form.createFormField({
        ...props.tauxInteret,
        value: props.tauxInteret.value
      }),
      tauxSurprime: Form.createFormField({
        ...props.tauxSurprime,
        value: props.tauxSurprime.value
      }),
      cotisationTotale: Form.createFormField({
        ...props.cotisationTotale,
        value: props.cotisationTotale.value
      }),
      encours: Form.createFormField({
        ...props.encours,
        value: props.encours.value
      }),
      cumul: Form.createFormField({
        ...props.cumul,
        value: props.cumul.value
      }),
      fraisAcquisitionTTC: Form.createFormField({
        ...props.fraisAcquisitionTTC,
        value: props.fraisAcquisitionTTC.value
      }),
      fraisGestionTTC: Form.createFormField({
        ...props.fraisGestionTTC,
        value: props.fraisGestionTTC.value
      }),
      contributionPure: Form.createFormField({
        ...props.contributionPure,
        value: props.contributionPure.value
      }),
      dureeContrat: Form.createFormField({
        ...props.dureeContrat,
        value: props.dureeContrat.value
      }),
      montantTaxeParafiscale: Form.createFormField({
        ...props.montantTaxeParafiscale,
        value: props.montantTaxeParafiscale.value
      }),
      montantAccessoire: Form.createFormField({
        ...props.montantAccessoire,
        value: props.montantAccessoire.value
      })
    };
  }
})(StepThree);

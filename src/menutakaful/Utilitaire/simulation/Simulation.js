/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Input,
  Typography,
  Button,
  Table,
  Icon,
  AutoComplete,
  notification,
  InputNumber
} from "antd";
import moment from "moment";
import { connectedUserContext } from "../../../app/App";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import {
  getDecesProduit,
  getTarification
} from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import { getallperson } from "../../Participants/ParticipantAPI";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";
import { jasperFile } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Title } = Typography;
const dateFormat = "DD-MM-YYYY";
const currentDate = moment(moment(), dateFormat).add(1, "days");
const { Option } = Select;
let pointVente = "";
let dateNaissance = new Date();

const columnsSimulation = [
  {
    title: "MONTANT DE PARTICIPATION HT (DH)",
    dataIndex: "montantCotisation"
  },
  {
    title: "Montant de taxe (DH)",
    dataIndex: "taxe"
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
const columnsSimulation1 = [
  {
    title: "MONTANT DE PARTICIPATION HT (DH)",
    dataIndex: "montantCotisation"
  },
  {
    title: "Montant de taxe (DH)",
    dataIndex: "taxe"
  },
  {
    title: "Montant de participation TTC (DH)",
    dataIndex: "total"
  }
];

class Simulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateNaissance: null,
      dureeContrat: 0,
      dateEcheance: null,
      dateEffet: currentDate,
      Partenaires: [],
      produits: [],
      produit: {},
      usedProducts: [],
      OptionsAssurance: [],
      tarification: {},
      capital: null,
      option: null,
      differe: null,
      tauxSurprime: null,
      montantSurprime: null,
      montantCotisation: 0,
      cotisationTotale: 0,
      tauxTaxe: null,
      prorata: 0,
      encours: null,
      cumul: 0,
      dataSimulation: [],
      dataSimulation1: [],
      fraisAcquisitionTTC: null,
      fraisGestionTTC: null,
      contributionPure: null,
      tauxFrais: null,
      tauxGestion: null,
      tvaFrais: null,
      tvaGestion: null,
      test: null,
      cin: null,
      nom: null,
      booleen: false,
      prenom: null,
      updated: false,
      periodicite: [],
      period: "",
      personlistForAuto: [],
      personlist: [],
      souscripteur: {},
      selectedCinSouscripteur: []
    };
  }

  async getproprties() {
    let personslist = await getallperson();
    let helpArray = [];

    personslist.data.content.forEach(element => {
      const object = element.cin;
      helpArray.push(object);
    });

    this.setState({
      personlist: [...personslist.data.content],
      personlistForAuto: [...helpArray]
    });
  }
  searchPersonnePhysique = value => {
    const dataSource = [...this.state.personlist];
    const sousc = dataSource.filter(item => item.cin === value.key)[0];
    dateNaissance = moment(sousc.dateNaissance, dateFormat);
    this.props.form.setFieldsValue({
      nom: sousc.nom,
      prenom: sousc.prenom,
      dateNaissance: moment(sousc.dateNaissance, dateFormat),
      age: moment().diff(moment(sousc.dateNaissance, dateFormat), "years")
    });
    this.setState({
      souscripteur: sousc,
      nom: sousc.nom,
      prenom: sousc.prenom,
      dateNaissance: sousc.dateNaissance
    });
  };

  handleChangeCinSouscripteur = value => {
    this.setState({ selectedCinSouscripteur: value });
  };
  componentDidMount() {
    this.getDroppDownData();
    this.getAllPeriodicite();
    this.getproprties();

    this.props.form.setFieldsValue({
      partenaire: {
        key: this.props.currentUser.pointVentes[0].partenairepv.id,
        label: this.props.currentUser.pointVentes[0].partenairepv.code
      }
    });
  }
  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }
  async getTariffication(capital, differe, produit, dateNaissance) {
    const age = moment().diff(moment(dateNaissance), "years");

    const duree = this.state.dureeContrat;
    const typeProduit = produit.produitType;
    let response = await getTarification(
      duree,
      age,
      capital,
      differe,
      typeProduit,
      produit.id
    );
    this.setState({ tarification: response.data });
  }
  handleEffetDateChange = value => {
    if (this.state.dateEcheance !== null) {
      let echeanceDate = this.state.dateEcheance;
      this.setState({
        dateEffet: value,
        dureeContrat: echeanceDate.diff(value, "months")
      });
    }
  };

  onChangeDateNaissance = date => {
    let dateConvert = moment(date).format("DD-MM-YYYY");
    this.setState({ dateNaissance: dateConvert });
    const age = moment().diff(moment(date), "years");
    this.props.form.setFieldsValue({
      age: age
    });
    this.setState({
      usedProducts: this.state.produits.filter(
        item =>
          item.partenaire.id ===
          this.props.currentUser.pointVentes[0].partenairepv.id
      )
    });
  };
  onChangeEncours = e => {
    this.setState({ encours: e.target.value });
  };

  onChangePeriodicite = e => {
    let selected = this.state.periodicite.filter(item => item.id === e);
    this.setState({ period: selected[0].libelle });
  };

  // onChangeNom = e => {
  //   this.setState({ nom: e.target.value });
  // };
  // onChangePrenom = e => {
  //   this.setState({ prenom: e.target.value });
  // };
  onChangeCapital = e => {
    this.setState({ capital: e.target.value });
  };
  onChangeDiffere = e => {
    this.setState({ differe: e.target.value });
  };
  onChangemontantSurprime = e => {
    this.setState({ montantSurprime: e.target.value });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.tarification !== this.state.tarification &&
      this.state.produit.produitType === "taux"
    ) {
      console.log("periodicité:", this.state.period);

      if (this.state.period === "Mensuelle") {
        const capital = this.props.form.getFieldValue("capital");

        const montantCotisation = (
          (this.state.tarification.tauxMensuelle * capital) /
          100
        ).toFixed(2);
        const cotisationTotale = (
          montantCotisation *
          (1 + this.state.produit.taxe / 100)
        ).toFixed(2);

        this.setState({
          montantCotisation:
            (this.state.tarification.tauxMensuelle * capital) / 100,
          cotisationTotale:
            montantCotisation * (1 + this.state.produit.taxe / 100),
          taxe: (montantCotisation * this.state.produit.taxe) / 100,
          dataSimulation1: [
            {
              key: "1",
              taxe: (montantCotisation * this.state.produit.taxe) / 100,
              montantCotisation: montantCotisation,
              total: cotisationTotale
            }
          ]
        });
        this.props.form.setFieldsValue({
          montantCotisation:
            (this.state.tarification.tauxMensuelle * capital) / 100
        });
      } else {
        const capital = this.props.form.getFieldValue("capital");

        const montantCotisation = (
          (this.state.tarification.taux * capital) /
          100
        ).toFixed(2);
        const cotisationTotale = (
          montantCotisation *
          (1 + this.state.produit.taxe / 100)
        ).toFixed(2);

        let prorata = (
          montantCotisation *
          ((13 - moment().format("M")) / 12)
        ).toFixed(2);
        console.log("prorata:", prorata);

        const taxeAuProrata = ((prorata * 10) / 100).toFixed(2);
        const Prorata_TTC = parseFloat(taxeAuProrata) + parseFloat(prorata);

        this.setState({
          montantCotisation: (this.state.tarification.taux * capital) / 100,
          cotisationTotale:
            montantCotisation * (1 + this.state.produit.taxe / 100),
          taxe: (montantCotisation * this.state.produit.taxe) / 100,
          dataSimulation: [
            {
              key: "1",
              taxe: (montantCotisation * this.state.produit.taxe) / 100,
              montantCotisation: montantCotisation,
              total: cotisationTotale,
              Prorata: prorata,
              taxeProrata: taxeAuProrata,
              ProrataTTC: Prorata_TTC
            }
          ]
        });
        this.props.form.setFieldsValue({
          montantCotisation: (this.state.tarification.taux * capital) / 100
        });
      }
    } else if (
      prevState.tarification !== this.state.tarification &&
      this.state.produit.produitType === "forfait"
    ) {
      this.setState({ montantCotisation: this.state.tarification.forfait });
      this.props.form.setFieldsValue({
        montantCotisation: this.state.tarification.forfait
      });
    }
    if (prevState.montantCotisation !== this.state.montantCotisation) {
      this.setState({ updated: true });
    }
  }

  async jasperFiles(requestDevis) {
    let response = await jasperFile(requestDevis);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  handleConf = () => {
    let requestModel = {
      pointVente: pointVente,
      dateNaissance: this.state.dateNaissance,
      capital: this.state.capital,
      duree: this.state.dureeContrat,
      differe: this.state.differe,
      periodicite: this.state.period,
      montantParticipationHT: this.state.montantCotisation,
      taxe: this.state.taxe,
      montantParticipationTTC: this.state.cotisationTotale.toFixed(2),
      risque: this.state.produit.risque.libelle,
      produit: this.state.produit.code
    };
    this.jasperFiles(requestModel);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.getTariffication(
        fieldsValue.capital,
        fieldsValue.Differe,
        this.state.produit,
        fieldsValue.dateNaissance
      );
    });
  };
  partnerChange = value => {
    this.setState({
      usedProducts: this.state.produits.filter(
        item => item.partenaire.raisonSocial === value.label
      )
    });
  };
  onChangeDureeContrat = e => {
    let date = moment.addRealMonth(this.state.dateEffet, e.target.value);
    this.setState({
      dureeContrat: e.target.value,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value),
      dureeContrat: parseInt(e.target.value)
    });
    dateNaissance = this.props.form.getFieldValue("dateNaissance");
    const age = moment(date).diff(moment(dateNaissance), "years");

    if (age >= 70) {
      this.setState({ booleen: true });
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
      notification.error({
        message: "TAKAFUL",
        description: "l'âge du sociètaire à l'echeance dépasse 70.",
        btn,
        duration: 0,
        key
      });
    }
  };
  handleEcheanceDateChange = value => {
    let effetDate = this.state.dateEffet;
    this.setState({
      dateEcheance: value,
      dureeContrat: value.diff(effetDate, "months")
    });
    this.props.form.setFieldsValue({
      dureeContrat: value.diff(effetDate, "months")
    });
    const age = moment(value).diff(moment(dateNaissance), "years");

    if (age >= 70) {
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
      this.setState({ booleen: true });
      notification.error({
        message: "TAKAFUL",
        description: "l'âge du sociètaire à l'echeance dépasse 70.",
        btn,
        duration: 0,
        key
      });
    }
  };
  async getDroppDownData() {
    const responsePartenaire = await getAllPartenaire();
    let responseProduit = await getDecesProduit();
    this.setState({
      Partenaires: responsePartenaire.data.content,
      produits: responseProduit.data.content
    });
  }
  onChangeProduit = e => {
    let selected = this.state.produits.filter(item => item.id === e)[0];
    this.setState({
      produit: selected,
      tauxFrais: selected.fraisAcquisition,
      tauxGestion: selected.fraisGestion,
      tvaFrais: selected.tvaFraisAcquisition,
      tvaGestion: selected.tvaFraisGestion
    });
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
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <ComponentTitle title="Simulation Décès Financement" />
        <Col span={24} offset={1}>
          <Title level={4}>INFORMATIONS PROSPECT</Title>
        </Col>
        <br />
        <br />
        <Row>
          <Col span={10}>
            <Form.Item label="CIN" hasFeedback hidden={true}>
              {getFieldDecorator("cin", {
                valuePropName: "selected"
              })(
                <AutoComplete
                  size="default"
                  dataSource={this.state.personlistForAuto}
                  onSelect={this.searchPersonnePhysique}
                  allowClear={true}
                  value={this.state.selectedCinSouscripteur}
                  onChange={this.handleChangeCinSouscripteur}
                  labelInValue
                  placeholder="CIN"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Nom" hasFeedback hidden={true}>
              {getFieldDecorator(
                "nom",
                {}
              )(<Input onChange={this.onChangeNom}></Input>)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Prenom" hasFeedback hidden={true}>
              {getFieldDecorator(
                "prenom",
                {}
              )(<Input onChange={this.onChangePrenom}></Input>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Date de naissance" hasFeedback>
              {getFieldDecorator("dateNaissance", {
                rules: [
                  {
                    required: true,
                    message: "entre la Date de naissance"
                  }
                ]
              })(
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  disabledDate={this.disabledDate}
                  onChange={this.onChangeDateNaissance}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Age">
              {getFieldDecorator("age", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <Input
                  className="number-input"
                  onChange={this.onChange}
                  addonAfter="Ans"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Col span={24} offset={1}>
          <Title level={4}>INFORMATIONS CONTRAT</Title>
        </Col>
        <br />
        <br />
        <Row>
          <Col span={10}>
            <Form.Item label="Date d'effet" hasFeedback>
              {getFieldDecorator("dateEffet", {
                valuePropName: "selected",
                rules: [
                  {
                    message: "entre la Date d'effet"
                  }
                ]
              })(
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  disabledDate={this.disabledDate}
                  onChange={this.handleEffetDateChange}
                  defaultValue={currentDate}
                  disabled={true}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Date d'échéance" hasFeedback>
              {getFieldDecorator("dateEcheance", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "selectionnez une date d'echeance"
                  }
                ]
              })(
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  value={this.state.dateEcheance}
                  disabledDate={this.disabledDateEcheance}
                  onChange={this.handleEcheanceDateChange}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Durée de contrat">
              {getFieldDecorator("dureeContrat", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <Input
                  className="number-input"
                  onChange={this.onChangeDureeContrat}
                  addonAfter="Mois"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <connectedUserContext.Consumer>
              {value => (
                (pointVente = value.pointVentes[0].libelle),
                (
                  <Form.Item label="Agence" hasFeedback>
                    {getFieldDecorator("pointVente", {
                      valuePropName: "selected",
                      rules: [
                        {
                          message: "selectionnez une agence"
                        }
                      ]
                    })(
                      <Select
                        placeholder="agence"
                        defaultValue={
                          value.pointVentes.length === 1 &&
                          value.pointVentes[0].id
                        }
                      >
                        {value.pointVentes.map(element => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.libelle}
                            >
                              {element.libelle}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                )
              )}
            </connectedUserContext.Consumer>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Différé">
              {getFieldDecorator("Differe", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <Input
                  addonAfter="Mois"
                  onChange={this.onChangeDiffere}
                  className="number-input"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Intermédiaire" hasFeedback>
              {getFieldDecorator("partenaire", {
                rules: [
                  {
                    required: true,
                    message: "selectionnez un Intermédiaire"
                  }
                ]
              })(
                this.state.roleAdmin ? (
                  <Select
                    placeholder="Intermédiaire"
                    onSelect={this.partnerChange}
                    labelInValue
                  >
                    {this.state.Partenaires.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.raisonSocial}
                        >
                          {element.raisonSocial}
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
                  <Select
                    placeholder="Intermédiaire"
                    onSelect={this.partnerChange}
                    labelInValue
                  >
                    {this.state.Partenaires.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.raisonSocial}
                        >
                          {element.raisonSocial}
                        </Option>
                      );
                    })}
                  </Select>
                )
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Capital assuré">
              {getFieldDecorator("capital", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                    message: "Format invalide!"
                  }
                ]
              })(
                <Input
                  addonAfter="DH"
                  onChange={this.onChangeCapital}
                  className="number-input"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Produit" hasFeedback>
              {getFieldDecorator("produit", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "selectionnez un produit"
                  }
                ]
              })(
                <Select placeholder="produit" onChange={this.onChangeProduit}>
                  {this.state.usedProducts.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.code}
                      >
                        {element.code}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Périodicité">
              {getFieldDecorator(
                "periodicite",
                {}
              )(
                <Select
                  placeholder="Selectionnez ..."
                  onChange={this.onChangePeriodicite}
                >
                  {this.state.periodicite.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.abb}
                      >
                        {element.libelle}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Taux de marge" hidden={true}>
              {getFieldDecorator("tauxInteret", {
                rules: [
                  {
                    pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                    message: "Format invalide!"
                  }
                ]
              })(<Input addonAfter="%" className="number-input" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            {this.state.OptionsAssurance.length !== 0 && (
              <Form.Item label="Option Assurance">
                {getFieldDecorator("optionAssurance", {
                  valuePropName: "selected",
                  rules: [
                    {
                      required: true,
                      message: "selectionnez une Option Assurance"
                    }
                  ]
                })(
                  <Select
                    placeholder="Option Assurance"
                    optionLabelProp="label"
                    labelInValue
                    onChange={this.onChangeOption}
                    defaultValue={
                      this.state.OptionsAssurance.length === 1 && {
                        value: this.state.OptionsAssurance[0].id,
                        label: this.state.OptionsAssurance[0].libelle
                      }
                    }
                  >
                    {this.state.OptionsAssurance.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.libelle}
                        >
                          {element.libelle}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            )}
          </Col>
          <Col span={10}>
            <Button
              type="primary"
              className="action-btn-calculer"
              htmlType="submit"
              disabled={this.state.booleen}
            >
              Calculer
            </Button>
          </Col>
        </Row>
        <Row>
          {this.state.montantCotisation !== 0 &&
            this.state.period === "Annuelle" && (
              <Table
                className="table-simulation"
                columns={columnsSimulation}
                dataSource={this.state.dataSimulation}
                pagination={false}
                align="center"
                size="middle"
              />
            )}
          {this.state.montantCotisation !== 0 &&
            this.state.period === "Mensuelle" && (
              <Table
                className="table-simulation"
                columns={columnsSimulation1}
                dataSource={this.state.dataSimulation1}
                pagination={false}
                align="center"
                size="middle"
              />
            )}
        </Row>
        <Row>
          <Col span={23}>
            {this.state.montantCotisation !== 0 && (
              <Button
                type="primary"
                className="edit-btn-pdf"
                onClick={() => this.handleConf()}
              >
                <Icon type="download" />
                Editer
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}
moment.addRealMonth = function addRealMonth(d, m) {
  var fm = moment(d).add(m, "M");
  var fmEnd = moment(fm).endOf("month");
  return d.date() !== fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
    ? fm.add(1, "d")
    : fm;
};
export default Form.create()(Simulation);

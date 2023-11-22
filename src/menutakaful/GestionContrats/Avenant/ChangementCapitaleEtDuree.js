/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Divider,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Descriptions,
  notification
} from "antd";
import moment from "moment";
import { getTarification } from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;
const dateFormat = "DD-MM-YYYY";
var typeProduit = "";

class ChangementCapitaleEtDuree extends Component {
  state = {
    dateCreation: new Date(),
    tarification: {},
    tauxTaxe: this.props.record.produit.taxe,
    montantTaxe: this.props.record.montantTaxe,
    tauxSurprime: this.props.record.tauxSurprime,
    tauxReduction: this.props.record.tauxReduction,
    prorata: this.props.record.prorata,
    differe: this.props.record.differe,
    capital: this.props.record.capitalAssure,
    duree: this.props.record.dureeContrat,
    montantSurprime: this.props.record.montantSurprime,
    montantCotisation: this.props.record.montantCotisation
  };
  async componentDidMount() {
    this.props.form.setFieldsValue({
      differe: this.props.record.differe,
      capitalAssure: this.props.record.capitalAssure,
      tauxReduction: this.props.record.tauxReduction,
      tauxSurprime: this.props.record.tauxSurprime,
      duree: this.props.record.dureeContrat,
      montantCotisation: this.props.record.montantCotisation,
      prorata: this.props.record.prorata,
      montantTaxe: this.props.record.montantTaxe,
      montantSurprime: this.props.record.montantSurprime
    });
  }
  componentDidUpdate(_, prevState) {
    const effetMonth = moment(this.props.record.dateEffet).format("M");
    const effet = moment(this.props.record.dateEffet).format("D");
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
    if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "taux"
    ) {
      const capital = this.props.form.getFieldValue("capitalAssure");
      const montantC = (this.state.tarification.taux * capital) / 100;
      this.setState({
        montantCotisation: (this.state.tarification.taux * capital) / 100
      });
      this.props.form.setFieldsValue({
        montantCotisation: (this.state.tarification.taux * capital) / 100
      });
      const montantS = (this.state.tauxSurprime * montantC) / 100;
      this.props.form.setFieldsValue({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      this.setState({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      if (
        prevState.montantSurprime !== this.state.montantSurprime ||
        this.state.montantCotisation !== prevState.montantCotisation
      ) {
        if (
          this.state.montantSurprime !== null &&
          this.state.montantCotisation !== null
        ) {
          this.props.form.setFieldsValue({
            cotisationTotale: montantS + montantC
          });
          this.setState({
            cotisationTotale: montantS + montantC
          });
        }
      }
    } else if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "forfait"
    ) {
      const montantC = this.state.tarification.forfait;
      this.setState({ montantCotisation: this.state.tarification.forfait });
      this.props.form.setFieldsValue({
        montantCotisation: this.state.tarification.forfait
      });
      const montantS = (this.state.tauxSurprime * montantC) / 100;
      this.props.form.setFieldsValue({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      this.setState({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      if (
        prevState.montantSurprime !== this.state.montantSurprime ||
        this.state.montantCotisation !== prevState.montantCotisation
      ) {
        if (
          this.state.montantSurprime !== null &&
          this.state.montantCotisation !== null
        ) {
          this.props.form.setFieldsValue({
            cotisationTotale: montantS + montantC
          });
          this.setState({
            cotisationTotale: montantS + montantC
          });
        }
      }
    }
    if (prevState.cotisationTotale !== this.state.cotisationTotale) {
      if (
        this.state.cotisationTotale !== null &&
        this.state.record.periodicite.libelle !== "Unique"
      ) {
        if (effet <= 15) {
          this.props.form.setFieldsValue({
            prorata: this.state.cotisationTotale * ((13 - effetMonth) / 12)
          });
          this.setState({
            prorata: this.state.cotisationTotale * ((13 - effetMonth) / 12)
          });
        } else {
          this.props.form.setFieldsValue({
            prorata: this.state.cotisationTotale * ((12 - effetMonth) / 12)
          });
          this.setState({
            prorata: this.state.cotisationTotale * ((12 - effetMonth) / 12)
          });
        }
      }
    }
    if (
      prevState.prorata !== this.state.prorata &&
      this.state.tauxTaxe !== null
    ) {
      this.props.form.setFieldsValue({
        montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
      });
      this.setState({
        montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
      });
    }
  }

  async getTariffication(capital, differe) {
    const age = moment().diff(
      moment(this.props.record.assure.dateNaissance),
      "years"
    );
    const duree = this.state.duree;
    typeProduit = this.props.record.produit.produitType;
    let response = await getTarification(
      duree,
      age,
      capital,
      differe,
      typeProduit,
      this.props.record.produit.id
    );
    this.setState({ tarification: response.data });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const key = `open${Date.now()}`;
        const btn = (
          <div>
            <Button
              type="primary"
              onClick={() => this.handleConfirm(this.state, key)}
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
                <Descriptions.Item label="Montant cotisation">
                  {this.state.montantCotisation}
                </Descriptions.Item>
                <Descriptions.Item label="Montant surprime" span={2}>
                  {this.state.montantSurprime}
                </Descriptions.Item>
                <Descriptions.Item label="Montant proratisé">
                  {this.state.prorata}
                </Descriptions.Item>
                <Descriptions.Item label="Montant taxe" span={2}>
                  {this.state.montantTaxe}
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
    });
  };
  handleConfirm = (values, keyn) => {
    this.props.saveRequest(values);
    notification.close(keyn);

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
    notification.success({
      message: "confirmation",
      description: "l'avenant vien d'etre ajoute au contrat",
      btn,
      duration: 0,
      key
    });
  };

  onChangeDiffere = value => {
    this.setState({ differe: value });
  };

  onChangeCapital = e => {
    this.setState({ capital: e });
  };

  onChangeDuree = e => {
    this.setState({ duree: e });
  };

  onChangeTauxS = e => {
    this.setState({ tauxSurprime: e });
  };

  onChangeTauxReduction = e => {
    this.setState({ tauxReduction: e });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <h3> Détail d&apos;avenant</h3>
        <Divider />
        <Row>
          <Col span={11}>
            <Form.Item label="Date création">
              {getFieldDecorator("dateCreation", {
                initialValue: moment(this.state.dateCreation, dateFormat)
              })(<DatePicker format={dateFormat} disabled />)}
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <Form.Item label="N° Avenant">
              {getFieldDecorator("numeroAvenant")(
                <Input className="not-rounded" disabled />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="Différé">
              {getFieldDecorator("differe")(
                <InputNumber
                  className="not-rounded"
                  onChange={this.onChangeDiffere}
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <Form.Item label="Taux de réduction">
              {getFieldDecorator("tauxReduction")(
                <InputNumber
                  className="not-rounded"
                  onChange={this.onChangeTauxReduction}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="Capital assuré">
              {getFieldDecorator("capitalAssure")(
                <InputNumber
                  className="not-rounded"
                  onChange={this.onChangeCapital}
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <Form.Item label="Durée">
              {getFieldDecorator("duree")(
                <InputNumber
                  className="not-rounded"
                  onChange={this.onChangeDuree}
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item label="Date effet avenant">
              {getFieldDecorator("dateEffetAvenant", {
                initialValue: moment(this.state.dateCreation, dateFormat)
              })(<DatePicker format={dateFormat} />)}
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <Form.Item label="Taux de surprime">
              {getFieldDecorator("tauxSurprime")(
                <InputNumber
                  className="not-rounded"
                  onChange={this.onChangeTauxS}
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Button
          key="submit"
          type="primary"
          onClick={this.handleSubmit}
          className="not-rounded"
        >
          Ajouter
        </Button>
      </Form>
    );
  }
}

export default Form.create()(ChangementCapitaleEtDuree);

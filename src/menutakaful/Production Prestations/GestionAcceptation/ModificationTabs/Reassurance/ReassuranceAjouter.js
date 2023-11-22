/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import {
  Form,
  Select,
  Button,
  Spin,
  DatePicker,
  Input,
  notification
} from "antd";
import {
  lettreRenonciation,
  lettreRejet,
  ajouterAcceptationEtape,
  ajouterAcceptationReassurance,
  getAcceptationReassuranceByAcceptation,
  lettreAcceptation,
  lettreAcceptationAvecSurprime
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  state = {
    reassurance: [],
    loading: false,
    statuts: false,
    hidden: false,
    listOnglets: []
  };
  handleSubmit = e => {
    this.setState({ loading: true, statuts: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterSpecialiste(values);
      }
    });
    this.acceptationReassurance(this.props.record.id);
  };
  componentDidMount() {
    this.acceptationReassurance(this.props.record.id);
  }

  async acceptationReassurance(id) {
    let response = await getAcceptationReassuranceByAcceptation(id);
    console.log("response:", response.data);
    if (response.data.length !== 0) {
      this.setState({ reassurance: response.data, statuts: true });
    }
  }
  async jasperLettreAcceptation(requestLettre) {
    console.log(requestLettre);
    let response = await lettreAcceptation(requestLettre);
    console.log(response);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperLettreRejet(requestLettreRejet) {
    let response = await lettreRejet(requestLettreRejet);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperLettreRenonciation(requestLettreRenonciation) {
    let response = await lettreRenonciation(requestLettreRenonciation);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async jasperLettreAcceptationAvecSurprime(requestLettreSurprime) {
    let response = await lettreAcceptationAvecSurprime(requestLettreSurprime);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  onChangeSurprime = e => {
    console.log(
      "montant Cotisation:",
      this.props.record.contrat.montantCotisation
    );
    let montantSurprime =
      (this.props.record.contrat.montantCotisation * e.target.value) / 100;
    let surprimeHT =
      montantSurprime + this.props.record.contrat.montantCotisation;
    let surprimeTaxe = (surprimeHT * 10) / 100;
    let surprimeTTC = surprimeTaxe + surprimeHT;
    console.log("montantSurprime:", montantSurprime);
    console.log("surprimeHT:", surprimeHT);
    console.log("surprimetaxe:", surprimeTaxe);
    console.log("surprimettc:", surprimeTTC);

    this.props.form.setFieldsValue({
      montantSurprime: montantSurprime,
      surprimeHT: surprimeHT,
      surprimeTaxe: surprimeTaxe,
      surprimeTTC: surprimeTTC
    });
  };
  async ajouterSpecialiste(values) {
    try {
      let verdict = values.verdict.label;
      values.dateReassurance = values.dateReassurance.format("YYYY-MM-DD");
      values.dateReception = values.dateReception.format("YYYY-MM-DD");
      values.verdict = { id: values.verdict.key, status: values.verdict.label };
      values.tauxSurprime = parseFloat(values.TauxSurprime);

      values.acceptation = this.props.record;
      let response = await ajouterAcceptationReassurance(values);
      if (verdict === "Acceptation au tarif normal") {
        let requestAcceptation = {
          intermediaire: this.props.record.contrat.produit.partenaire
            .raisonSocial,
          nom:
            this.props.record.contrat.assure.nom +
            " " +
            this.props.record.contrat.assure.prenom,
          agence: this.props.record.contrat.pointVente.libelle,
          numeroAcceptation: this.props.record.code,
          montantMourabaha: this.props.record.contrat.capitalAssure.toFixed(2),
          encours: this.props.record.encours.toFixed(2),
          cumul: this.props.record.cumul.toFixed(2),
          duree: this.props.record.contrat.dureeContrat,
          differe: this.props.record.contrat.differe,
          montantCotisation: (
            this.props.record.contrat.montantCotisation +
            this.props.record.contrat.montantTaxe
          ).toFixed(2)
        };
        this.jasperLettreAcceptation(requestAcceptation);
      } else if (verdict === "Rejet") {
        console.log("hello rejet verdict");

        let requestRejet = {
          intermediaire: this.props.record.contrat.produit.partenaire
            .raisonSocial,
          nomParticipant:
            this.props.record.contrat.assure.nom +
            " " +
            this.props.record.contrat.assure.prenom,
          agence: this.props.record.contrat.pointVente.libelle,
          numeroAcceptation: this.props.record.code,
          montantFinancement: this.props.record.contrat.capitalAssure,
          encours: this.props.record.encours,
          cumul: this.props.record.cumul,
          duree: this.props.record.contrat.dureeContrat,
          differe: this.props.record.contrat.differe,
          date: moment().format("DD-MM-YYYY")
        };
        console.log("hello rejet verdict:", requestRejet);
        this.jasperLettreRejet(requestRejet);
      } else if (verdict === "Acceptation avec rénonciation") {
        let requestRenonciation = {
          nomParticipant:
            this.props.record.contrat.assure.nom +
            " " +
            this.props.record.contrat.assure.prenom,
          motif: values.observationsVerdict,
          adresse: this.props.record.contrat.assure.adressComplete,
          cin: this.props.record.contrat.assure.cin
        };
        console.log("request Renonciation:", requestRenonciation);
        this.jasperLettreRenonciation(requestRenonciation);
      } else if (verdict === "Acceptation avec surprime") {
        let requestsurprime = {
          nomPrenom:
            this.props.record.contrat.assure.nom +
            " " +
            this.props.record.contrat.assure.prenom,
          intermediaire: this.props.record.contrat.produit.partenaire
            .raisonSocial,
          agence: this.props.record.contrat.pointVente.libelle,
          numeroAcceptation: this.props.record.code,
          montantFinancement: this.props.record.contrat.capitalAssure,
          encours: this.props.record.encours,
          cumul: this.props.record.cumul,
          duree: this.props.record.contrat.dureeContrat,
          differe: this.props.record.contrat.differe,
          tauxSurprime: values.TauxSurprime,
          surprimeTTC: values.surprimeTTC
        };
        console.log("request surprime:", requestsurprime);
        this.jasperLettreAcceptationAvecSurprime(requestsurprime);
      }
      let responseEtape = await ajouterAcceptationEtape({
        acceptationReassurance: { id: response.data.id },
        etape: "reassurance",
        dateVerdict: moment().format("YYYY-MM-DD"),
        verdict: values.verdict
      });
      if (response.status === 200 && responseEtape.status === 200) {
        this.props.parentCallback(response.data);
        notification.success({
          message: "bien ajouté"
        });
        this.setState({ loading: false });
        let list = [...this.state.listOnglets];

        if (
          verdict === "Acceptation au tarif normal" ||
          verdict === "Acceptation avec surprime" ||
          verdict === "Acceptation avec rénonciation" ||
          verdict === "Rejet"
        ) {
          window.open("/takafulapp/gestionacceptation", "_self");
        }

        if (verdict === "Examen complementaire") {
          list.push(
            {
              key: "examens",
              tab: "Examens Complémentaire"
            },
            {
              key: "specialiste",
              tab: "Specialiste"
            }
          );

          this.setState({ listOnglets: [...list] });
          this.props.onglet(list);
        }
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description: "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const handleSelect = e => {
      console.log(e.label);
      if (e.label === "Acceptation avec surprime") {
        this.setState({ hidden: true });
        console.log(this.state.hidden);
      } else {
        this.setState({ hidden: false });
        console.log(this.state.hidden);
      }
    };
    return (
      <Spin spinning={this.state.loading}>
        <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Date Reassurance" hasFeedback>
            {getFieldDecorator("dateReassurance", {
              valuePropName: "selected",

              rules: [
                {
                  required: true,
                  message: "selectionnez une date d'reassurance"
                }
              ]
            })(<DatePicker className="date-style"></DatePicker>)}
          </Form.Item>

          <Form.Item label="Date réception" hasFeedback>
            {getFieldDecorator("dateReception", {
              valuePropName: "selected",

              rules: [
                {
                  required: true,
                  message: "selectionnez une date de réception"
                }
              ]
            })(<DatePicker className="date-style"></DatePicker>)}
          </Form.Item>
          <Form.Item label="Test Médical" hasFeedback>
            {getFieldDecorator("test")(<Input placeholder="Test Médical" />)}
          </Form.Item>
          <Form.Item label="montantSurprime" hasFeedback hidden>
            {getFieldDecorator("montantSurprime")(<Input />)}
          </Form.Item>
          <Form.Item label="surprime HT" hasFeedback hidden>
            {getFieldDecorator("surprimeHT")(<Input />)}
          </Form.Item>
          <Form.Item label="surprime Taxe" hasFeedback hidden>
            {getFieldDecorator("surprimeTaxe")(<Input />)}
          </Form.Item>
          <Form.Item label="surprime TTC" hasFeedback hidden>
            {getFieldDecorator("surprimeTTC")(<Input />)}
          </Form.Item>
          <Form.Item label="Observations" hasFeedback>
            {getFieldDecorator("observation")(<TextArea rows={4} />)}
          </Form.Item>

          <Form.Item label="Verdict" hasFeedback>
            {getFieldDecorator("verdict", {
              valuePropName: "selected",
              rules: [
                {
                  required: true,
                  message: "sélectionnez un verdict"
                }
              ]
            })(
              <Select
                labelInValue
                placeholder="sélectionnez"
                onSelect={handleSelect}
              >
                {this.props.verdicts.map(element => {
                  return (
                    <Option
                      key={element.id}
                      value={element.id}
                      label={element.status}
                    >
                      {element.status}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label="Taux surprime"
            hidden={!this.state.hidden ? true : false}
            hasFeedback
          >
            {getFieldDecorator("TauxSurprime")(
              <Input
                name="TauxSurprime"
                placeholder="Taux surprime"
                onChange={this.onChangeSurprime}
              />
            )}
          </Form.Item>
          <Form.Item label="Observation verdict" hasFeedback>
            {getFieldDecorator("observationVerdict")(<TextArea rows={4} />)}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              //disabled={this.state.statuts}
            >
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const ReassuranceAjouter = Form.create()(LaboForm);

export default ReassuranceAjouter;

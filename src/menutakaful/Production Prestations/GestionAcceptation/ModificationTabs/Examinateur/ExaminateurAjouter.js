/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Form,
  Select,
  Button,
  DatePicker,
  Checkbox,
  Col,
  Row,
  Input,
  Spin,
  notification
} from "antd";
import moment from "moment";
import { MEDECIN_EXAMINATEUR } from "../../../../../constants/index";
import {
  ajouterAcceptationTestMedical,
  ajouterAcceptationExaminateur,
  ajouterAcceptationEtape,
  lettreAcceptation,
  getAcceptationExaminateurByAcceptation
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  getInput = () => {
    return (
      <Select style={{ width: "100%" }} placeholder="sélectionnez" labelInValue>
        {this.props.medecins.map(element => {
          return (
            <Option key={element.id} value={element.id} label={element.nom}>
              {element.nom}
            </Option>
          );
        })}
      </Select>
    );
  };
  state = {
    honoraires: [],
    listOnglets: [],
    loading: false,
    orientation: "",
    idOrientation: 0,
    examinateur: [],
    statuts: false
  };

  handleSubmit = e => {
    this.setState({ loading: true, statuts: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterLaboratoire(values);
      }
    });

    this.acceptationsExaminateur(this.props.record.id);
  };

  componentDidMount() {
    let uniqueNames = [];
    let uniqueArray = [];
    const { produit } = this.props.record.contrat;

    produit.normes.forEach(norme => {
      norme.honoraires.forEach(honoraire => {
        if (honoraire.typeAuxiliaireHon.libelle === MEDECIN_EXAMINATEUR) {
          uniqueNames.push({ label: honoraire.libelle, value: honoraire.id });

          let jsonObject = uniqueNames.map(JSON.stringify);

          let uniqueSet = new Set(jsonObject);
          uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        }
      });
    });
    this.setState({ honoraires: [...uniqueArray] });

    this.props.form.setFieldsValue({
      medecin: this.props.record.contrat.orientation
    });

    this.acceptationsExaminateur(this.props.record.id);
  }

  async acceptationsExaminateur(id) {
    let response = await getAcceptationExaminateurByAcceptation(id);
    console.log("response:", response.data);
    if (response.data.length !== 0) {
      this.setState({ examinateur: response.data, statuts: true });
    }
  }
  async jasperLettreAcceptation(requestLettre) {
    let response = await lettreAcceptation(requestLettre);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async ajouterLaboratoire(values) {
    try {
      let verdict = values.verdict.label;
      values.dateVisite = values.dateVisite.format("YYYY-MM-DD");
      values.dateReception = values.dateReception.format("YYYY-MM-DD");
      values.medecin = { id: values.medecin };
      values.verdict = { id: values.verdict.key, status: values.verdict.label };
      values.acceptation = this.props.record;

      let response = await ajouterAcceptationExaminateur(values);

      if (verdict === "Acceptation au tarif normal") {
        const key = `open${Date.now()}`;
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => notification.close(key)}
          >
            Confirmer
          </Button>
        );
        notification.success({
          message: "CONTRAT ACCEPTER",
          description:
            " CONTRAT NUMERO     : " +
            response.data.acceptation.contrat.numeroContrat,
          btn,
          duration: 0,
          key
        });
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
      }
      let testsArray = [];
      values.tests.forEach(element => {
        let object = { id: element };
        testsArray.push(object);
      });
      let tests = {
        acceptationExaminateur: { id: response.data.id },
        acceptation: { id: this.props.record.id },
        honoraires: testsArray
      };
      let responseTest = await ajouterAcceptationTestMedical(tests);
      let responseEtape = await ajouterAcceptationEtape({
        acceptationTestMedical: { id: responseTest.data.id },
        etape: "examinateur",
        dateVerdict: moment().format("YYYY-MM-DD"),
        verdict: values.verdict
      });
      if (
        response.status === 200 &&
        responseTest.status === 200 &&
        responseEtape.status === 200
      ) {
        this.props.parentCallback(responseTest.data);
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
          window.open("/takafulapp/ModificationAcceptation", "_self");
        }
        if (verdict === "Expertise médecin conseil") {
          list.push({
            key: "medecinConseil",
            tab: "Médecin Conseil"
          });
          this.setState({ listOnglets: [...list] });
          this.props.onglet(list);
        }
        if (verdict === "Réassurance") {
          list.push({
            key: "reassurance",
            tab: "Réassurance"
          });
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

    return (
      <Spin spinning={this.state.loading}>
        <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Medecin" hasFeedback>
            {getFieldDecorator("medecin", {
              rules: [
                {
                  required: true,
                  message: "sélectionnez un medecin"
                }
              ]
            })(
              <Select placeholder="sélectionnez">
                {this.props.medecins.map(element => {
                  return (
                    <Option key={element.id} value={element.id}>
                      {element.nom}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Date Visite" hasFeedback>
            {getFieldDecorator("dateVisite", {
              valuePropName: "selected",

              rules: [
                {
                  required: true,
                  message: "selectionnez une date de visite"
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
          <Form.Item label="Tests Médicaux">
            {getFieldDecorator("tests", {
              valuePropName: "checked"
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  {this.state.honoraires.map(element => {
                    return (
                      <Col span={8}>
                        <Checkbox value={element.value} label={element.label}>
                          {element.label}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            )}
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
              <Select labelInValue placeholder="sélectionnez">
                {this.props.verdicts.map(element => {
                  return (
                    <Option
                      selected={element[0]}
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
          <Form.Item label="Observation verdict" hasFeedback>
            {getFieldDecorator("observationsVerdict")(<TextArea rows={4} />)}
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

const ExaminateurAjouter = Form.create()(LaboForm);

export default ExaminateurAjouter;

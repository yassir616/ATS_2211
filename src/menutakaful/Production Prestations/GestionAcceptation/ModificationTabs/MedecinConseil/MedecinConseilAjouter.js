/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  ajouterAcceptationEtape,
  ajouterAcceptationTestMedical,
  ajouterAcceptationConseil,
  lettreAcceptation,
  lettreRejet,
  lettreRenonciation,
  lettreExamenComplementaire,
  getAcceptationConseilByAcceptation,
  lettreAcceptationAvecSurprime
} from "../../AcceptationsAPI";
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
  notification,
  Drawer,
  Icon,
  InputNumber
} from "antd";
import moment from "moment";
import { MEDECIN_CONSEIL } from "../../../../../constants/index";
import {
  ajoutHonoraire,
  getHonoraire
} from "../../../../Parametrage/Honoraires/HonorairesAPI";
import { currencyFormatter, currencyParser } from "../../../../../util/Helpers";
import { getTypeAuxiliaire } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";
import AjouterHonoraire from "../../../../Parametrage/Honoraires/AjouterHonoraire";
const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  state = {
    honoraires: [],
    Allhonoraires: [],
    auxiliaire: [],
    listOnglets: [],
    loading: false,

    medConseil: [],
    hiddenS: false,
    hiddenS: false,
    statuts: false
  };

  handleSubmit = e => {
    this.setState({ loading: true, statuts: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        this.ajouterLaboratoire(values);
      }
    });
    this.acceptationsMedecinConseil(this.props.record.id);
  };

  //  ajouterHon = (values) => {
  //   try {
  //     let response =  ajoutHonoraire(values);
  //     if (response.status === 200) {
  //       this.onClose();
  //       notification.success({
  //         message: "la creation d'honoraire est bien faite"
  //       });
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     if (error.response.data.message === "honoraire already exists") {
  //       notification.error({
  //         message: "ce honoraire existe déja."
  //       });
  //     } else {
  //       notification.error({
  //         message: "Takaful",
  //         description:
  //           error.message ||
  //           "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
  //       });
  //     }
  //   }
  // }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  async getAllHonoraire() {
    let uniqueNames = [];
    let uniqueArray = [];
    let response = await getHonoraire();
    console.log(response.data.content);
    this.setState({
      Allhonoraires: response.data.content
    });
    response.data.content.forEach(honoraire => {
      if (honoraire.typeAuxiliaireHon.libelle === MEDECIN_CONSEIL) {
        uniqueNames.push({ label: honoraire.libelle, value: honoraire.id });

        let jsonObject = uniqueNames.map(JSON.stringify);

        let uniqueSet = new Set(jsonObject);
        uniqueArray = Array.from(uniqueSet).map(JSON.parse);
      }
    });
    this.setState({ honoraires: [...uniqueArray] });
  }

  async getTypeAux() {
    let auxiliaireResponse = await getTypeAuxiliaire();

    this.setState({
      auxiliaire: auxiliaireResponse.data.content
    });
  }

  componentDidMount() {
    this.getAllHonoraire();
    this.getTypeAux();
    this.props.form.setFieldsValue({
      medecin: this.props.record.contrat.orientation
    });
    this.acceptationsMedecinConseil(this.props.record.id);
  }
  async acceptationsMedecinConseil(id) {
    let response = await getAcceptationConseilByAcceptation(id);
    console.log("response:", response.data);
    if (response.data.length !== 0) {
      this.setState({ medConseil: response.data, statuts: true });
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
  async jasperExamenComplementaire(requestExamen) {
    let response = await lettreExamenComplementaire(requestExamen);
    console.log(response);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  onChangeExamenComplementaire = e => {
    //this.setState({ differe: e });
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
  onChangeSurprime = e => {
    //this.setState({ differe: e });
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

  handleMethodeHonoraire = data => {
    this.getAllHonoraire();
    console.log(
      " hi key=  " +
        data.id +
        " hi value=  " +
        data.id +
        " label " +
        data.libelle
    );
  };

  async ajouterLaboratoire(values) {
    console.log("conseil ajout :", values);
    try {
      let verdict = values.verdict.label;
      values.dateExpertise = values.dateExpertise.format("YYYY-MM-DD");
      values.medecin = { id: values.medecin };
      values.verdict = { id: values.verdict.key, status: values.verdict.label };
      values.acceptation = this.props.record;
      values.tauxSurmoralite = parseFloat(values.tauxSurmoralite);
      values.tauxSurprime = parseFloat(values.TauxSurprime);

      let ExamencomplementaireArray = [];
      let examens_complementaire_list = [];

      if (values.examen_complementaire != undefined) {
        values.examen_complementaire.forEach(element => {
          ExamencomplementaireArray.push(element.label);
          examens_complementaire_list.push(element.label);
        });

        // Convert (examens_complementaire) type list to (examens_complementaire_list) type string
        values.examen_complementaire = ExamencomplementaireArray.toString();
      }

      let testsArray = [];
      values.tests.forEach(element => {
        let object = { id: element };
        testsArray.push(object);
      });
      let response = await ajouterAcceptationConseil(values);
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
          montantMourabaha: this.props.record.contrat.capitalAssure,
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
      } else if (verdict === "Examen complementaire") {
        this.getAllHonoraire();
        let requestExamen = {
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
          date: moment().format("DD-MM-YYYY"),
          examinateurId: this.props.record.contrat.orientation,
          examen_complementaire: values.examen_complementaire
        };
        this.jasperExamenComplementaire(requestExamen);
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
      let tests = {
        acceptationConseil: { id: response.data.id },
        acceptation: { id: this.props.record.id },
        honoraires: testsArray
      };

      let responseTest = await ajouterAcceptationTestMedical(tests);
      let responseEtape = await ajouterAcceptationEtape({
        acceptationTestMedical: { id: responseTest.data.id },
        etape: "medecinConseil",
        dateVerdict: moment().format("YYYY-MM-DD"),
        verdict: values.verdict
      });

      if (
        response.status === 200 &&
        responseTest.status === 200 &&
        responseEtape.status === 200
      ) {
        if (examens_complementaire_list != []) {
          // Convert (examens_complementaire) type string to (examens_complementaire_list) type list
          responseTest.data.acceptationConseil.examen_complementaire = examens_complementaire_list;
        } else {
          responseTest.data.acceptationConseil.examen_complementaire = "";
        }

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
        this.setState({ hiddenS: true });
        console.log(this.state.hiddenS);
      } else {
        this.setState({ hiddenS: false });
        console.log(this.state.hiddenS);
      }
      if (e.label === "Examen complementaire") {
        this.setState({ hidden: true });
      } else {
        this.setState({ hidden: false });
        console.log(this.state.hidden);
      }
    };
    return (
      <Spin spinning={this.state.loading}>
        <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Medecin" hasFeedback>
            {getFieldDecorator("medecin", {
              valuePropName: "selected",
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
                    <Option
                      key={element.id}
                      value={element.id}
                      label={element.nom}
                    >
                      {element.nom}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Date Expertise" hasFeedback>
            {getFieldDecorator("dateExpertise", {
              valuePropName: "selected",

              rules: [
                {
                  required: true,
                  message: "selectionnez une Date expertise"
                }
              ]
            })(<DatePicker className="date-style"></DatePicker>)}
          </Form.Item>
          <Form.Item label="Test Médical" hasFeedback>
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
          {/* <Form.Item label="Test Médical" hasFeedback>
            {getFieldDecorator("test")()}
          </Form.Item> */}
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
            label="Examen complementaire"
            hidden={!this.state.hidden ? true : false}
            hasFeedback
          >
            {getFieldDecorator("examen_complementaire")(
              <Select mode="multiple" labelInValue placeholder="Sélectionnez">
                {this.state.Allhonoraires.map(element => {
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
            <div style={{ "padding-right": "0px" }}>
              <AjouterHonoraire
                titre="Création d'un nouvel honoraire"
                testCreation={this.handleMethodeHonoraire}
                isMedecinHonoraire={true}
              />
            </div>
          </Form.Item>
          <Form.Item
            label="Taux surprime"
            hidden={!this.state.hiddenS ? true : false}
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
            {getFieldDecorator("observationsVerdict")(<TextArea rows={4} />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const MedecinConseilAjouter = Form.create()(LaboForm);

export default MedecinConseilAjouter;

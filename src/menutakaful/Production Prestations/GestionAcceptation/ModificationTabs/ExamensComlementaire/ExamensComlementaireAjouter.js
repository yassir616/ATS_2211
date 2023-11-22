/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Button, DatePicker, Form, Input, notification, Select ,Spin} from "antd";
import React, { Component } from "react";
import { LABORATOIRE } from "../../../../../constants/index";
import {
  ajouterAcceptationEtape,
  ajouterAcceptationExamens,
  ajouterAcceptationTestMedical,
  getAcceptationExamnsByAcceptation
} from "../../AcceptationsAPI";
import moment from "moment";
const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  state = { 
    honoraires: [],  
    medExamens:[],
    statuts: false ,  
    loading: false 
  };

  handleSubmit = e => {
    this.setState({ loading: true , statuts: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.ajouterExamens(values);
      }
    });
    this.acceptationsMedecinExamens(this.props.record.id);

  };

  componentDidMount() {
    let array = [];
    const { produit } = this.props.record.contrat;
    produit.normes.forEach(norme => {
      norme.honoraires.forEach(honoraire => {
        if (honoraire.typeAuxiliaireHon.libelle === LABORATOIRE) {
          array.push({ label: honoraire.libelle, value: honoraire.id });
        }
      });
    });
    this.setState({ honoraires: [...array] });
    this.acceptationsMedecinExamens(this.props.record.id);
  }

  async acceptationsMedecinExamens(id) {
    let response = await getAcceptationExamnsByAcceptation(id);
    console.log("response:", response.data);
    if (response.data.length !== 0) {
      this.setState({ medExamens: response.data ,statuts: true });
    }
  }
  async ajouterExamens(values) {
    try {
      values.dateAnalyse = values.dateAnalyse.format("YYYY-MM-DD");
      values.dateReception = values.dateReception.format("YYYY-MM-DD");
      values.laboratoire = { id: values.laboratoire };
      values.acceptation = this.props.record;
      let response = await ajouterAcceptationExamens(values);  
      console.log("values",values);

      // if (verdict === "Acceptation au tarif normal") {
      //   let requestAcceptation = {
      //     intermediaire: this.props.record.contrat.produit.partenaire
      //       .raisonSocial,
      //     nom:
      //       this.props.record.contrat.assure.nom +
      //       " " +
      //       this.props.record.contrat.assure.prenom,
      //     agence: this.props.record.contrat.pointVente.libelle,
      //     numeroAcceptation: this.props.record.code,
      //     montantMourabaha: this.props.record.contrat.capitalAssure,
      //     encours: this.props.record.encours,
      //     cumul: this.props.record.cumul,
      //     duree: this.props.record.contrat.dureeContrat,
      //     differe: this.props.record.contrat.differe,
      //     montantCotisation: this.props.record.contrat.montantCotisation
      //   };
      // } else if (verdict === "Rejet") {
      //   console.log("hello rejet verdict");

      //   let requestRejet = {
      //     intermediaire: this.props.record.contrat.produit.partenaire
      //       .raisonSocial,
      //     nomParticipant:
      //       this.props.record.contrat.assure.nom +
      //       " " +
      //       this.props.record.contrat.assure.prenom,
      //     agence: this.props.record.contrat.pointVente.libelle,
      //     numeroAcceptation: this.props.record.code,
      //     montantFinancement: this.props.record.contrat.capitalAssure,
      //     encours: this.props.record.encours,
      //     cumul: this.props.record.cumul,
      //     duree: this.props.record.contrat.dureeContrat,
      //     differe: this.props.record.contrat.differe,
      //     date: moment().format("DD-MM-YYYY")
      //   };

      // let testsArray = [{ id: values.tests }];

      let test = {
        acceptationExamens: { id: response.data.id },
        acceptation: { id: this.props.record.id },
        //honoraires: testsArray
      };
      let responseTest = await ajouterAcceptationTestMedical(test);
      // let responseEtape = await ajouterAcceptationEtape({
      //   acceptationTestMedical: { id: responseTest.data.id },
      //   etape: "medecinConseil",
      //   // dateVerdict: moment().format("YYYY-MM-DD"),
      //   // verdict: values.verdict
      // });

      if (
        response.status === 200 &&
         responseTest.status === 200// &&
        // responseEtape.status === 200
      ) {
        this.props.parentCallback(responseTest.data);

        notification.success({
          message: "bien ajouté"
        });
        this.setState({ loading: false });
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
        <Form.Item label="Laboratoire" hasFeedback>
          {getFieldDecorator("laboratoire", {
            valuePropName: "selected",
            rules: [
              {
                required: true,
                message: "sélectionnez un laboratoire"
              }
            ]
          })(
            <Select placeholder="sélectionnez">
              {this.props.laboratoires.map(element => {
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
        <Form.Item label="Date Analyse" hasFeedback>
          {getFieldDecorator("dateAnalyse", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "selectionnez une date d'analyse"
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
        <Form.Item label="Observations" hasFeedback>
          {getFieldDecorator("observations")(<TextArea rows={4} />)}
        </Form.Item>
        {/* <Form.Item label="Verdict" hasFeedback>
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
        </Form.Item> */}
        {/* <Form.Item label="Observation verdict" hasFeedback>
          {getFieldDecorator("observationsVerdict")(<TextArea rows={4} />)}
        </Form.Item> */}
        <Form.Item {...tailFormItemLayout}>
          <Button 
          type="primary" 
          htmlType="submit"
          disabled={this.state.statuts}>
            Ajouter
          </Button>
        </Form.Item>
      </Form>
      </Spin>

    );
  }
}

const ExamensComlementaireAjouter = Form.create()(LaboForm);

export default ExamensComlementaireAjouter;

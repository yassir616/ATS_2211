/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {  
  AutoComplete,
  Button,
  Col,
  Form,
  Row,
  Select,
  Input,
  Icon,
  Spin,
  notification
} from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import HonoraireTable from "./HonoraireTable";
import RecherchPrestationHonoraire from "./RecherchPrestationHonoraire";
import {
  getTypeAuxiliaire,
  getAuxiliaires
} from "../../Parametrage/Auxiliaires/AuxiliaireAPI";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { getDecesProduit } from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import { getPrestationStatus } from "../../Parametrage/TypePrestation/PrestationAPI";
import { getacceptationTestByAuxiliaire } from "../GestionAcceptation/AcceptationsAPI";

const { Option } = Select;
class Honoraire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      produit: {},
      status: {},
      typeAuxiliaireSelectedValue: {},
      auxiliaire: {},
      partenaires: [],
      numContrat: "",
      nomParticipant: "",
      produits: [],
      produitPartenaire: [],
      typeAuxiliaire: [],
      auxiliaires: [],
      auxiliairesParType: [],
      prestationStatus: [],
      ShowHonoraireTable: false,
      testsMedicalListByAuxiliaire: [],
      montantGlobale: 0,
      ShowRechercheHonoraireTable: false,
      typeFiscal: "",
      aux: [],
      loading : false
    };
  }
  componentDidMount() {
    this.getpropreties();
  }
  async getpropreties() {
    let respence = await getAllPartenaire();
    let produitRespence = await getDecesProduit();
    let typeAuxiliareRespence = await getTypeAuxiliaire();
    let auxiliaresRespence = await getAuxiliaires();
    let prestationStatusRespence = await getPrestationStatus();
    this.setState({
      prestationStatus: prestationStatusRespence.data,
      partenaires: respence.data.content,
      produits: produitRespence.data.content,
      typeAuxiliaire: typeAuxiliareRespence.data.content,
      auxiliaires: auxiliaresRespence.data.content,
      auxiliairesParType:auxiliaresRespence.data.content
    });
    console.log(this.state.numContrat);
    console.log(this.state.nomParticipant);

 
  }
  handlePartnerChange = value => {
    let list = [...this.state.produits];
    this.setState({
      produitPartenaire: list.filter(item => item.partenaire.id === value.key)
    });
  };
  handleTypeAuxiliaireChange = value => {
    let list = [...this.state.auxiliaires];
    this.setState({ typeAuxiliaireSelectedValue: value });
    if (value.label === "exames") {
      this.setState({
        auxiliairesParType: list
      });
    } else if (value.label === "specialiste") {
      this.setState({
        auxiliairesParType: list.filter(
          item => item.typeAuxiliaire.libelle !== value.label
        )
      });
    } else {
      this.setState({
        auxiliairesParType: list.filter(
          item => item.typeAuxiliaire.id === value.key
        )
      });
    }
  };
  addition = elements => {
    let montant = 0;
    elements.forEach(element => {
      montant = montant + element.montantHonoraire;
    });
    return montant;
  };
  async getacceptationTestsByAuxiliaire(
    auxiiliaire,
    type,
    partenaire
  ) {
    let respence = await getacceptationTestByAuxiliaire(
      auxiiliaire,
      type,
      partenaire
    );
    console.log("testMedical:", respence);
    let list = [];
    respence.data.forEach(element => {
      list.push({ ...element, key: element.id });
    });
    this.setState({
      auxiliaire: this.state.aux[0],
      testsMedicalListByAuxiliaire: [...list],
      ShowHonoraireTable: true,
      loading : false
    });
  }
  handleSubmit = e => {

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!values.partenaire) {
            notification.warning({
              message: " Champ partenaire est vide !",
              description:
                "veuillez saisir le partenaire d'honoraire que vous souhaitez chercher"
            });
      } 
      if (!values.auxiliaire) {
        notification.warning({
          message: " Champ auxiliaire est vide !",
          description:
            "veuillez saisir l'auxiliaire d'honoraire que vous souhaitez chercher"
        });
      }
      let type="";
      if(!values.typeAuxiliaire){
        type = "undefined";
      }else {
        type = values.typeAuxiliaire.label;
      }
      if (!err) {
        let auxi = values.auxiliaire.key.split("_");
        this.getacceptationTestsByAuxiliaire(
          auxi[0],
          type,
          values.partenaire.key
        );
        console.log("test aux");
        console.log(auxi);
      }
    });
  };
  onClickSearch = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!values.status) {
        notification.warning({
          message: " Champ status est vide !",
          description:
            "veuillez saisir le status d'honoraire que vous souhaitez chercher"
        });
      } else {
        if (!err) {
          this.setState({ ShowRechercheHonoraireTable: true });
        }
      }
    });
  };
  onChangeProduit = value => {
    this.setState({ produit: value });
    this.setState({
      ShowRechercheHonoraireTable: false,
      ShowHonoraireTable: false
    });
  };

  onChangeStatus = value => {
    this.setState({ status: value });
    this.setState({
      ShowRechercheHonoraireTable: false
    });
  };
  onChangeNumContrat = e => {
    this.setState({ numContrat: e.target.value });
  };
  onChangeNomParticipant = e => {
    this.setState({ nomParticipant: e.target.value });
  };
  onChangeAuxiliaire = value => {
    this.setState({ auxiliaire: value, aux: value.key.split("_") });
    console.log(value.key);

    this.setState({
      ShowRechercheHonoraireTable: false,
      ShowHonoraireTable: false
    });
  };
  isLoading =()=>{
    this.setState({loading:true});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.form);
    const {loading} = this.state;

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
      <div>
        <Row>
          <ComponentTitle title="Honoraires" />
          <Col span={24} offset={1} style={{ margin: "0 auto" }}>
            <input
              className="not-rounded criteres-rech"
              placeholder="Critères de Recherche"
              disabled
            />
            <div
              className="div-criteres"
              style={{
                padding: 10,
                width: 1400,
                background: "#fff",
                borderTop: "3px solid #eaa76c"
              }}
            >
              <Spin spinning={loading}>
              <Form
                {...formItemLayout}
                
                onSubmit={this.handleSubmit}
                ref={ref => {
                  this.form = ref;
                }}
                hideRequiredMark
              >
                <Row>
                  <Col span={6} className="col-form">
                    <Form.Item label="Partenaire " hasFeedback>
                      {getFieldDecorator("partenaire", {
                        valuePropName: "selected"
                      })(
                        <Select
                          placeholder="Veuillez selectionner"
                          optionLabelProp="label"
                          onChange={this.handlePartnerChange}
                          labelInValue
                        >
                          {this.state.partenaires.map(element => {
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
                      )}
                    </Form.Item>
                  </Col>
                 
                  <Col span={6} className="col-form">
                    <Form.Item label="Produit" hasFeedback>
                      {getFieldDecorator("produit", {
                        valuePropName: "selected"
                      })(
                        <Select
                          placeholder="Veuillez selectionner"
                          optionLabelProp="label"
                          onChange={this.onChangeProduit}
                          labelInValue
                        >
                          {this.state.produitPartenaire.map(element => {
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
                  
                  <Col span={6} className="col-form">
                    <Form.Item label="Status " hasFeedback>
                      {getFieldDecorator("status", {
                        valuePropName: "selected"
                      })(
                        <Select
                          placeholder="Veuillez selectionner"
                          optionLabelProp="label"
                          onChange={this.onChangeStatus}
                          labelInValue
                        >
                          {this.state.prestationStatus.map(element => {
                            return (
                              <Option
                                key={element.value}
                                value={element.value}
                                label={element.name}
                              >
                                {element.name}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Type auxiliaire " hasFeedback>
                      {getFieldDecorator("typeAuxiliaire", {
                        valuePropName: "selected"
                      })(
                        <Select
                          placeholder="Veuillez selectionner"
                          optionLabelProp="label"
                          labelInValue
                          onChange={this.handleTypeAuxiliaireChange}
                        >
                          {this.state.typeAuxiliaire.map(element => {
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
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Auxiliaire " hasFeedback>
                      {getFieldDecorator("auxiliaire", {
                        valuePropName: "selected"
                      })(
                        <AutoComplete
                            size="default"
                            className="not-rounded"
                            style={{ width: 182 }} 
                            dataSource={this.state.auxiliairesParType.map(element => {
                              return (
                                <Option
                                  key={element.id+"_"+element.typeFiscal}
                                  value={element.id+"_"+element.typeFiscal}
                                  label={element.nom+"_"+element.typeFiscal}
                                >
                                  {element.prenom+" "+element.nom} 
                                </Option>
                              );
                            })}
                            onSelect={this.onChangeAuxiliaire}
                            allowClear={true}
                            labelInValue
                            placeholder="Numéro de patente"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="N° contrat " hasFeedback>
                      {getFieldDecorator("numContrat", {
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(
                        <Input
                          placeholder="N° Contrat"
                          onChange={this.onChangeNumContrat}
                        ></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="N° d'acceptation " hasFeedback>
                      {getFieldDecorator("numAcceptation", {
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(
                        <Input
                          placeholder="N° acceptation"
                          optionLabelProp="label"
                        ></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Nom participant" hasFeedback>
                      {getFieldDecorator("nomParticipant", {
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(
                        <Input
                          placeholder="Nom"
                          optionLabelProp="label"
                          onChange={this.onChangeNomParticipant}
                        ></Input>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}></Col>
                  <Col span={8}></Col>
                  <Col span={8}>
                    <Button
                      style={{ float: "right" }}
                      className="rech-btn"
                      type="default"
                      onClick={this.onClickSearch}
                    >
                      Recherche
                    </Button>
                    <Button
                      style={{ float: "right", marginRight: "2%" }}
                      className="nouveau-btn"
                      type="primary"
                      htmlType="submit"
                      onClick={this.isLoading}
                    >
                      Nouvel Honoraire
                    </Button>
                  </Col>
                </Row>
              </Form>
              </Spin>
            </div>
          </Col>
        </Row>
        <Col offset={1}>
          {this.state.ShowHonoraireTable && (
            <HonoraireTable
              auxiliaire={this.state.aux[0]}
              tests={this.state.testsMedicalListByAuxiliaire}
              montantGlobale={this.state.montantGlobale}
              typeFiscal={this.state.aux[1]}
              produit={this.state.produit}
            ></HonoraireTable>
          )}
          {this.state.ShowRechercheHonoraireTable && (
            <RecherchPrestationHonoraire
              auxiliaire={this.state.aux[0]}
              typeAuxiliaire={this.state.typeAuxiliaireSelectedValue}
              status={this.state.status}
              Allstatus={this.state.prestationStatus}
              produit={this.state.produit}
              contrat={this.state.numContrat}
              participant={this.state.nomParticipant}
              prestationStatus={this.state.prestationStatus}
            ></RecherchPrestationHonoraire>
          )}
        </Col>
      </div>
    );
  }
}

const HonoraireForm = Form.create()(Honoraire);

export default HonoraireForm;

/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import "./produitMrb.css";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Divider,
  Icon,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table
} from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { updateProductMrb } from "./ProduitMRBAPI";
import { getExclusion } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
const { Option } = Select;
let key = 0;
let exclusFamille = "MRB";
class ModifieProduitMRB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      periodicite: [],
      exclusions: [],
      tarifications: [],
      data: [],
      visible: false,
      partenaire: [],
      valueBat :[],
      affichageTarif :[],
      periodicites: {
        value: this.props.record.location.state.record.periodicitesMrb.map(
          element => {
            return element.id;
          }
        )
      },
      exclusion: {
        value: this.props.record.location.state.record.exclusionsProduit.map(
          element => {
            return element.id;
          }
        )
      }
    };
   
    this.columns = [
      {
        title: "Nature du bien assuré",
        dataIndex: "natureBienAssure",
        key: "natureBienAssure"
      },
   
      {
        title: "Valeur Batiment",
        dataIndex: "valeurBatiment",
        key: "valeurBatiment"
      },
      {
        title: "Contenu",
        dataIndex: "contenu",
        key: "contenu"
      },
      {
        title: "Prime Net",
        dataIndex: "primeNet",
        key: "primeNet"
      },
      {
        title: "Opération",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <Popconfirm
              title="etes-vous sur?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a href="#top">
                <Icon type="delete" theme="twoTone" />
              </a>
            </Popconfirm>
          ) : null
      }
    ];
  }

  handleDelete = keyMrb => {
    const data = [...this.state.data];
    const dt = [...this.state.affichageTarif];
    this.setState({ data: data.filter(item => item.key !== keyMrb) });
    this.setState({ affichageTarif: dt.filter(item => item.key !== keyMrb) });
  };

  componentDidMount() {
    this.getAllPeriodicite();
    this.getAllExclusion(exclusFamille);
    this.getAllPartenaires();
    let period = [];
    this.props.record.location.state.record.periodicitesMrb.forEach(element => {
      period.push({ id: element });
    });
    console.log("test tarif");
    let req;
    let reqs;
    this.props.record.location.state.record.tarificationsMrb.forEach(element => {
      req = {
        key: key,
        natureBien: element.natureBien,
        valeurBatiment: currencyFormatter(element.valeurBatiment),
        contenu:currencyFormatter(element.contenu),
        primeNet :currencyFormatter(element.primeNet),
        
      };
        reqs = {
        key: key,
        natureBien: element.natureBien,
        valeurBatiment: element.valeurBatiment,
        contenu:element.contenu,
        primeNet :element.primeNet,
        
      };
      this.state.affichageTarif.push(req);
      this.state.data.push(reqs);
      key = key + 1;
    });
    console.log(this.props.record.location.state.record.tarificationsMrb);
    this.props.record.location.state.record.periodicitesMrb = [...period];
    this.props.form.setFieldsValue({
      libelle: this.props.record.location.state.record.libelle,
      code: this.props.record.location.state.record.code,
      natureSouscripteur: this.props.record.location.state.record
        .natureParticipant,
      natureAssure: this.props.record.location.state.record.natureAssure,
      assureDiffParticipant: this.props.record.location.state.record
        .assureDiffParticipant,
      natureBienAssure: this.props.record.location.state.record.natureBien,
      franchiseIncendie: this.props.record.location.state.record
        .franchiseIncendie,
      franchiseBrisGlace: this.props.record.location.state.record
        .franchiseBrisGlace,
      franchiseDegatEaux: this.props.record.location.state.record
        .franchiseDegatEaux,
      franchiseCatastrophesNaturelles: this.props.record.location.state.record
        .franchiseCatastropheNaturelles,
      tauxTaxe: this.props.record.location.state.record.tauxTaxe,
      montantMaximum: this.props.record.location.state.record
        .montantMaximumGarantie,
      fraisGestion: this.props.record.location.state.record.fraisGestion,
      tvaFraisGestion: this.props.record.location.state.record.tvaFraisGestion,
      delaiEnAttente: this.props.record.location.state.record.delaiPrescription,
      delaiSansSouscription: this.props.record.location.state.record
        .delaiPrescriptionSansSouscription,
      intermediaire: this.props.record.location.state.record.partenaire.id,
      periodicites: this.state.periodicites.value,
      exclusion: this.state.exclusion.value
    });
    let j=50000;
    for(let i=200000;i<=15000000;i=i+j)
    {
      if(i==1000000)
      {
        j=100000;
      }
      if(i==2000000)
      {j=200000;}
      if(i==2200000)
      {
      continue;}
      if(i==5000000)
      {j=5000000;}

      this.state.valueBat.sort((a, b) => a - b);
      this.state.valueBat.push(i);
    }
    this.state.valueBat.push(2500000);
    this.state.valueBat.push(4500000);
    this.state.valueBat.sort((a, b) => a - b);
  }

  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }

  async getAllPartenaires() {
    let response = await getAllPartenaire();
    this.setState({
      partenaire: response.data.content
    });
  }

  async updatedProductMrb(id, body) {
    await updateProductMrb(id, body);
    this.props.record.history.push("/ProduitMrb");
  }

  async getAllExclusion(famille) {
    let response = await getExclusion(famille);
    this.setState({
      exclusions: response.data.content
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {//values.natureBien != "" && values.natureBien != null &&
      if( values.valeurBatiment != null
      && values.primeNet>0)
      {
      let request = {
        key: key,
        natureBien: values.natureBien,
        valeurBatiment: values.valeurBatiment,
        contenu:values.contenu,
        primeNet :values.primeNet,
      };
      let req = {
        key: key,
        natureBien: values.natureBien,
        valeurBatiment: currencyFormatter(values.valeurBatiment),
        contenu:currencyFormatter(values.contenu),
        primeNet :currencyFormatter(values.primeNet),
        
      };
      this.state.affichageTarif.push(req);
      this.state.data.push(request);
      key = key + 1;
      this.setState({ visible: false });
    }
    else{this.setState({ visible: true });}
  });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    this.props.form.setFieldsValue({
      natureBien: "",
      valeurBatiment: "",
      primeNet: "",
      contenu: ""
    });
  };
  handlechangevaleurBatiment = value => {
    let contenu = value / 5 ;
    this.props.form.setFieldsValue({
      contenu : contenu
    });
    
};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let exclus = [];
      values.exclusion.forEach(element => {
        exclus.push({ id: element });
      });
      values.exclusion = [...exclus];
      let periodicite = [];
      values.periodicites.forEach(element => {
        periodicite.push({ id: element });
      });
      values.periodicites = [...periodicite];
      let data2 = [];

      for (let index = 0; index < this.state.data.length; index++) {
        let data = {
        natureBienAssure: this.state.data[index].natureBien,
        valeurBatiment: this.state.data[index].valeurBatiment,
        contenu:this.state.data[index].contenu,
        primeNet :this.state.data[index].primeNet,
        };
        data2.push(data);
      }
      let requestModel = {
        code: values.code,
        libelle: values.libelle,
        natureParticipant: values.natureSouscripteur,
        natureAssure: values.natureAssure,
        assureDiffParticipant: values.assureDiffParticipant,
        franchiseIncendie:true, //values.franchiseIncendie,
        franchiseBrisGlace: true,//values.franchiseBrisGlace,
        franchiseDegatEaux: true,//values.franchiseDegatEaux,
        franchiseCatastropheNaturelles: true,//values.franchiseCatastrophesNaturelles,
        tauxTaxe: values.tauxTaxe,
        montantMaximumGarantie: values.montantMaximum,
        fraisGestion: values.fraisGestion,
        tvaFraisGestion: values.tvaFraisGestion,
        delaiPrescription: values.delaiEnAttente,
        delaiPrescriptionSansSouscription: values.delaiSansSouscription,
        exclusionsProduit: values.exclusion,
        periodicitesMrb: values.periodicites,
        partenaireId: values.intermediaire,
        tarificationsMrb: data2
      };
      console.log("test requestModel");
      console.log(requestModel);
      this.updatedProductMrb(
        this.props.record.location.state.record.id,
        requestModel
      );
    });
  };
  handleReload() {
    window.location.replace('/ProduitMRB');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <div>
        <ComponentTitle title="Modification du produit MRB" />
        <Modal
          visible={visible}
          title="Ajout de tarification"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              className="not-rounded"
            >
              Annuler
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              className="not-rounded"
            >
              Ajouter
            </Button>
          ]}
        >
          <Form {...formItemLayout} hideRequiredMark>
            <Col>


          <Form.Item label="Valeur Batiment" required={false}>
            {getFieldDecorator("valeurBatiment", {
              rules: [
                {
                  required: true,
                  message: "Champs obligatoire."
                }
              ]
            })(
              <Select
              className="not-rounded"
              addonAfter="Dhs"
              placeholder="Valeur Batiment"
              onChange={this.handlechangevaleurBatiment}
            >
              {this.state.valueBat.map(element => {
                return (
                  <Option
                  key={element}
                  value={element}
                  label={element} 
                >
                  {currencyFormatter(element)}
                </Option>
                );
              })}
            </Select>
          
            )}
</Form.Item>


<Form.Item label="Contenu" required={false}>
  {getFieldDecorator("contenu", {
    rules: [
      {
        required: true,
        message: "Champs obligatoire."
      }
    ]
  })(
    <InputNumber
      className="not-rounded"
      addonAfter="Dhs"
      //placeholder="contenu"
      formatter={currencyFormatter}
      parser={currencyParser}
      disabled
    />
  )}
</Form.Item>
<Form.Item label="Prime Net" required={false}>
  {getFieldDecorator("primeNet", {
    rules: [
      {
        required: true,
        message: "Champs obligatoire."
      }
    ]
  })(
    <InputNumber
      className="not-rounded"
      addonAfter="Dhs"
      placeholder="Prime Net"
      onChange={this.handleChangePrimeNet}
      formatter={currencyFormatter}
      parser={currencyParser} 
    />
  )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> MAD </span>
</Form.Item>


            </Col>
          </Form>
        </Modal>
        <div style={{ background: "#ECECEC", padding: "20px" }}>
          <Form id="formadd" {...formItemLayout}>
            <Row gutter={12}>
              <Col span={12}>
                <Card
                  title="Informations Générales"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item label="Libelle">
                    {getFieldDecorator("libelle", {
                      rules: [
                        {
                          required: true,
                          message: "entrez la libelle"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Abréviation">
                    {getFieldDecorator("code", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Intermédiaire">
                    {getFieldDecorator("intermediaire", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select placeholder="Selectionnez ...">
                        {this.state.partenaire.map(element => {
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
                  <Form.Item label="Periodicité">
                    {getFieldDecorator("periodicites", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select mode="multiple" placeholder="Selectionnez ...">
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
                  <Form.Item label="Exclusion">
                    {getFieldDecorator("exclusion", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select mode="multiple" placeholder="Selectionnez ...">
                        {this.state.exclusions.map(element => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.exclusionNom}
                            >
                              {element.exclusionNom}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Card>
                <Card
                  title="Franchise"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item>
                    {getFieldDecorator("franchiseIncendie", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <Checkbox checked
                      /*   defaultChecked={
                          this.props.record.location.state.record
                            .franchiseIncendie
                        } */
                      >
                        Franchise incendie
                      </Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseBrisGlace", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(
                      <Checkbox checked
                        /* defaultChecked={
                          this.props.record.location.state.record
                            .franchiseBrisGlace
                        } */
                      >
                        Franchise bris de glace
                      </Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseDegatEaux", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(
                      <Checkbox checked
                        /* defaultChecked={
                          this.props.record.location.state.record
                            .franchiseDegatEaux
                        } */
                      >
                        Franchise dégats des eaux
                      </Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseCatastrophesNaturelles", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(
                      <Checkbox checked style={{ display: 'none' }}
                      /*   defaultChecked={
                          this.props.record.location.state.record
                            .franchiseCatastropheNaturelles
                        } */
                      >
                        Franchise catastrophes naturelles
                      </Checkbox>
                    )}
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Paramètres globaux"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item label="Frais de gestion Wakala">
                    {getFieldDecorator("fraisGestion", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <Form.Item label="TVA frais de gestion">
                    {getFieldDecorator("tvaFraisGestion", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <Form.Item label="Montant max de garantie">
                    {getFieldDecorator("montantMaximum", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> MAD </span>
                  </Form.Item>
                  <Form.Item label="Taux taxe">
                    {getFieldDecorator("tauxTaxe", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <label>
                    <Form.Item label=" Délai de prescription de l’offre EART" />
                  </label>
                  <Form.Item label="En l’attente du retour client">
                    {getFieldDecorator("delaiEnAttente", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })( <InputNumber
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />)}<span class="input-group-text" style={{ fontWeight: 'bold' }}> Jours </span>
                  </Form.Item>
                  <Form.Item label="Client sans souscription">
                    {getFieldDecorator("delaiSansSouscription", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })( <InputNumber
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />)}<span class="input-group-text" style={{ fontWeight: 'bold' }}> Jours </span>
                  </Form.Item>
                </Card>
                {/*<Card
                  title="Souscripteur/ Assuré"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item>
                    {" "}
                    {getFieldDecorator("assureDiffParticipant", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Checkbox
                        defaultChecked={
                          this.props.record.location.state.record.fraisGestion
                        }
                      >
                        Assuré différent du participant
                      </Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item label="Nature du participant/souscripteur">
                    {getFieldDecorator("natureSouscripteur", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Nature de l'assuré">
                    {getFieldDecorator("natureAssure", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  </Card>*/}
                  
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card
                  title="Tarification"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns}
                    dataSource={this.state.affichageTarif}
                  />
                  <Button
                    type="primary"
                    className="not-rounded"
                    onClick={this.showModal}
                    style={{ marginTop: 8 }}
                  >
                    <Icon type="plus" />
                    Ajouter
                  </Button>
                </Card>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="not-rounded"
                style={{ marginLeft: "970px", width: "25%", marginTop: 40 }}
                onClick={this.handleSubmit}
              >
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
          <Button
          type="primary"
          className="add-button"
          onClick={() => this.handleReload()}
        >
          <Icon type="arrow-left" />
          Retour
        </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(ModifieProduitMRB);

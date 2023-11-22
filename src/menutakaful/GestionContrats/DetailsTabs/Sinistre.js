/* eslint-disable react/prop-types */
import "./Sinistre.css";
import "antd/dist/antd.css";
import {
  Spin,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Table,
  Upload
} from "antd";
//import {getCompteBancaire} from "./../../TableauBord/CotisationAPI"
import moment from "moment";
import React, { Component } from "react";
import { getSinistre, setStatut, deleteSinistre } from "./SinistreAPI";
import { updatePrestationSinistre } from "../../Parametrage/TypePrestation/PrestationAPI";
import {
  getExclusion,
  getPieceJointByNumeroSinistre,getUploadedFilesByPrestationId
} from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import axios from "axios";
import { CONNECTION_URL } from "../../../constants/source";
import {ACCESS_TOKEN} from "../../../constants/index";
import { MyContext } from "../ConsultDecesContrat";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;
const { TextArea } = Input;
const code ="Décès";
var id = "";
var id_sinistre = "";
var statut = "";
var beneficiaire = {};
const famille = "Deces";
class Sinistre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left",
      data: [],
      add: false,
      remplie: "",
      visible: false,
      visibled: false,
      exclusions: [],
      pieceJointe: [],
      keyRecord: "",
      agenceBancaire: true,
      numeroSinistre:"",
      responseSinistre : {},
      visibleSinistre:false,
      loading: false,
      prestationId :"",
      uploadedFiles:[],
      importedFiles: {},
    };
    this.columns = [
      {
        title: "Numéro de sinistre",
        dataIndex: "numeroSinistre",
        key: "numeroSinistre",
        render: (text, record) => {
          return (
            <span>
              <a
                type="primary"
                onClick={() => this.handleChange(record)}
                size="small"
                style={{ borderRadius: "0px" }}
              >
                {text}
              </a>
            </span>
          );
        }
      },
      {
        title: "Date de survenance",
        dataIndex: "dateSurvenance",
        key: "dateServenance"
      },
      {
        title: "date déclaration sinistre",
        dataIndex: "dateDeclarationSinistre",
        key: "dateDeclarationSinistre"
      },
      {
        title: "Statut",
        dataIndex: "status",
        render: (text, record) => {
          return (
            <span>
              <Select
                placeholder="Please select"
                onChange={this.handleChangeed}
                style={{ width: "100%" }}
                defaultValue={text}
              >
                <Option
                  value="EN_COURS"
                  onClick={() => this.handleRecord(record)}
                >
                  EN COURS
                </Option>
                <Option
                  value="A_signer"
                  onClick={() => this.handleRecord(record)}
                >
                  À SIGNER
                </Option>
                <Option
                  value="ANNULER"
                  onClick={() => this.handleRecord(record)}
                >
                  ANNULER
                </Option>
                <Option
                  value="REJ_CONTRAT_ECHU"
                  onClick={() => this.handleRecord(record)}
                >
                  REJ CONTRAT ECHU
                </Option>
              </Select>
            </span>
          );
        }
      }
    ];
    this.columns1 = [
      {
        title: "Numéro de sinistre",
        dataIndex: "numeroSinistre",
        key: "numeroSinistre",
        render: (text, record) => {
          return (
            <span>
              <a
                type="primary"
                onClick={() => this.handleChange(record)}
                size="small"
                style={{ borderRadius: "0px" }}
              >
                {text}
              </a>
            </span>
          );
        }
      },
      {
        title: "Date de survenance",
        dataIndex: "dateSurvenance",
        key: "dateServenance"
      },
      {
        title: "date déclaration sinistre",
        dataIndex: "dateDeclarationSinistre",
        key: "dateDeclarationSinistre"
      },
      {
        title: "Statut",
        dataIndex: "status",
        key: "statut"
      }
    ];
    // this.columnsPJ=[
    //   {
    //     title: "Libelle",
    //     dataIndex: "libelle",
    //     key: "libelle"
    //   },
    //   {
    //     title: "A fournir",
    //     dataIndex: "fournir",
    //     key: "fournir"
    //   },
    //   {
    //     title: "O/F",
    //     dataIndex: "o/f",
    //     key: "o/f"
    //   },
    //   {
    //     title: "Reçu",
    //     dataIndex: "reçu",
    //     key: "reçu"
    //   },
    //   {
    //     title: "Date Reception",
    //     dataIndex: "dateReception",
    //     key: "dateReception"
    //   },

    // ]
  }

  componentDidMount() {
    this.getSinistres(id);
    this.getAllExclusion(famille);
  }
  // async getAllComptes() {
  //     let response = await getCompteBancaire();
  //     if(response.status==200){
  //       this.setState({
  //         comptes: response.data.content
  //       });
  //       console.log("response",response.data.content)
  //     }
  //     else(console.log("failel getComptes Bancaire function!!!!"))   
  // }

  onChanged = e => {
    this.setState({
      agenceBancaire: e.target.value
    });
  };

  handleChangeed = value => {
    statut = value;
    if (value === "A_signer") {
      this.setState({
        visible: true
      });
    } else if (value === "EN_COURS") {
      let request = { motif: "" };
      this.setStatuts(id_sinistre, value, request);
    } else if (value === "ANNULER") {
      this.setState({
        visibled: true
      });
    }
  };

  handleOk = () => {
    let request = { motif: "" };
    this.setStatuts(id_sinistre, statut, request);
    this.setState({ visible: false });
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let request = { motif: values.motif };
        this.setStatuts(id_sinistre, statut, request);
        this.setState({ visibled: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  async updatePrestationSinistres(body, id_prestation) {
    let response = await updatePrestationSinistre(body, id_prestation);
    if(response.status=200){
      let dataSource = [];
     dataSource.push(response.data);
    this.setState({
      data: dataSource,
      visibleSinistre:false,
      loading : false
    });
    notification.success({
      message: "TAKAFUL",
      description: "Modification du sinistre "+response.data.numeroSinistre+" avec succès."
    });
    }else{
      notification.error({
        message: "Takaful",
        description:
          "Veuillez Bien remplir les données"
      })
    }
  }

  async setStatuts(idSinistre, statuts, model) {
    await setStatut(idSinistre, statuts, model);
  }
  async getAllExclusion(exclusionFamille) {
    let response = await getExclusion(exclusionFamille);
    this.setState({
      exclusions: response.data.content
    });
  }

  getSinistres = idContrat => {
    getSinistre(idContrat).then(response => {
      let newDataList = [];
      response.data.forEach(element => {
        let key = { key: element.id };
        element = { ...element, ...key };
        newDataList.push(element);
      });
      console.log("response",response.data);
      this.setState({ responseSinistre:response.data[0]  });
      console.log("newdataList:", newDataList);
      this.setState({ data: newDataList });
      if (this.state.data[0] !== undefined) {
        this.setState({ remplie: this.state.data[0].status });
      }
    });
  };

  async deletePrestationSinistre(idPrestation) {
    try {
      let response = await deleteSinistre(idPrestation);
      if (response.status === 200) {
        notification.success({
          message: "Sinistre annulé !"
        });
      }
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Désolé! Un problème est survenu. Veuillez réessayer!"
      });
    }
  }

  handleRecord = value => {
    id_sinistre = value.id;
  };

  handleChange = value => {
    console.log("id de la prestation 1",value.id);
    this.setState({
        prestationId : value.id
    });
    console.log("pieceJointed",this.state.pieceJointe)
    this.setState({ visibleSinistre:true  });
    console.log("value",value.numeroCompte)
    const SelectedSinistre=this.state.responseSinistre;
    console.log("selectedSinistre",SelectedSinistre)
    console.log("value : ",value)
    this.setState({ numeroSinistre:SelectedSinistre.numeroSinistre  });
    console.log("sinistre nuomer",SelectedSinistre.numeroSinistre)
    this.setState({ add: true, keyRecord: value.id }, () => {
      var dateDeclaration = new Date(
        moment(value.dateDeclarationSinistre, "DD/MM/YYYY ")
      );
      console.log("dateDeclaration M",dateDeclaration);
      console.log("date Declaration",value.dateDeclarationSinistre)

      var dateSurvenance = new Date(
        moment(value.dateSurvenance, "DD/MM/YYYY ")
      );
      var dateApres = new Date(moment(value.creationDate, "DD/MM/YYYY "));
      var diffDeclaration = Math.abs(dateApres.getTime() - dateDeclaration.getTime());
      var dureeDeclaration = (diffDeclaration / (1000 * 60 * 60 * 24)).toFixed(
        0
      );
      var diffSurvenance = Math.abs(dateApres.getTime() - dateSurvenance.getTime());
      var dureeSurvenance = (diffSurvenance / (1000 * 60 * 60 * 24)).toFixed(0);
      this.props.form.setFieldsValue({
        dateCreation: moment(SelectedSinistre.creationDate, "DD/MM/YYYY "),
        numeroSinistre: SelectedSinistre.numeroSinistre,
        dateDeclarationSinistre: moment(
          value.dateDeclarationSinistre,
          "DD/MM/YYYY"
        ),
        dateSurvenance: moment(value.dateSurvenance, "DD/MM/YYYY"),
        dureeDeclaration: dureeDeclaration,
        dureeSurvenance: dureeSurvenance,
        commentaire: value.commentaire,
        crd: value.crd,
        montantRegler: value.montantRegler,
        typeSinistre: value.natureSinistre,
        nbrEcheanceImpayees: value.nbrEcheanceImpaye,
        numeroCompte: value.numeroCompte,
        reglementPartiel: value.reglementPartiel,
        tauxInvalidite: value.tauxInvalidite,
        modeReglement: value.modeReglement,
        beneficiaire: beneficiaire.id,
        exclusions : value.exclusions.map(
          element => {
            return element.id;
          }
        ),
        causeSinistre:value.causeSinistre,
        agenceBancaire:value.beneficiaireAgenceBancaire
      });
    });
    this.getAllPieceByNumeroSinistre(SelectedSinistre.numeroSinistre);
     
    this.uploadedFilesSinistreByPrestationId(value.id);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading:true });
    console.log('id de la prestation 2',this.state.prestationId);
    const { importedFiles } = this.state;
    const fileKeys = Object.keys(importedFiles);

    if (fileKeys.length > 0) {
    fileKeys.forEach((pieceJointeId) => {
        const importedFile = importedFiles[pieceJointeId];
        console.log('impoertedFile 1',importedFile);


        const formData = new FormData();
        formData.append("prestationId", importedFile.prestationId);
        formData.append("pieceJointeId", importedFile.pieceJointeId);
        formData.append("file", importedFile.file);
        axios
          .post(
            process.env.REACT_APP_API_BASE_URL ||
              CONNECTION_URL + "/private/uploadFileSinistre",
            formData,
            {
              headers: {
                Authorization: localStorage.getItem(ACCESS_TOKEN),
                "Content-Type":
                  "multipart/form-data; boundary=<calculated when request is sent>",
              },
            }
          )
          .then((response) => {
            const keys = `open${Date.now()}`;
            const btn = (
              <Button
                type="primary"
                size="small"
                onClick={() => notification.close(keys)}
              >
                OK
              </Button>
            );
            this.setState({
              visibleSinistre:false,
              loading : false
            });
            notification.success({
              message: "Importation avec succès",
              btn,
              duration: 0,
            });
            this.setState((prevState) => {
              const updatedFiles = { ...prevState.selectedFiles };
              delete updatedFiles[pieceJointeId];
              return { selectedFiles: updatedFiles };
            });
            if (Object.keys(this.state.selectedFiles).length === 0) {
              // Effectuer les autres actions de sauvegarde ou de mise à jour
            }
          })
          .catch((error) => {
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
            this.setState({
              visibleSinistre:false,
              loading : false
            });
            notification.error({
              message: "Erreur d'importation",
              btn,
              duration: 0
            });
            //window.location.reload();
          });
      });
    } else {
      // Effectuer les autres actions de sauvegarde ou de mise à jour
      // ...
    };
  };

  async getAllPieceByNumeroSinistre(numeroSinistre) {
    console.log("etape 1 res " .numeroSinistre);

    let response = await getPieceJointByNumeroSinistre(numeroSinistre);

    console.log("etape 2 res", response.data.content);


    console.log("les pièces jointes 1", response);
    this.setState({
      pieceJointe: response.data
    });
    console.log("les pièces jointes 2");
  }

  async uploadedFilesSinistreByPrestationId(id) {
    let response = await getUploadedFilesByPrestationId(id);
    console.log("test uploaded Files Sinistre 1",response);
    this.setState({
      uploadedFiles: response.data
    });
    console.log("test uploaded Files Sinistre 2 ",response.data);
  }


  importClick = (pieceJointeId, file) => {
    this.setState((prevState) => ({
      importedFiles: {
        ...prevState.importedFiles,
        [pieceJointeId]: {
          pieceJointeId,
          prestationId: this.state.prestationId,
          file,
        },
      },
    }));
    console.log('imported files',this.state.importedFiles);
  };

  handleDelete = key => {
    this.deletePrestationSinistre(key);
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };

  handlevsCancel=()=>{
    this.setState({ visibleSinistre: false });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        span: 11
      },
      wrapperCol: {
        span: 12
      }
    };
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled ,visibleSinistre,loading} = this.state;

    return (
      <MyContext.Consumer>
        {context => (
          (id = context.state.id),
          (beneficiaire = context.state.pointVente),
       //   (console.log(context)),
          (
            <React.Fragment>
              <div>
                <Modal
                  visible={visible}
                  title="Confirmation"
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Non
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                      Oui
                    </Button>
                  ]}
                >
                  <p>Étes-vous sûre de changer ce statut ?</p>
                </Modal>
                <Modal
                  visible={visibled}
                  title="Motif d'annulation"
                  onOk={this.handleSubmited}
                  onCancel={this.handleCancel}
                  width="600px"
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Fermer
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={this.handleSubmited}
                    >
                      Valider
                    </Button>
                  ]}
                >
                  <Form>
                    <Form.Item label="Le motif ">
                      {getFieldDecorator("motif", {
                        rules: [{ message: "Champs Obligatoire!" }]
                      })(<TextArea rows={2} />)}
                    </Form.Item>
                  </Form>
                </Modal>
                {this.state.remplie === "A_SIGNER" ||
                this.state.remplie === "EN_COURS" ? (
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns}
                    dataSource={this.state.data}
                    pagination={false}
                  />
                ) : (
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns1}
                    dataSource={this.state.data}
                    pagination={false}
                  />
                )}
                {this.state.add ? (
                  <div>
                    <Col span={10}>
                    
                    <Modal
                    visible={visibleSinistre}
                    title={"Details Sinistre du : "+this.state.responseSinistre.numeroSinistre}
                    width={"1000px"}
                    className="my-modal"
                    footer={null}
                    onCancel={this.handlevsCancel}
                    // onOk={this.handleOk}
                    // onCancel={this.handleCancel}
                    // footer={[
                    //   <Button key="back" onClick={this.handleCancel}>
                    //     Non
                    //   </Button>,
                    //   <Button key="submit" type="primary" onClick={this.handleOk}>
                    //     Oui
                    //   </Button>
                    // ]}
                  >
                    <Spin spinning={loading}>
                      <Form 
                  //   onSubmit={this.handleSubmit}
                      >
                        <Col span={12}>
                          <Form.Item label="Date création" {...formItemLayout}>
                            {getFieldDecorator("dateCreation")(
                              <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                                disabled
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="N° de sinistre" {...formItemLayout}>
                            {getFieldDecorator("numeroSinistre")(
                              <Input className="not-rounded" disabled/>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Date déclaration sinistre"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("dateDeclarationSinistre")(
                              <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                                disabled
                              />
                            )}
                          </Form.Item>
                          {/* <Form.Item label="Exclusion" {...formItemLayout}>
                            {getFieldDecorator("exclusions",{
                               rules:[{required:false}] 
                            })(
                              <Select placeholder="Selectionnez ..." mode="multiple">
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
                          </Form.Item> */}
                          <Form.Item
                            label="Durée avant survenance"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("dureeSurvenance")(
                              <InputNumber
                                className="not-rounded"
                                disabled
                              //  formatter={currencyFormatter}
                              //  parser={currencyParser}
                              />
                            )}
                          </Form.Item>
                          {/* <Form.Item
                            label="Montant à régler"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("montantRegler",{
                               rules:[{required:true}]
                            })(
                              <InputNumber
                                placeholder="0.00 "
                                className="not-rounded"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                              />                            
                            )}
                            <span class="input-group-text" style={{ fontWeight: 'bold' }}> DH </span>
                          </Form.Item> */}
                          
                          {/* <Form.Item
                            label="Taux d'invalidité"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("tauxInvalidite",{
                               rules:[
                                {required:true,
                                 message: "forme invalide",
                                 pattern: new RegExp(/^(100|[1-9]?[0-9])$/)
                                }
                                ]})(
                              <InputNumber
                                placeholder="0.00 "
                                className="not-rounded"
                                max={100}
                                min={0}
                              />
                            )}
                            <span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                          </Form.Item> */}
                          {/* <Form.Item
                            label="Réglement partiel"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("reglementPartiel", {
                               rules:[{required:true}],
                              initialValue: "Non"
                            })(
                              <Select placeholder="Séléctionnez ">
                                <Option value="Oui" label="oui">
                                  Oui
                                </Option>
                                <Option value="Non" label="non">
                                  Non
                                </Option>
                              </Select>
                            )}
                          </Form.Item> */}
                          <Form.Item label="Bénéficiaire" {...formItemLayout}>
                            {getFieldDecorator("beneficiaire",{
                               rules:[{required:false}]
                            })(
                              <Select placeholder="Selectionnez ..." disabled>
                                <Option
                                  value={beneficiaire.id}
                                  label={beneficiaire.libelle}
                                >
                                  {beneficiaire.libelle}
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Type de sinistre"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("typeSinistre", {
                              rules:[{required:false}],
                              initialValue: "Décès"
                            })(
                              <Select placeholder="Séléctionnez " disabled>
                                <Option value="Décès" label="deces">
                                  Décès
                                </Option>
                                <Option
                                  value="INVALIDITE TOTALE ET DEFINITIVE"
                                  label="ITD"
                                >
                                  INVALIDITE TOTALE ET DEFINITIVE
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Date de survenanve sinistre"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("dateSurvenance"                                                          
                            //,{    rules:[{required:true}] }
                           )(
                              <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                                disabled
                              />
                            )}
                          </Form.Item>
                          {/* <Form.Item label="Cause sinistre" {...formItemLayout}>
                            {getFieldDecorator("causeSinistre",{    rules:[{required:true}] })(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item> */}
                          <Form.Item
                            label="Durée avant déclaration"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("dureeDeclaration")(
                              <InputNumber
                                className="not-rounded"
                                disabled
                              //  formatter={currencyFormatter}
                              //  parser={currencyParser}
                              />
                            )}
                          </Form.Item>
                          {/* <Form.Item label="CRD" {...formItemLayout}>
                            {getFieldDecorator("crd",{
                               rules:[{required:true}]
                            })(
                              <InputNumber
                                placeholder="0.00 "
                                className="not-rounded"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                              />
                            )}
                          </Form.Item> */}
                          {/* <Form.Item
                            label="Nombre d'écheances impayées"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("nbrEcheanceImpayees",{
                               rules:[{required:true}]
                            })(
                              <InputNumber
                                className="not-rounded"
                              //  formatter={currencyFormatter}
                              //  parser={currencyParser}
                              />
                            )}
                          </Form.Item> */}
                          {/* <Form.Item
                            label="Mode de réglement"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("modeReglement", {
                               rules:[{required:true}],
                              initialValue: "Virement"
                            })(
                              <Select placeholder="Séléctionnez ">
                                <Option value="Virement" label="virement">
                                  Virement
                                </Option>
                                <Option value="Chèque" label="cheque">
                                  Chéque
                                </Option>
                              </Select>
                            )}
                          </Form.Item> */}
                          {/* <Form.Item label="N° Compte" {...formItemLayout}>
                            {getFieldDecorator("numeroCompte",
                            {
                              rules: [
                                { message: "forme invalide",
                               pattern: new RegExp(/^\d{24}$/),
                               required:true
                               }
                              ]})(
                              <Input className="not-rounded" placeholder="entrer le RIB..."/>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Agence bancaire"
                            {...formItemLayout}
                            
                          >
                            {getFieldDecorator("agenceBancaire", {
                              rules:[{
                                required:true
                              }
                            ]})(
                              <Select allowClear>
                                <Option value={true}>
                                    Oui
                                </Option>
                                <Option value={false}>
                                  Non
                                </Option>
                              </Select>
                            )}
                          </Form.Item> */}
                        </Col>
                        <Col span={24}>
                          <Divider orientation="left">
                            Pièces justificatives
                          </Divider>
                        </Col>
                        <table id="customers">
                        <tr>
                        <th>Libelle</th>
                        <th>A fournir</th>
                        <th>Reçu</th>
                        <th>Date réception</th>
                        <th></th>
                        </tr>
                        {this.state.pieceJointe.map((element) => {
                          const uploadedFile = this.state.uploadedFiles.filter(file => file.pieceJointe.id === element.id)[0];
                          console.log("Uploaded file ID:", uploadedFile);
                          const isChecked = uploadedFile && uploadedFile._received;
                          console.log("isChecked",isChecked);
                          const dateReception = uploadedFile ? uploadedFile.dateReception : null;
                          console.log('date de réception', dateReception);
                          const showUploadButton = !uploadedFile || !uploadedFile._received;
                          console.log("element id",element.id);
                          return (
                            <tr key={element.id}>
                            <td>
                                <Form.Item>
                                    <label>{element.code === 'Décès' ? element.libelle : null }</label>
                                </Form.Item>
                            </td>
                            <td>
                              <Form.Item>
                                      <Checkbox defaultChecked={element.necessity === "O"} disabled />
                              </Form.Item>
                            </td>
                            <td>
                                <Form.Item>
                                      <Checkbox checked={isChecked}/>
                                </Form.Item>
                            </td>
                            <td>
                                <Form.Item {...formItemLayout}>
                                  {getFieldDecorator("dateReception", {
                                    initialValue: dateReception ? moment(dateReception, "YYYY-MM-DD") : null,
                                  })(
                                    <DatePicker
                                      format="YYYY-MM-DD"
                                      style={{ width: "100%" }}
                                      disabled={isChecked}
                                    />
                                  )}
                                </Form.Item>
                              </td>
                              <td>
                                  <Form.Item>
                                  <Upload disabled={!showUploadButton}
                                  beforeUpload={(file) => {
                                    this.importClick(element.id, file);
                                    return false; 
                                  }}>
                                  {showUploadButton && (
                                  <Button
                                      size="small"
                                      style={{
                                      borderRadius: "0px",
                                      width: "105px",
                                      textAlign: "left"
                                      }}
                                      onClick={() =>
                                        this.importClick(
                                          element.id,
                                          this.state.importedFiles[element.id]
                                        )
                                      }
                                  >
                                      Importer
                                  </Button>
                                  )}
                                  </Upload>
                                  </Form.Item>
                              </td>
                            </tr>
                        );
                        })}
                    </table>
                        <Col span={14}>
                          <Form.Item label="Commentaire">
                            {getFieldDecorator("commentaire")(
                              <TextArea
                                placeholder="Commentaire"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={4} offset={21}>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="not-rounded"
                              onClick={this.handleSubmit}
                            >
                              <Icon type="save" />
                              Enregistrer
                            </Button>
                          </Form.Item>
                        </Col>
                      </Form>
                      </Spin>
                      </Modal>
                    </Col>
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          )
        )}
      </MyContext.Consumer>
    );
  }
}
export default Form.create()(Sinistre);

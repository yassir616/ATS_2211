import React, { Component } from 'react';
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getSinistre, setStatut, deleteSinistre ,searchSinistre,lettreRelance, notifierLettreRelance} from "../../GestionContrats/DetailsTabs/SinistreAPI";
import { updatePrestationSinistre } from "../../Parametrage/TypePrestation/PrestationAPI";
import {
    getExclusion,
    getPieceJointByNumeroSinistre,getUploadedFilesByPrestationId,updateNecessityPieceJointe,deleteFile
} from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { MyContext } from "../../GestionContrats/ConsultDecesContrat";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
import "antd/dist/antd.css";
import axios from "axios";
import { CONNECTION_URL } from "../../../constants/source";
import {ACCESS_TOKEN} from "../../../constants/index";
import moment from "moment";
import "./Sinistre.css";
import {   
    Select,
    Table,
    Input,
    Modal,
    Form,
    Button,
    DatePicker,
    Spin,
    Checkbox,
    Col,
    Divider,
    Icon,
    InputNumber,
    notification,
    Upload,
    Row
} from "antd";
import { Label } from "semantic-ui-react";

const { TextArea } = Input;
const { Option } = Select;
const { Search  } = Input;
const code ="Décès";
var id = "";
var id_sinistre = "";
var statut = "";
var beneficiaire = {};
const famille = "Deces";
let formData = new FormData();
class GestionsSinistre extends Component {
    constructor(props) {
    super(props);
    this.state = {
        nom:'Yassir',
        searchby : 'numContrat',
        sinistres : [],
        searchfor:"",
        tableVisible :false,
        visible:false,
        agenceBancaire: true,
        exclusions:[],
        pieceJointe:[],
        add: false,
        keyRecord:"",
        loading:false,
        numeroSinistre:"",
        selectedOption: '',
        prestationId :"",
        uploadedFiles:[],
        importedFiles: {},
        necessiteValues: {},
        selectedOptions: {},
        checkboxChecked: {},
        showNumeroCompteInput: true,
        nom:"",
        prenom:"",
        ville:"",
        libelle:"",
        pointVenteVille:"",
        raisonSocial:"",
        numeroContrat:"",
        commentaire:"",
        generate : "false",
        pointVenteID : ""
    } 
    let storedRecord = null;
    this.columns= [
        {
          title: "Numéro de sinistre",
          dataIndex: "numeroSinistre",
          key: "numeroSinistre",
          render: (text, record) => {
            storedRecord = record;
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
        //   render: (text, record) => {
        //     return (
        //       <span>
        //         <Select
        //           placeholder="Please select"
        //           onChange={this.handleChangeed}
        //           style={{ width: "100%" }}
        //           defaultValue={text}
        //         >
        //           <Option
        //             value="EN_COURS"
        //             onClick={() => this.handleRecord(record)}
        //           >
        //             EN COURS
        //           </Option>
        //           <Option
        //             value="A_signer"
        //             onClick={() => this.handleRecord(record)}
        //           >
        //             À SIGNER
        //           </Option>
        //           <Option
        //             value="ANNULER"
        //             onClick={() => this.handleRecord(record)}
        //           >
        //             ANNULER
        //           </Option>
        //           <Option
        //             value="REJ_CONTRAT_ECHU"
        //             onClick={() => this.handleRecord(record)}
        //           >
        //             REJ CONTRAT ECHU
        //           </Option>
        //         </Select>
        //       </span>
        //     );
        //   }
        }
      ];

    }

    componentDidMount() {
        // this.getSinistres(id);
        this.getAllExclusion(famille);
       // this.getAllComptes();
       this.setState({ searchby:'numContrat'  });
    }

    handleCancel = () => {
        this.setState({ visible: false });
      };

    // onChanged = e => {
    //     this.setState({
    //       agenceBancaire: e.target.value
    //     });
    //   };

    selectBefore = (
        <Select
          onChange={value => this.setState({ searchby: value })}
          defaultValue="numContrat"
          style={{ width: 150 }}
        >
          <Option value="numContrat">N° de contrat</Option>
          <Option value="numeroSinistre">N° Sinistre</Option>
        </Select>
    );

    updateNecessityPieceJointe = (pieceJointeId, necessite) => {
      const requestData = {
        necessity: necessite
      };
    
      updateNecessityPieceJointe(pieceJointeId, requestData)
        .then(response => {
          if (response.status === 200) {
            // Mise à jour réussie
          }
        })
        .catch(error => {
          // Gérer les erreurs de mise à jour
        });
    };

    handleChange=(value)=>{
    this.setState({
      nom : value.contrat.assure.nom,
      prenom : value.contrat.assure.prenom,
      ville : value.contrat.assure.adressVille,
      libelle : value.contrat.pointVente.libelle,
      pointVenteVille : value.contrat.pointVente.adressVille,
      raisonSocial : value.contrat.pointVente.partenairepv.raisonSocial,
      numeroContrat : value.contrat.numeroContrat,
      commentaire : value.commentaire,
      pointVenteID : value.contrat.pointVente.id
    })
    console.log("record",value);
    console.log("prestation_id",value.id);
    this.setState({
        prestationId : value.id,
    });
    console.log('prestationId',this.state.prestationId);
    console.log("exclusion mounted",this.state.exclusions);
    console.log("piece jointed mounted",this.state.pieceJointe)
    console.log("pieceJointed",this.state.pieceJointe)
    this.setState({numeroSinistre:value.numeroSinistre, visible:true  });
    console.log("value",value.numeroCompte)
    const SelectedSinistre=value;
    console.log("selectedSinistre",SelectedSinistre)
    console.log("sinistre number",SelectedSinistre.numeroSinistre);
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
        //reglementPartiel: value.reglementPartiel,
        tauxInvalidite: value.tauxInvalidite,
        modeReglement: value.modeReglement,
        beneficiaire: value.contrat.pointVente.libelle,
        exclusions : value.exclusions.map(
          element => {
            return element.id;
          }
        ),
        causeSinistre:value.causeSinistre,
        //agenceBancaire:value.beneficiaireAgenceBancaire
        });
     });
     this.setState({
      typeSinistre : value.natureSinistre,
      modeReglement: value.modeReglement,
      agenceBancaire:value.beneficiaireAgenceBancaire
     })
     console.log("Agence bancaire : ", this.state.agenceBancaire)
     this.getAllPieceByNumeroSinistre(SelectedSinistre.numeroSinistre);
     
     this.uploadedFilesSinistreByPrestationId(value.id);
    }

  handleSubmit = e => {
        e.preventDefault();
        this.setState({ loading:true  });
        this.props.form.validateFields((err, values) => {
        if (!err) {
        console.log("values Submit ",values)
        let exclus=[];
        values.exclusions.forEach(element => {
            exclus.push({ id: element });
        });
        values.exclusions = [...exclus];
        let request = {
            dateSurvenance: values.dateSurvenance,
            dateDeclarationSinistre: values.dateDeclarationSinistre,
            dureeAvantDeclaration: values.dureeDeclaration,
            dureeAvantSurvenance: values.dureeSurvenance,
            commentaire: values.commentaire,
            crd: values.crd,
            montantRegler: values.montantRegler,
            natureSinistre: values.typeSinistre,
            nbrEcheanceImpaye: values.nbrEcheanceImpayees,
            numeroCompte: values.numeroCompte,
            //reglementPartiel: values.reglementPartiel,
            tauxInvalidite: values.tauxInvalidite,
            modeReglement: values.modeReglement,
            exclusions: values.exclusions,
            numeroSinistre: values.numeroSinistre,
            //beneficiaireAgenceBancaire: values.agenceBancaire,
           // pointVente: values.beneficiaire,
            remplie: true,
            causeSinistre: values.causeSinistre,
            dateCreation : values.dateCreation
        };
        console.log("request  :",request)
        this.updatePrestationSinistres(request, this.state.keyRecord);
        this.setState({ remplie: true });
  
        const { selectedOptions } = this.state;

        Object.entries(selectedOptions).forEach(([pieceJointeId, necessite]) => {
          this.updateNecessityPieceJointe(pieceJointeId, necessite);
        });
      
        this.setState({
          selectedOptions: {},
          checkboxChecked: false
        });
        const { importedFiles } = this.state;
        const fileKeys = Object.keys(importedFiles);
  
        if (fileKeys.length > 0) {
        fileKeys.forEach((pieceJointeId) => {
            const importedFile = importedFiles[pieceJointeId];
 
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
                    Confirm
                  </Button>
                );
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
        }
        }
        else{
        this.setState({ loading:false  });
        notification.error({
            message: "Takaful",
            description:
            "Veuillez bien remplir les données"
        });
        }
    });
    this.notifierLettreRelance(this.state.numeroContrat,this.state.pointVenteID); 
    };

    async notifierLettreRelance(numContrat,pointVente) {
      let response = await notifierLettreRelance(numContrat,pointVente);
    }
  
    search=(value)=>{
        this.setState({  tableVisible:true ,sinistres:[]});
        if(value!=""){
            console.log("value",value)
            this.searchSinistre(this.state.searchby,value);
            console.log("response",this.state.sinistres);
        }
    }


    handleSelectChange = (pieceJointeId, value) => {
      this.setState(prevState => ({
        selectedOptions: {
          ...prevState.selectedOptions,
          [pieceJointeId]: value
        },
        checkboxChecked: {
          ...prevState.checkboxChecked,
          [pieceJointeId]: value === "O"
        }
      }));
  }

  handleSelectMRChange = (value) => {
       this.setState(
        {
          showNumeroCompteInput: value ==="Virement"
        }
       )
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
    };

    //handleDownload = (fileName) => {
      // Ouvrez une nouvelle fenêtre ou un nouvel onglet pour consulter le contenu du fichier
      //window.open(`/${fileName}`, '_blank');
      //window.open("/Sinistres/fileName", "_self");
    //};

    // handleDownload = async (fileContent) => {
    //   console.log("download file test");
    //   let bytes = new Uint8Array(fileContent.length);
    //   for (let i = 0; i < bytes.length; i++) {
    //       bytes[i] = fileContent.charCodeAt(i);
    //   }
    //   console.log("bytes",bytes)
    //   var blob = new Blob([bytes], {type: "application/octet-stream"});
    //   var link = document.createElement("a");
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = "myFileName.txt";
    //   link.click();
    // };
    handleDownload = async (fileContent,fileName) => {
      console.log("Téléchargement du fichier en cours");
      const decodedContent = atob(fileContent); // Décodage Base64
    
      let bytes = new Uint8Array(decodedContent.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = decodedContent.charCodeAt(i);
      }
    
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName
      link.click();
    };
    
    async removeFile(idFile) {
      try {
        let response = await deleteFile(idFile);
        if (response.status === 200) {
          notification.success({
            message: "fichier supprimé!"
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

    handleDelete = key => {
      this.removeFile(key);
      const dataSource2 = [...this.state.uploadedFiles];
      this.setState({ uploadedFiles: dataSource2.filter(item => item.key !== key) });      
    };

    async searchSinistre(searchby, searchfor) {
        let contratResponse = await searchSinistre(
          searchby,
          searchfor
        );
       this.setState({ sinistres:contratResponse.data  });
    }

    async getAllExclusion(exclusionFamille) {
        let response = await getExclusion(exclusionFamille);
        this.setState({
          exclusions: response.data.content
        });
      }

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

      async updatePrestationSinistres(body, id_prestation) {
        let response = await updatePrestationSinistre(body, id_prestation);
        if(response.status=200){
          let dataSource = [];
         dataSource.push(response.data);
        this.setState({
          sinistres: dataSource,
          visible:false,
          loading : false
        });
        notification.success({
          message: "TAKAFUL",
          description: "Modification du sinistre "+this.state.numeroSinistre+" avec succès."
        });
        }else{
          notification.error({
            message: "Takaful",
            description:
              "Veuillez Bien remplir les données"
          })
        }
      }

      async jasperLettre(requestLettre) {
        let response = await lettreRelance(requestLettre);
        if (response.status === 200) {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      }

      // edit = () => {
      //   console.log('nom et prénom :',this.state.uploadedFiles)
      //   let requestLettreRelance = {
      //     nomPrenom:
      //       this.state.uploadedFiles[0].prestation.contrat.assure.nom +
      //       " " +
      //       this.state.uploadedFiles[0].prestation.contrat.assure.prenom,
      //     ville : this.state.uploadedFiles[0].prestation.contrat.assure.adressVille,
      //     libelle: this.state.uploadedFiles[0].prestation.contrat.pointVente.libelle,
      //     pointVenteVille : this.state.uploadedFiles[0].prestation.contrat.pointVente.adressVille,
      //     numeroSinistre : this.state.uploadedFiles[0].prestation.numeroSinistre,
      //     raisonSocial : this.state.uploadedFiles[0].prestation.contrat.pointVente.partenairepv.raisonSocial,
      //     numeroContrat : this.state.uploadedFiles[0].prestation.contrat.numeroContrat,
      //     commentaire : this.state.uploadedFiles[0].prestation.commentaire
      //   };
      //   console.log('requestLettreRelance :', requestLettreRelance)
      //   this.jasperLettre(requestLettreRelance);
      // };
    
      edit = () => {
        console.log('nom:',this.state.nom)
        let requestLettreRelance = {
          nomPrenom:
            this.state.nom +
            " " +
            this.state.prenom,
          ville : this.state.ville,
          libelle: this.state.libelle,
          pointVenteVille : this.state.pointVenteVille,
          numeroSinistre : this.state.numeroSinistre,
          raisonSocial : this.state.raisonSocial,
          numeroContrat : this.state.numeroContrat,
          commentaire : this.state.commentaire
        };
        console.log('requestLettreRelance :', requestLettreRelance)
        this.jasperLettre(requestLettreRelance);
        this.setState({ generate: true });
      };
    
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
        const { visible,loading} = this.state;
        return (
            <div>
            <ComponentTitle title='Gestion des Sinistres'/> 
            <div style={{ marginBottom: 30 }}>
            <Search
                placeholder="Entrez le text de recherche"
                addonBefore={this.selectBefore}
                onSearch={value => this.search(value)}
                enterButton
                style={{ width: 600 }}
            />
            </div>
            <div>
            {this.state.tableVisible &&
            <Table
                columns={this.columns}
                dataSource={this.state.sinistres}
                >
            </Table>}
            </div>
            <div>
                <Col span={10}>
                <Modal
                visible={visible}
                title={"Details Sinistre : "+this.state.numeroSinistre}
                width={"1000px"}
                className="my-modal"
                footer={null}
                onCancel={this.handleCancel}
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
                        <Form.Item label="Exclusion" {...formItemLayout}>
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
                        </Form.Item>
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
                        <Form.Item
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
                        </Form.Item>
                        {this.state.typeSinistre ==='Décès' && (
                        <Form.Item
                        label="Taux d'invalidité"
                        {...formItemLayout}
                        >
                        {getFieldDecorator("tauxInvalidite",{
                            rules:[
                            {//required: this.state.typeSinistre ==='Décès' ? false : true,
                                required : false,
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
                        </Form.Item>
                        )}
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
                                {beneficiaire}
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
                        <Form.Item label="Cause sinistre" {...formItemLayout}>
                        {getFieldDecorator("causeSinistre",{    rules:[{required:true}] })(
                            <Input className="not-rounded" />
                        )}
                        </Form.Item>
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
                        <Form.Item label="CRD" {...formItemLayout}>
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
                        <span class="input-group-text" style={{ fontWeight: 'bold' }}> DH </span>
                        </Form.Item>
                        <Form.Item
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
                        </Form.Item>
                        <Form.Item
                        label="Mode de réglement"
                        {...formItemLayout}
                        >
                        {getFieldDecorator("modeReglement", {
                            rules:[{required:true}],
                            initialValue: "Virement"
                        })(
                            <Select placeholder="Séléctionnez "
                                    onChange={(value) => this.handleSelectMRChange(value)} >
                            <Option value="Virement" label="virement">
                                Virement
                            </Option>
                            <Option value="Chèque" label="cheque">
                                Chèque
                            </Option>
                            </Select>
                        )}
                        </Form.Item>
                        {this.state.showNumeroCompteInput && (
                        <Form.Item label="N° Compte" {...formItemLayout}>
                        {getFieldDecorator("numeroCompte",
                        {
                            rules: [
                            { message: "forme invalide",
                            pattern: new RegExp(/^\d{24}$/),
                            //required: this.state.numeroCompte ==='Chéque' ? false : true,
                            required : true
                            }
                            ]})(
                            <Input className="not-rounded" placeholder="entrer le RIB..."/>
                        )}
                        </Form.Item>
                        )}
                        {/* <Form.Item
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
                        <Form.Item label="Agence bancaire" {...formItemLayout}>
                        {getFieldDecorator("agenceBancaire",{    initialValue : this.state.agenceBancaire ===true ? 'Oui' : 'Non' })(
                            <Input className="not-rounded" disabled/>
                        )}
                        </Form.Item>
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
                        <th>O/F</th>
                        <th>Reçu</th>
                        <th>Date réception</th>
                        <th>Action</th>
                        </tr>
                        {this.state.pieceJointe.map((element, index) => {
                          const fieldNamePrefix = `item_${element.id}`;
                          const uploadedFile = this.state.uploadedFiles.filter(file => file.pieceJointe.id === element.id)[0];
                          console.log("Uploaded file ID:", uploadedFile);
                          const isChecked = uploadedFile && uploadedFile._received;
                          console.log("isChecked",isChecked);
                          const dateReception = uploadedFile ? uploadedFile.dateReception : null;
                          console.log('date de réception', dateReception);
                          const showUploadButton = !uploadedFile || !uploadedFile._received;
                          console.log("element id",element.id);
                          const fileName=uploadedFile ? uploadedFile.name : null;
                          const fileData=uploadedFile ? uploadedFile.data : null;
                          const fileId = uploadedFile ? uploadedFile.id :null;
                        return (
                            <tr key={element.id}>
                            <td>
                                <Form.Item>
                                {" "}
                                {getFieldDecorator("${fieldNamePrefix}_libelle")(
                                    <label>{element.libelle}</label>
                                )}
                                </Form.Item>
                            </td>
                            <td>
                              <Form.Item>
                                 {this.state.selectedOptions[element.id] ?(
                                      <Checkbox checked={this.state.checkboxChecked[element.id]} />
                                    ) : (
                                      <Checkbox defaultChecked={element.necessity === "O"} disabled />
                                    )}
                              </Form.Item>
                            </td>
                            <td>
                              {showUploadButton && (
                            <Form.Item>                                                     
                              <Select
                                value={this.state.selectedOptions[element.id]} 
                                onChange={(value) => this.handleSelectChange(element.id, value)} 
                              >
                                <Option value="O">O</Option>
                                <Option value="F">F</Option>
                              </Select>                                
                            </Form.Item>
                              )}
                            </td>
                            <td>
                                <Form.Item>
                                {" "}
                                {getFieldDecorator("${fieldNamePrefix}_reçu")(<Checkbox checked={isChecked} disabled/>)}
                                </Form.Item>
                            </td>
                            <td>
                                <Form.Item {...formItemLayout}>
                                  {getFieldDecorator("${fieldNamePrefix}_dateReception", {
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
                               { showUploadButton ? (
                                <Upload disabled={!showUploadButton}
                                beforeUpload={(file) => {
                                  this.importClick(element.id, file);
                                  return false; 
                                }}
                                >
                                {/* {showUploadButton && (
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
                                )} */}
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
                                </Upload>):(
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Button onClick={() => this.handleDownload(fileData,fileName)}>
                                    {fileName}
                                  </Button>
                                  <Button onClick={() => this.removeFile(fileId)}                         
                                      style={{
                                        borderRadius: "5px",
                                        width: "25px",
                                      }}
                                      >
                                  <Icon
                                    type="delete"
                                    style={{ color: "red", fontSize: "15px" }}
                                  /> {/* Icône de suppression */}
                                  </Button>
                                </div>)
                                }
                                </Form.Item>
                            </td>
                            </tr>
                        );
                        })}
                    </table>
                    <Row>
                    <Col span={14}>
                        {/* <Form.Item label="Commentaire">
                        {getFieldDecorator("commentaire")(
                            <Input.TextArea
                            placeholder="Commentaire"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        )}
                        </Form.Item> */}
                        <Form.Item>
                          <Label style={{ marginBottom: "5px" }}>Commentaire</Label>
                          {getFieldDecorator("commentaire", {
                            rules: [{ required: false }],
                          })(<TextArea style={{ marginRight: "10px" }}></TextArea>)}
                        </Form.Item>
                    </Col>
                    </Row>

                    <Row>
                    <Col span={11}>
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
                        <Col span={2} offset={2}>
                        <Form.Item className="text-center">
                        <Button onClick={() => this.edit()}
                              style={{
                                borderRadius: "5px",
                                background: 'grey',
                              }}>
                          <Icon type="upload" />
                          générer Relance
                        </Button>
                        </Form.Item>
                    </Col>
                    </Row>
                    </Form>
                    </Spin>
                    </Modal>
                </Col> 
                </div>     
            </div>
 
  )}
}
 
export default Form.create()(GestionsSinistre);
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
  InputNumber,
  Drawer,
  Popconfirm,
  Spin,
  Tag,
} from "antd";
import React, { Component } from "react";
import { currencyFormatter, currencyParser, separateDigitsWithSpaces } from "../../util/Helpers";
import moment from "moment";
import ComponentTitle from "../../util/Title/ComponentTitle";
import {
  getAllEmissionGlobale,
  findByNumeroLot,
  DeleteByNumeroLot,
} from "./EmissionGlobaleAPI";
import { jasperBordereauApi } from "./EmissionGlobaleAPI";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { findCotisationsByNumeroLot } from "./CotisationAPI";
import { EncaisserLotApi } from "./EmissionGlobaleAPI";
const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "2%",
};
const { Search } = Input;
const { Option } = Select;
export const MyContext = React.createContext();
class EncaissementGroupe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStartDate: "",
      searchEndDate: "",
      cotisationFiltred: [],
      visibleDrawer: false,
      dataCalcule: [],
      produits: [],
      showNumeroCompteInput: true,
      partenaires: [],
      produitPartenaire: [],
      partenaireId: null,
      produitId: null,
      SommeMontantTTC: 0,
      emisssionList: [],
      searchby: "",
      emissionListGlobale: [],
      cotisationFiltred: [],
      searchText: "",
      searchedColumn: "",
      visibleModEnc: false,
      numeroLot: "",
      vc: "L",
      loading : false,
      numCompte : [],
      totalItems: 0,
      totalOG : 0
    };

    this.columns = [
      {
        title: "NumeroLot",
        dataIndex: "numeroLot",
        key: "numeroLot",
        render: (text, record) => (
          <span style={{ color: "#1890ff" }}>
            <a onClick={() => this.handleRecord(record)}>{text}</a>
          </span>
        ),
      },
      {
        title: "Réference",
        dataIndex: "reference",
        key: "reference",
        ...getColumnSearchProps("reference", "Réference", this),
      },
      {
        title: "MontantTTC",
        dataIndex: "montantTTC",
        key: "montantTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantCotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantTaxe",
        dataIndex: "montantTaxe",
        key: "montantTaxe",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantTaxeParaFiscale",
        dataIndex: "montantTaxeParaFiscale",
        key: "montantTaxeParaFiscale",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "Solde",
        dataIndex: "solde",
        key: "solde",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "FraisAcquisitionTTC",
        dataIndex: "fraisAcquisitionTTC",
        key: "fraisAcquisitionTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "FraisGestionTTC",
        dataIndex: "fraisGestionTTC",
        key: "fraisGestionTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "Action",
        dataIndex: "operation",
        width: "15%",
        render: (text, record) => {
          return (
            <span>
              {record.etat==true ? (<span>
              <Button
                type="primary"
                //onClick={() => this.DownloadBordereau(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  //  width: "110px",
                  backgroundColor: "#4EE289",
                  borderColor: "#4EE289",
                  textAlign: "left",
                  display: "block",
                  width: "116px",
                  fontWeight:"bold",
                  color : "white"
                }}
                
              >
                <Icon type="check-circle" /> Encaissé
              </Button></span>):(<span>
              <Button
                type="primary"
                onClick={() => this.handleEncaissement(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  //  width: "110px",
                  backgroundColor: "#24a0ed",
                  borderColor: "#24a0ed",
                  textAlign: "left",
                  display: "block",
                  
                }}
              >
                <Icon type="bank" /> Encaissement
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleDeleteLot(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  width: "116px",
                  backgroundColor: "#C70000",
                  borderColor: "#C70000",
                  textAlign: "left",
                }}
              >
                <Icon type="delete" /> Supprimer
              </Button>
            </span>)
            } </span>
          );
        },
      },
    ];

    this.STableColumn = [
      {
        title: "N° de Contrat",
        dataIndex: "contrat.numeroContrat",
        key: "contrat.numcontrat",
        render: (text) => <span style={{ color: "#32CD32" }}>{text}</span>,
      },
      {
        title: "CIN assuré",
        dataIndex: "contrat.assure.cin",
        key: "cinAssure",
      },
      {
        title: "Nom assuré",
        dataIndex: "contrat.assure.nom",
        key: "nomAssure",
      },
      {
        title: "Prénom assuré",
        dataIndex: "contrat.assure.prenom",
        key: "prenomAssure",
      },
      {
        title: "Nom souscripteur",
        dataIndex: "contrat.souscripteur.nom",
        key: "nomSouscripteur",
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "contrat.souscripteur.prenom",
        key: "prenomSouscripteur",
      },
      {
        title: "Date d'effet",
        dataIndex: "contrat.dateEffet",
        key: "dateEffet",
      },
      {
        title: "Date écheance",
        dataIndex: "contrat.dateEcheance",
        key: "dateEcheance",
      },
      {
        title: "Produit",
        dataIndex: "contrat.produit.libelle",
        key: "produit",
      },
    ];
  }
  componentDidMount() {
    this.getAllEmissionGlobale(0,5,"creation_date",false);
  }

  handleCancel = () => {
    this.setState({ visibleDrawer: false });
  };

  // verifierclick = () => {
  //   console.log("this state", this.state.emisssionList);
  //   console.log("this search by state : ", this.state.searchby);
  // };

  search = (e) => {
    const Emissions = this.state.emissionListGlobale;
    console.log("emission : ",Emissions)
    if (e != "" && e != null && e != undefined) {
      console.log("search by : ", e);
      this.findByNumeroLot(e);
    } else {
      this.setState({ emisssionList: Emissions,totalItems:this.state.totalOG });
    }
    console.log(this.state.totalItems)
  };

  async getAllEmissionGlobale(pageNumber,pageSize,sortCol,direction) {
    console.log("getting emissions globale...");
    const emissions = await getAllEmissionGlobale(pageNumber,pageSize,sortCol,direction);
    if (emissions.status == 200) {
      console.log("data : emission ", emissions);
      this.setState({
        emisssionList: [...emissions.data.content],
        emissionListGlobale: [...emissions.data.content],
        totalItems:emissions.data.totalElements,
        totalOG : emissions.data.totalElements
      });
    } else {
      notification.error({
        message: "Takaful",
        description: "Error in getting Emission Globale",
      });
    }
  }

  async findByNumeroLot(numeroLot) {
    const response = await findByNumeroLot(numeroLot);
    if (response.status == 200) {
      if(response.data==""||response.data==null||response.data==undefined){
        this.setState({ emisssionList:[] ,totalItems:1 });
      }
      else{
        this.setState({ emisssionList: [response.data] ,totalItems:1});
      }
    } else {
      notification.error({
        message: "Takaful",
        description: "Error in getting Emission Globale",
      });
    }
  }

  async findCotisationsByNumeroLot(numeroLot) {
    const response = await findCotisationsByNumeroLot(numeroLot);
    if (response.status == 200) {
      console.log("response : ", response.data);
      this.setState({
        cotisationFiltred: [...response.data],
        visibleDrawer: true,
        numeroLot: numeroLot,
      });
    } else {
      notification.error({
        message: "Takaful",
        description: "Error in getting Emission Globale",
      });
    }
  }

  handleDeleteLot = (record) => {
    console.log("record selected", record.numeroLot);
    const emissionListe = this.state.emisssionList.filter(
      (emissions) => emissions.numeroLot != record.numeroLot
    );
    console.log(emissionListe);
    this.setState({ emisssionList: emissionListe });
    this.deleteLotDeCotisation(record.numeroLot);
    notification.success({
      message: "Takaful",
      description: "supprimé avec succès",
    });
  };

  handleEncaissement = (record) => {
    this.props.form.setFieldsValue({
      montantCotisation: record.montantCotisation,
      montantTTC: record.montantTTC,
      montantTaxe: record.montantTaxe,
      fraisAcquisitionTTC: record.fraisAcquisitionTTC,
      fraisGestionTTC: record.fraisGestionTTC,
      montantTaxeParaFiscale: record.montantTaxeParaFiscale,
      reference: record.reference,
      solde: record.solde,
      modeEncaissement: undefined,
      RefEncaissement: undefined,
      DateEncaissement: moment(moment(), "YYYY-MM-DD"),
      numeroCompte: undefined,
    });
    console.log("this is an encaissement button");
    console.log("record : ", record);
    console.log(this.state.cotisationFiltred);
    this.setState({ visibleModEnc: true, numeroLot: record.numeroLot });
  };

  handleCancelMod = () => {
    this.setState({ visibleModEnc: false });
  };

  handleRecord = (record) => {
    console.log("record : ", record.numeroLot);
    console.log("state", this.state.numeroLot);
    if (record.numeroLot == this.state.numeroLot) {
      this.setState({ visibleDrawer: true });
    } else {
      this.findCotisationsByNumeroLot(record.numeroLot);
    }
  };

  async deleteLotDeCotisation(Lot) {
    console.log("deleting lot de numero : " + Lot + ".....");
    const response = await DeleteByNumeroLot(Lot);
    if (response.status == 200) {
      console.log("response : ", "Succes");
    } else {
      notification.error({
        message: "Takaful",
        description: "Error in Deleting Lot",
      });
    }
  }

  DownloadBordereau=(record)=>{
    const requestModel={}
    const dateGeneration = moment().format('DD/MM/YYYY');
    const montantTotal=record.montantTTC
    const compteBancaire="M5 / M5 072R425008"
    const pointVente="MCMA VIE"
    requestModel.dateGeneration=dateGeneration
    requestModel.montantTotal=separateDigitsWithSpaces(montantTotal)
    requestModel.compteBancaire=compteBancaire
    requestModel.pointVente=pointVente
    requestModel.referenceBordereau="TTT"
    console.log(requestModel, record)
    this.jasperBordereauApi(requestModel)
  }

  async jasperBordereauApi(requestDevis) {
    let response = await jasperBordereauApi(requestDevis);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  selectBefore = (
    <Select
      onChange={(value) => this.setState({ searchby: value })}
      defaultValue={"numeroLot"}
      style={{ width: 150 }}
    >
      <Option value={"numeroLot"}>N° de Lot</Option>
    </Select>
  );

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleModeChange = (e) => {
    console.log("value change : ", e);
    this.setState(
      {
        showNumeroCompteInput: e ==="Virement"
      }
     )
    if (e === "Cheque") {
      this.setState({ vc: "CH" });
    } else {
      this.setState({ vc: "Vir" }); // Assuming "Vir" should be set here
    }
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  async encaisserLot(model) {
    console.log("async ", model);
    let request = await EncaisserLotApi(model);
    if (request.status == 200) {
      console.log("backApi Succes");
      this.setState({ loading: false  });
      notification.success({
        message: "Takaful",
        description: "Success ! ",
      });
      window.location.reload();
      
    } else {
      console.log("Back APi failure");
    }
  }
  handleEncaissementDateChange = (e) => {
    console.log("date  : ", e);
  };

  handleSubmitedEnc = (e) => {
    e.preventDefault();
    this.setState({ loading: true  });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let requestEnc = {};
        requestEnc.numeroLot = this.state.numeroLot;
        requestEnc.refEncaissement = values.RefEncaissement;
        requestEnc.dateEncaissement = values.DateEncaissement;
        requestEnc.modeEncaissement = values.modeEncaissement;
        requestEnc.numeroCompte = values.numeroCompte;
        console.log("submit succes!!", requestEnc);
        this.encaisserLot(requestEnc);
      } else {
        notification.error({
          message: "Takaful",
          description: "Sorry! Something went wrong. Please try again!",
        });
      }
    });
  };


  onPaginationChange=(pagenumber,pageSize)=>{
    console.log("pageNumber : ",pagenumber)
    this.getAllEmissionGlobale(pagenumber-1,5,"creation_date",false)
  }

  render() {
    const virCheckChange = this.state.vc === "Vir" ? "VIR N°" : "CH N°";
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <ComponentTitle title="Encaissement Groupe" />
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={(value) => this.search(value)}
            enterButton
            style={{ width: 600, marginBottom: "30px" }}
          />
          <Table
            bordered
            // rowClassName="editable-row"
            size="middle"
            columns={this.columns}
            dataSource={this.state.emisssionList}
            pagination={{
              onChange: this.onPaginationChange,
              pageSize: 5,
              total:this.state.totalItems
            }}
          />
          <Drawer
            title="Détails Cotisation : résultat de recherche"
            visible={this.state.visibleDrawer}
            onClose={() => this.handleCancel()}
            width={1300}
          >
            <div style={containerStyle}>
              {/* <p style={{marginTop:'15px',fontSize:'15px'}}>Montant à encaissé : </p>
                    <Input
                    style={{width:'25%',fontSize:'25px',marginLeft:'10px',fontWeight:'bold'}} 
                    disabled
                    placeholder={this.state.SommeMontantTTC}
                    >
                    </Input>  */}
            </div>
            <Table
              columns={this.STableColumn}
              dataSource={this.state.cotisationFiltred}
            ></Table>
          </Drawer>
          <Modal
            title={
              <span style={{ fontSize: "16px" }}>
                Veuillez saisir les informations de l'encaissement
                <span style={{ paddingLeft: "20%" }}>
                  <Tag style={{ fontSize: "15px" }} color="blue">
                    numero Lot : {this.state.numeroLot}
                  </Tag>
                </span>
              </span>
            }
            visible={this.state.visibleModEnc}
            onCancel={this.handleCancelMod}
            style={{ top: 20, paddingTop: "5%" }}
            width="1000px"
            footer={[
              <Button
                key="back"
                onClick={this.handleCancelMod}
                className="not-rounded"
              >
                Fermer
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.handleSubmitedEnc}
                className="not-rounded"
                style={{ backgroundColor: "#77CC6D", fontWeight: "bold" }}
              >
                Encaisser
              </Button>,
            ]}
          >
          <Spin spinning={this.state.loading}>
            <Form {...formItemLayout}>
              <div>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Mode d'encaissement">
                      {getFieldDecorator("modeEncaissement", {
                        rules: [
                          { required: true, message: "Champ Obligatoire" },
                        ],
                      })(
                        <Select
                          placeholder="Veuillez selectionner"
                          onChange={this.handleModeChange}
                          allowClear
                        >
                          <Option value="Cheque" label="Chèque">
                            Chèque
                          </Option>
                          <Option value="Virement" label="Virement">
                            Virement
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Réf Encaissement">
                      {getFieldDecorator("RefEncaissement", {
                        rules: [
                          { required: true, message: "Champ Obligatoire" },
                        ],
                      })(
                        <Input
                          className="not-rounded"
                          addonBefore={
                            <span style={{ fontWeight: "bold" }}>
                              {virCheckChange}
                            </span>
                          }
                          placeholder="Veuillez selectionner"
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                  {this.state.showNumeroCompteInput && (
                    <Form.Item label="N° de Compte">
                      {getFieldDecorator("numeroCompte", {
                        rules: [
                          { required: true, message: "Champ Obligatoire" },
                        ],
                      })(
                        
                        <Select placeholder="Veuillez selectionner" allowClear>
                          <Option value="000162837450178356771960369" label="000162837450178356771960369">
                             000162837450178356771960369
                          </Option> 
                          <Option value="400628374501783567719605003" label="400628374501783567719605003">
                             400628374501783567719605003
                          </Option> 
                          <Option value="4006283745Example67719605003" label="4006283745Example67719605003">
                             4006283745Example67719605003
                          </Option> 
                          {/* {this.state.numCompte.map((element) => {
                          <Option value={element}>
                            {element}
                          </Option> 
                        })} */}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Date d'encaissement">
                      {getFieldDecorator("DateEncaissement", {
                        rules: [
                          { required: true, message: "Champ Obligatoire" },
                        ],
                      })(
                        <DatePicker
                          className="not-rounded"
                          placeholder="Veuillez selectionner"
                          style={{ width: "210px" }}
                          onChange={this.handleEncaissementDateChange}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Réference Emission">
                      {getFieldDecorator("reference")(
                        <Input className="not-rounded" disabled />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Solde">
                      {getFieldDecorator("solde")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Montant de cotisation">
                      {getFieldDecorator("montantCotisation")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Montant TTC">
                      {getFieldDecorator("montantTTC")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Montant de Taxe">
                      {getFieldDecorator("montantTaxe")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Taxe ParaFiscale">
                      {getFieldDecorator("montantTaxeParaFiscale")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Frais d'acquisitionTTC">
                      {getFieldDecorator("fraisAcquisitionTTC")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Frais de GestionTTC">
                      {getFieldDecorator("fraisGestionTTC")(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
            </Spin>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
export default Form.create()(EncaissementGroupe);

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import axios from "axios";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Tag,

} from "antd";
import moment, { duration } from "moment";
import React, { Component } from "react";
import {
  NOM_ASSURE,
  CIN_ASSURE,
  NUM_CONTRAT,
  DATE_EFFET,
  DATE_PRELEVEMENT,
  AVN_STATUS,
  AVN_DTEFFET,
  ACCESS_TOKEN,
  CODE_ACCEPTATION
} from "../../constants/index";
import DetailsContrat from "./DetailsContrat";
import ComponentTitle from "../../util/Title/ComponentTitle";
import {
  addAvenant,
  ajouterAvenant,
  getTypeAvenant
} from "../Parametrage/avenant/AvenantAPI";
import {
  getDecesContratsByPartenaire,
  searchContrat,
  updateDecesContratStatus,
  updateContratDateEffetAPI,
  updateContartDeces,
  getAcceptationByContrat
} from "./ContratsAPI";


import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";



import ChangementStatus from "./Avenant/ChangementStatus";

import { CONNECTION_URL } from "../../constants/source";

import QRCode from "react-qr-code";
import QrScanner from 'qr-scanner';
export const MyContext = React.createContext();
var contrats = [];
var statuts = "ACCEPTED";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
var typeProduit = "";
let dateCP = new Date();
let formData = new FormData();
class ConsultDecesContratStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      Avenantchoisi: "",
      TypeAvenant: null,
      AdressChangementVisibilty: false,
      modelShow: false,
      visible: false,
      visibled: false,
      show: false,
      acceptation: [],
      avenantCapital: false,
      avenantContrat: false,
      showed: false,
      sinistre: false,
      view: false,
      restitution: false,
      dateCreation: new Date(),
      dateEff : moment(moment(), "YYYY-MM-DD").format("YYYY-MM-DD"),
      flag:0,
      searchText: "",
      searchedColumn: "",
      selectedRowKeys: [],
      searchby: NUM_CONTRAT,
      searchfor: "",
      selectedFile: null,
      record: {},
      contrats: [],
      totalItems: 0,
      pagenumber: 1,
      value: "",
      differe: null,
      dateEcheance: "",
      duree: null,
      keyRecord: "",
      capital: null,
      tauxSurprime: null,
      tauxReduction: null,
      tauxTaxe: null,
      tarification: {},
      montantSurprime: null,
      montantCotisation: null,
      montantTTC: null,
      cotisationTotale: null,
      montantTaxe: null,
      prorata: null,
      typesAvenant: []
    };

    this.columns = [
      {
        title: "N° de Contrat",
        dataIndex: NUM_CONTRAT,
        key: "idContrat",
        render: (text, record) => {
          return (
            <span>
              <div>
                <MyContext.Provider
                  value={{
                    state: record
                  }}
                >
                  <DetailsContrat />
                </MyContext.Provider>
              </div>
            </span>
          );
        }
      },{
        title: "Code d'acceptation",
        dataIndex: "acceptation.code",
        key: CODE_ACCEPTATION
      },
      {
        title: "Durée Contrat",
        dataIndex: "dureeContrat",
        key: "dureeContrat",
        ...getColumnSearchProps("dureeContrat", "Durée contrat", this)
      },
      {
        title: "CIN assuré",
        dataIndex: "assure.cin",
        key: "cinAssure"
      },
      {
        title: "Nom assuré",
        dataIndex: "assure.nom",
        key: "nomAssure",
        ...getColumnSearchProps("assure.nom", "Prénom assure", this)
      },
      {
        title: "Prénom assuré",
        dataIndex: "assure.prenom",
        key: "prenomAssure"
      },
      {
        title: "Nom souscripteur",
        dataIndex: "souscripteur.nom",
        key: "nomSouscripteur",
        ...getColumnSearchProps("souscripteur.nom", "Prénom assure", this)
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "souscripteur.prenom",
        key: "prenomSouscripteur"
      },

      {
        title: "Date d'effet",
        dataIndex: DATE_EFFET,
        width: "10%",
        key: "dateEffet"
      },
      {
        title: "Date écheance",
        dataIndex: "dateEcheance",
        width: "10%",
        key: "dateEcheance"
      },
      {
        title: "Produit",
        dataIndex: "produit.libelle",
        key: "produit"
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: status => (
          <span>
            {status === "ACCEPTED" ? (
              <Tag color="green" key={status}>
                ACCEPTE
              </Tag>
            ) : (
              <Tag color="volcano" key={status}>
                {status}
              </Tag>
            )}
          </span>
        )
      },
      {
        title: "Capital Assure",
        dataIndex: "capitalAssure",
        key: "capitalAssure"
      },
      {
        title: "Action",
        dataIndex: "operation",
        width: "10%",
        render: (text, record) => {
          return (
            <span>
             
              {record.status == "WAITING_ACCEPTATION" ||
              record.status == "EN_COURS_RESILIATION" ||
              record.status == "ACCEPTED" ? (
                ""
              ) : (
                <span>
                  <Button
                    type="primary"
                    onClick={() => this.handleSelectChange(record)}
                    size="small"
                    style={{
                      borderRadius: "0px",
                      width: "105px",
                      backgroundColor: "rgb(236 131 91)",
                      borderColor: "rgb(236 131 91)",
                      textAlign: "left",
                      marginBottom: "2px"
                    }}
                  >
                    <Icon type="plus-circle" /> Avenant
                  </Button>
                  {record.status == "INSTANTANEE" && (
                    <span>
                                          
                      
                      
                    </span>
                  )}
                </span>
              )}
            </span>
          );
        }
      }
    ];
  }

 
  getContratId = value => {
    console.log(value);
    formData.append("contract_id", value.id);
  };


  async getAcceptation(id) {
    let response = await getAcceptationByContrat(id);
    this.setState({ acceptation: response.data });
  }

  async ajouterUnAvenant(avenant) {
    await ajouterAvenant(avenant);
  }


  Canceled = () => {
    this.setState({ modelShow: false });
  };

  handleOk = () => {
    this.setState({ modelShow: false });
  };

  showModal = value => {
    this.getAcceptation(value.id);
    this.setState({
      modelShow: true,
      record: value
    });
  };





  saveRequest = values => {
    let contrat = this.state.record;
    switch (this.state.TypeAvenant.code) {
    
      case AVN_STATUS:
        const changementStatusModel = {
          ...values,
          typeAvenantId: this.state.TypeAvenant.id
        };
        this.updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
          contrat.id,
          changementStatusModel
        );
        break;

    
    }
  };

  async updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
    id,
    changementCapitaleDureeUpdateModel
  ) {
    let response = await updateContartDeces(
      id,
      changementCapitaleDureeUpdateModel
    );
    console.log("response:", response);
    if (response.status === 200) {
      this.setState({ visible: false });
      window.location.reload();
    }
  }

  handleChange = id => {
    let selectedType;
    this.state.typesAvenant.forEach(element => {
      if (element.id === id) {
        this.setState({ TypeAvenant: element });
        selectedType = element.code;
      }
    });

    switch (selectedType) {
      

      case AVN_STATUS:
        this.setState({
          Avenantchoisi: (
            <ChangementStatus
              record={this.state.record}
              saveRequest={this.saveRequest}
            />
          )
        });
        break;

      
    }
  };

  componentDidMount() {
    console.log("contrats", this.state.contrats);
    console.log("props", this.props);
    this.getproprties(
      statuts,
      this.state.pagenumber - 1,
      5,
      DATE_PRELEVEMENT,
      "desc"
    );
    this.getTypeAvenants();
  }

  async getproprties(statut, page, limit, sort, direction) {
    let contratsResponse = await getDecesContratsByPartenaire(
      page,
      limit,
      sort,
      direction
    );
    contrats = [...contratsResponse.data.content];
    this.setState({
      contrats: [...contratsResponse.data.content],
      totalItems: contratsResponse.data.totalElements
    });
    console.log("contracts", this.state.contrats);
  }

  handleSelectChange = value => {
    this.setState({
      visible: true,
      record: value
    });
  };


  handleConfirm = (value, key) => {
    notification.close(key);
    this.updatedContrat(this.state.record.id, value);
    this.setState({ visible: false });
  };

  componentDidUpdate(_, prevState) {
    console.log("contrats1", this.state.contrats);
    console.log("contrats0", contrats);
    const effetMonth = moment(this.state.record.dateEffet).format("M");
    const effet = moment(this.state.record.dateEffet).format("D");
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

  async searchContrats(page, limit, searchby, searchfor) {
    console.log("test value searchby= "+this.state.searchby+"  test value searchfor=  "+searchfor);

    let contratResponse = await searchContrat(page, limit, searchby, searchfor);
    if (searchby === CIN_ASSURE || searchby === NOM_ASSURE) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements
      });
    } else if (searchby === NUM_CONTRAT) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements
      });
    }else if (searchby === "code") {
      this.setState({
        contrats: [...contratResponse.data.content]
      });
    }
  }
  async getTypeAvenants() {
    let response = await getTypeAvenant();
    const dataSource=[...response.data.content];
    this.setState({
      typesAvenant: dataSource.filter(item => item.code === AVN_STATUS)
    });
  }

  onChangeCapital = e => {
    this.setState({ capital: e.target.value });
  };

  onChangeDuree = e => {
    this.setState({ duree: e.target.value });
  };

  onChangeTauxS = e => {
    this.setState({ tauxSurprime: e.target.value });
  };

  onChangeTauxReduction = e => {
    this.setState({ tauxReduction: e.target.value });
  };

  onPaginationChange = (pagenumber, pagesize) => {
    if (this.state.searchfor === "")
      this.getproprties(statuts, pagenumber - 1, 5, DATE_PRELEVEMENT, "desc");
    else {
      this.searchContrats(
        pagenumber - 1,
        5,
        this.state.searchby,
        this.state.searchfor
      );
    }
  };

  selectBefore = (
    <Select
      onChange={value => this.setState({ searchby: value })}
      defaultValue={NUM_CONTRAT}
      style={{ width: 150 }}
    >
      <Option value={NUM_CONTRAT}>N° de contrat</Option>
      <Option value={CIN_ASSURE}>CIN</Option>
      <Option value={NOM_ASSURE}>Nom Assuré</Option>
      <Option value={CODE_ACCEPTATION}>Code d'acceptation</Option>
    </Select>
  );

  search = value => {
    this.setState({ pagenumber: 1, searchfor: value });
    this.searchContrats(
      this.state.pagenumber - 1,
      2,
      this.state.searchby,
      value
    );
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    this.props.form.setFieldsValue({
      avenants: ""
    });
    this.setState({ show: false, view: false,Avenantchoisi:"" });
  };



  async updatedContrat(id, body) {
    // debugger;
    await addAvenant(id, body);
  }
  async updatedContratStatus(id, body) {
    // debugger;
    await updateDecesContratStatus(id, body);
  }

  async updatedContratDateEffet(id, body) {
    // debugger;
    await updateContratDateEffetAPI(id, body);
  }


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.avenantCapital) {
          let request = {
            capital: values.capitalAssure,
            duree: values.duree,
            differe: values.differe,
            montantCotisation: values.montantCotisation,
            montantSurprime: values.montantSurprime,
            montantTaxe: values.montantTaxe,
            prorata: values.prorata,
            tauxReduction: values.tauxReduction,
            tauxSurprime: values.tauxSurprime,
            typeAvenantId: values.avenants
          };
          const key = `open${Date.now()}`;
          const btn = (
            <div>
              <Button
                type="primary"
                onClick={() => this.handleConfirm(request, key)}
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
                    {values.montantCotisation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant surprime" span={2}>
                    {values.montantSurprime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant proratisé">
                    {values.prorata}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant taxe" span={2}>
                    {values.montantTaxe}
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
        } else if (this.state.avenantContrat) {
          let request = {
            status: values.nouveauStatus,
            typeAvenantId: values.avenants
          };
          this.updatedContratStatus(this.state.record.id, request);
          this.setState({ visible: false });
        }
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 14 }
      }
    };

    return (
      <div>
        <ComponentTitle title="Changement Status Contrat Décès" />
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={value => this.search(value)}
            enterButton
            style={{ width: 600 }}
          />
        </div>
        <Table
          bordered
          // rowClassName="editable-row"
          size="middle"
          columns={this.columns}
          dataSource={this.state.contrats}
          pagination={{
            onChange: this.onPaginationChange,
            pageSize: 5,
            total: this.state.totalItems
          }}
        />
        <Modal
          visible={visible}
          title="Ajouter Avenant"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          style={{ top: 20 }}
          width="880px"
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              className="not-rounded"
              
            >
              Fermer
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col span={24}>
                <Form.Item label="Liste des avenants ">

                  {getFieldDecorator("avenants", {
                    rules: [
                      { message: "Please input the title of collection!" }
                    ]
                  })(
                     
                    <Select
                      placeholder="Sélectionnez "
                      onChange={this.handleChange}
                    >
                      {this.state.typesAvenant.map(element => {
                         
                        return (
                          <Option
                            key={element.id}
                            value={element.id}
                            label={element.code}
                          >
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {this.state.Avenantchoisi}
            
          </Form>
        </Modal>

      </div>
    );
  }
}
export default Form.create()(ConsultDecesContratStatus);

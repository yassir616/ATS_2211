/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table
} from "antd";
import React, { Component } from "react";

import DetailsCotisationRetraite from "./DetailsCotisationRetraite";
import {
  getRetraiteContrat,
  searchContrat
} from "../GestionContrats/ContratsAPI";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { ajoutCotisation } from "./CotisationAPI";

export const MyContext = React.createContext();
var statuts = "ACCEPTED";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
let id = "";
class ComptabiliteRetraite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      dateCreation: new Date(),
      searchText: "",
      searchedColumn: "",
      selectedRowKeys: [],
      searchby: "numeroContrat",
      searchfor: "",
      selectedFile: null,
      record: {},
      contrats: [],
      totalItems: 0,
      pagenumber: 1,
      tauxSurprime: null,
      montantSurprime: null,
      montantCotisation: null,
      cotisationTotale: null,
      natureDeLaCotisaion: ""
    };

    this.columns = [
      {
        title: "N° de Contrat",
        dataIndex: "numeroContrat",
        key: "numeroContrat",
        render: (text, record) => {
          return (
            <span>
              <div>
                <MyContext.Provider
                  value={{
                    state: record
                  }}
                >
                  <DetailsCotisationRetraite />
                </MyContext.Provider>
              </div>
            </span>
          );
        }
      },
      {
        title: "Durée Contrat",
        dataIndex: "dureeContrat",
        key: "dureeContrat",
        ...getColumnSearchProps("dureeContrat", "Durée contrat", this)
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
        dataIndex: "dateEffet",
        key: "dateEffet"
      },
      {
        title: "Date écheance",
        dataIndex: "dateEcheance",
        key: "dateEcheance"
      },
      {
        title: "Produit",
        dataIndex: "produit.libelle",
        key: "produit"
      },
      {
        title: "Action",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.handleChange(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  width: "105px",
                  backgroundColor: "#4ee289",
                  borderColor: "#4ee289",
                  textAlign: "left"
                }}
              >
                <Icon type="plus-circle" /> Cotisation
              </Button>
            </span>
          );
        }
      }
    ];
  }

  onSelectChange = value => {};
  componentDidMount() {
    this.getproprties(statuts, this.state.pagenumber - 1, 3);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.montantCotisation !== this.state.montantCotisation &&
      this.state.montantCotisation !== null
    ) {
      this.setState(
        {
          montantSurprime:
            (this.state.tauxSurprime * this.state.montantCotisation) / 100
        },
        () => {}
      );

      this.setState({
        cotisationTotale:
          this.state.montantSurprime + this.state.montantCotisation
      });
    }
  }
  handleChange = value => {
    id = value.id;
    this.setState(
      {
        visible: true,
        tauxSurprime: value.tauxSurprime,
        montantContributionPeriodique: value.montantContributionPeriodique
      },
      () => {}
    );
  };
  onChangeMontantCotisation = e => {
    this.setState({ montantCotisation: e.target.value });
  };
  handleContributionTypeChange = value => {
    this.setState({
      natureDeLaCotisaion: value
    });
    if (value === "Epargne periodique") {
      this.setState({
        montantContributionPeriodiqueToShow: this.state
          .montantContributionPeriodique,
        montantCotisation: this.state.montantContributionPeriodique
      });
    }
  };
  async getproprties(statut, page, limit) {
    let contratsResponse = await getRetraiteContrat(statut, page, limit);
    this.setState({
      contrats: [...contratsResponse.data.content],
      totalItems: contratsResponse.data.totalElements
    });
  }

  async searchContrats(page, limit, searchby, searchfor) {
    let contratResponse = await searchContrat(page, limit, searchby, searchfor);

    if (searchby === "cin" || searchby === "nom") {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements
      });
    } else if (searchby === "numeroContrat") {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements
      });
    }
  }
  onPaginationChange = (pagenumber, pagesize) => {
    if (this.state.searchfor === "")
      this.getproprties(statuts, pagenumber - 1, 3);
    else {
      this.searchContrats(
        pagenumber - 1,
        3,
        this.state.searchby,
        this.state.searchfor
      );
    }
  };
  selectBefore = (
    <Select
      onChange={value => this.setState({ searchby: value })}
      defaultValue="numContrat"
      style={{ width: 150 }}
    >
      <Option value="numContrat">N° de contrat</Option>
      <Option value="cin">CIN</Option>
      <Option value="nom">Nom Assuré</Option>
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
  handleSubmited = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ visible: false });
        let requestModel = {
          datePrelevement: values.datePrelevement,
          montantCotisation: this.state.montantCotisation,
          montantTTC: this.state.montantCotisation,
          cotisationType: this.state.natureDeLaCotisaion,
          contrat: id
        };
        ajoutCotisation(requestModel)
          .then(response => {
            notification.success({
              message: "TAKAFUL",
              description: "L'insertion est bien faite"
            });
          })
          .catch(error => {
            notification.error({
              message: "TAKAFUL",
              description:
                error.message ||
                "Sorry! Something went wrong. Please try again!"
            });
          });
      } else {
        message.warning("Contrat non couvert au date de sinistre");
      }
    });
  };
  handleCanceled = () => {
    this.setState({ visible: false, natureDeLaCotisaion: "" });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 }
      }
    };

    return (
      <div>
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
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.contrats}
          pagination={{
            onChange: this.onPaginationChange,
            pageSize: 3,
            total: this.state.totalItems
          }}
        />
        <Modal
          visible={visible}
          title="Veuillez saisir les informations d'une cotisation"
          onOk={this.handleSubmited}
          onCancel={this.handleCanceled}
          afterClose={this.handleClosed}
          style={{ top: 20 }}
          width="1000px"
          footer={[
            <Button
              key="back"
              onClick={this.handleCanceled}
              className="not-rounded"
            >
              Fermer
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmited}
              className="not-rounded"
            >
              Ajouter
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <div>
              <Row>
                <Col span={11} offset={1}>
                  <Form.Item label="Effet Emission">
                    {getFieldDecorator("datePrelevement", {
                      rules: [
                        { required: true, message: "La date est obligatoire" }
                      ]
                    })(
                      <DatePicker
                        format={dateFormat}
                        style={{ width: "100%" }}
                        className="not-rounded"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11} offset={1}>
                  <Form.Item label="Nature Cotisation">
                    <Select
                      onChange={this.handleContributionTypeChange}
                      style={{ width: "100%" }}
                    >
                      <Option value="Epargne periodique">
                        Contribution périodique
                      </Option>
                      <Option value="Epargne libre">Contribution libre</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={11} offset={1}>
                  {this.state.natureDeLaCotisaion === "Epargne libre" ? (
                    <Form.Item label="Montant Cotisation">
                      {getFieldDecorator("montantCotisation")(
                        <Input
                          className="not-rounded"
                          type="number"
                          onChange={this.onChangeMontantCotisation}
                          addonAfter="DH"
                        />
                      )}
                    </Form.Item>
                  ) : null}
                  {this.state.natureDeLaCotisaion === "Epargne periodique" ? (
                    <Form.Item label="Montant Cotisation">
                      <Input
                        className="not-rounded"
                        defaultValue={
                          this.state.montantContributionPeriodiqueToShow
                        }
                        disabled
                      />
                    </Form.Item>
                  ) : null}
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ComptabiliteRetraite);

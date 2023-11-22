import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Table,
  Tag
} from "antd";
import React, { Component } from "react";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { MyContext } from "./ConsultProduitDeces.js";
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      searchText: "",
      searchedColumn: "",
      record: {},
      value: "",
      keyRecord: "",
      auxiliaire: []
    };
    this.columns = [
      {
        title: "Date Début",
        dataIndex: "dateDebut",
        key: "dateDebut"
      },
      {
        title: "Date Fin",
        dataIndex: "dateFin",
        key: "Date Fin"
      },
      {
        title: "Commission partenaire",
        dataIndex: "commissionPartenaire",
        key: "Commission partenaire"
      },
      {
        title: "TVA",
        dataIndex: "tva",
        key: "tva"
      }
    ];
    this.columns2 = [
      {
        title: "Age min",
        dataIndex: "ageMin",
        key: "ageMin"
      },
      {
        title: "Age max",
        dataIndex: "ageMax",
        key: "Age max"
      },
      {
        title: "Capital min",
        dataIndex: "capitalMin",
        key: "Capital min"
      },
      {
        title: "Capital Max",
        dataIndex: "capitalMax",
        key: "capitalMax"
      },
      {
        title: "Différé min",
        dataIndex: "differeMin",
        key: "differeMin"
      },
      {
        title: "Différé Max",
        dataIndex: "differeMax",
        key: "différeMax"
      },
      {
        title: "Durée Min",
        dataIndex: "dureeMin",
        key: "dureeMin"
      },
      {
        title: "Durée Max",
        dataIndex: "dureeMax",
        key: "dureeMax"
      },
      {
        title: "Taux annuel",
        dataIndex: "taux",
        key: "taux"
      },
      {
        title: "Taux mensuel",
        dataIndex: "tauxMensuelle",
        key: "tauxMensuelle"
      }
    ];
    this.columns3 = [
      {
        title: "Age min",
        dataIndex: "ageMin",
        key: "ageMin"
      },
      {
        title: "Age max",
        dataIndex: "ageMax",
        key: "Age max"
      },
      {
        title: "Capital min",
        dataIndex: "capitalMin",
        key: "Capital min"
      },
      {
        title: "Capital Max",
        dataIndex: "capitalMax",
        key: "capitalMax"
      },
      {
        title: "Différé min",
        dataIndex: "differeMin",
        key: "differeMin"
      },
      {
        title: "Différé Max",
        dataIndex: "differeMax",
        key: "differeMax"
      },
      {
        title: "Durée Min",
        dataIndex: "dureeMin",
        key: "dureeMin"
      },
      {
        title: "Durée Max",
        dataIndex: "dureeMax",
        key: "dureeMax"
      },
      {
        title: "Forfait",
        dataIndex: "forfait",
        key: "forfait"
      }
    ];
    this.columns1 = [
      {
        title: "Type prestation",
        dataIndex: "typePrestation.libelle",
        key: "typePrestation.libelle"
      },
      {
        title: "Pièces justificatives",
        key: "pieceJointe",
        dataIndex: "pieceJointe",
        render: pieceJointe => (
          <span>
            {pieceJointe.map(tag => {
              let color = "geekblue";
              return (
                <Tag key={tag.id} color={color}>
                  {tag.libelle}
                </Tag>
              );
            })}
          </span>
        )
      }
    ];
  }
  handleReload() {
    window.location.reload();
  }

  render() {
    const formItemLayout = {
      labelCol: {
        span: 10
      },
      wrapperCol: {
        span: 12
      }
    };

    return (
      <div className="person">
        <ComponentTitle title="Consultation Produit" />
        <MyContext.Consumer>
          {context => (
            <React.Fragment>
              <h3>Détails du produit : {context.state.libelle}</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>

              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                <Col span={24}>
                  <Form {...formItemLayout}>
                    <Col span={12}>
                      <Form.Item label="Code">
                        <Input value={context.state.code} />
                      </Form.Item>

                      <Form.Item label="N° d'homologation">
                        <Input value={context.state.numeroHomologation} />
                      </Form.Item>

                      <Form.Item label="Différé minimale">
                        <InputNumber
                          value={context.state.differeMin}
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>

                      <Form.Item label="Age minimum">
                        <InputNumber
                          value={context.state.ageMin}
                          addonAfter="ANS"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>

                      <Form.Item label="Echéance impayées à assurer">
                        <InputNumber
                          value={context.state.echeanceImpayees}
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>

                      <Form.Item label="Frais de gestion WAKALA">
                        <InputNumber
                          value={context.state.fraisGestion}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Frais d'acquisition">
                        <InputNumber
                          value={context.state.fraisAcquisition}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Seuil Conseil">
                        <InputNumber
                          value={context.state.seuilConseil}
                          addonAfter="DH"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Seuil prestation">
                        <InputNumber
                          value={context.state.seuilPrestation}
                          addonAfter="DH"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Taux taxe d'assurance">
                        <InputNumber
                          value={context.state.taxe}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Libelle">
                        <Input value={context.state.libelle} />
                      </Form.Item>

                      <Form.Item label="Date d'homologation">
                        <Input value={context.state.dateHomologation} />
                      </Form.Item>

                      <Form.Item label="Différé maximale">
                        <InputNumber
                          value={context.state.differeMax}
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>

                      <Form.Item label="Age maximum à la souscription">
                        <InputNumber
                          value={context.state.ageMax}
                          addonAfter="ANS"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>

                      <Form.Item label="Age maximum d'éligibilité">
                        <InputNumber
                          value={context.state.ageMaxEligibilite}
                          addonAfter="ANS"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="TVA frais de gestion">
                        <InputNumber
                          value={context.state.tvaFraisGestion}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="TVA frais d'acquisition'">
                        <InputNumber
                          value={context.state.tvaFraisAcquisition}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Seuil examinateur">
                        <InputNumber
                          value={context.state.seuilExaminateur}
                          addonAfter="DH"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                      <Form.Item label="Seuil Réassurance">
                        <InputNumber
                          value={context.state.seuilReassurance}
                          addonAfter="DH"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>
                  </Form>
                </Col>
                <Col span={8}>
                  <h3>Périodicités</h3>
                  <Divider
                    style={{
                      marginBottom: "3px",
                      marginTop: "10px",
                      width: "5%"
                    }}
                  ></Divider>
                  {context.state.periodicites.map(element => {
                    return (
                      <Tag
                        key={element.id}
                        color="geekblue"
                        style={{ margin: "20px 4px" }}
                      >
                        {element.libelle}
                      </Tag>
                    );
                  })}
                </Col>
                <Col span={8}>
                  <h3>Exclusions</h3>
                  <Divider
                    style={{ marginBottom: "3px", marginTop: "10px" }}
                  ></Divider>
                  {context.state.exclusions.map(element => {
                    return (
                      <Tag
                        key={element.id}
                        color="purple"
                        style={{ margin: "20px 4px" }}
                      >
                        {element.exclusionNom}
                      </Tag>
                    );
                  })}
                </Col>
                <Col span={8}>
                  <h3>Points de Vente</h3>
                  <Divider
                    style={{ marginBottom: "3px", marginTop: "10px" }}
                  ></Divider>
                  {context.state.pointVentes.map(element => {
                    return (
                      <Tag
                        key={element.id}
                        color="cyan"
                        style={{ margin: "20px 4px" }}
                      >
                        {element.libelle}
                      </Tag>
                    );
                  })}
                </Col>
              </Row>

              <h3>Commisssions</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>
              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                <Col span={24}>
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns}
                    dataSource={context.state.commissions}
                    pagination={false}
                  />
                </Col>
              </Row>

              <h3>Types de prestations</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>
              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                <Col span={24}>
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns1}
                    dataSource={context.state.prestations}
                    pagination={false}
                  />
                </Col>
              </Row>

              <h3>Tarifications</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>
              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                {context.state.tarrifications[0].forfait === null ? (
                  <Col span={24}>
                    <Table
                      rowClassName="editable-row"
                      columns={this.columns2}
                      dataSource={context.state.tarrifications}
                      pagination={false}
                    />
                  </Col>
                ) : (
                  <Col span={24}>
                    <Table
                      rowClassName="editable-row"
                      columns={this.columns3}
                      dataSource={context.state.tarrifications}
                      pagination={false}
                    />
                  </Col>
                )}
              </Row>
            </React.Fragment>
          )}
        </MyContext.Consumer>

        <Button
          type="primary"
          className="add-button"
          onClick={() => this.handleReload()}
        >
          <Icon type="arrow-left" />
          Retour
        </Button>
      </div>
    );
  }
}
export default Details;

import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Row,
  Table
} from "antd";
import React, { Component } from "react";

import { MyContext } from "./ProduitMRB";

class ProduitMRBDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      searchText: "",
      searchedColumn: "",
      record: {},
      value: "",
      keyRecord: ""
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
      }



    
      /* {
        title: "Valeur Min",
        dataIndex: "valeurMin",
        key: "valeurMin"
      },
      {
        title: "Valeur Max",
        dataIndex: "valeurMax",
        key: "valeurMax"
      },
      {
        title: "Age Min ",
        dataIndex: "ageMin",
        key: "ageMin"
      },
      {
        title: "Age Max ",
        dataIndex: "ageMax",
        key: "ageMax"
      },
      {
        title: "Taux de contribution ",
        dataIndex: "tauxContribution",
        key: "tauxContribution"
      } */
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
                <Col span={22} offset={1}>
                  <h3>Informations Générale</h3>
                  <Divider
                    style={{ marginBottom: "30px", marginTop: "10px" }}
                  ></Divider>
                </Col>
                <Col span={24}>
                  <Form {...formItemLayout}>
                    <Col span={11} offset={1}>
                      <Form.Item label="Code">
                        <Input value={context.state.code} />
                      </Form.Item>
                      <Form.Item label="Frais de gestion">
                        <Input value={context.state.fraisGestion} />
                      </Form.Item>
                      <Form.Item label="Mantant max de garantie">
                        <Input value={context.state.montantMaximumGarantie} />
                      </Form.Item>
                      <Form.Item label="Partenaire">
                        <Input value={context.state.partenaire.raisonSocial} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item label="libelle">
                        <Input value={context.state.libelle} />
                      </Form.Item>
                      <Form.Item label="TVA frais de gestion">
                        <Input value={context.state.tvaFraisGestion} />
                      </Form.Item>
                      <Form.Item label="Taux taxe">
                        <Input value={context.state.tauxTaxe} />
                      </Form.Item>
                    </Col>
                    <Col span={23} offset={1}>
                      <label>
                        <Form.Item label=" Délai de prescription de l’offre EART" />
                      </label>
                    </Col>
                    <Col span={11} offset={1}>
                      <Form.Item label="En l’attente du retour client">
                        <Input value={context.state.delaiPrescription} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item label="Client sans souscription">
                        <Input
                          value={
                            context.state.delaiPrescriptionSansSouscription
                          }
                        />
                      </Form.Item>
                    </Col>
                   {/* <Col span={22} offset={1}>
                      <h3>Assuré/Participant</h3>
                      <Divider
                        style={{ marginBottom: "30px", marginTop: "10px" }}
                      ></Divider>
                    </Col>
                    <Col span={8} offset={1}>
                      <Form.Item label="Nature du participant">
                        <Input value={context.state.natureParticipant} />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item label="Nature d'assuré">
                        <Input value={context.state.natureAssure} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
                        <Checkbox checked={context.state.assureDiffParticipant}>
                          Assuré différent du participant
                        </Checkbox>
                      </Form.Item>
                        </Col>*/}
                    <Col span={22} offset={1}>
                      <h3>Franchise</h3>
                      <Divider
                        style={{ marginBottom: "30px", marginTop: "10px" }}
                      ></Divider>
                    </Col>
                    <Col span={8} offset={1}>
                      <Form.Item>
                        <Checkbox checked={context.state.franchiseIncendie}>
                          Franchise incendie
                        </Checkbox>
                      </Form.Item>
                      <Form.Item>
                        <Checkbox checked={context.state.franchiseBrisGlace}>
                          Franchise bris de glace
                        </Checkbox>
                      </Form.Item>
                      <Form.Item>
                        <Checkbox checked={context.state.franchiseDegatEaux}>
                          Franchise dégât des eaux
                        </Checkbox>
                      </Form.Item>
                      <Form.Item>
                        <Checkbox
                          checked={context.state.franchiseCatastropheNaturelles}
                          style={{ display: 'none' }}
                        >
                          Franchise catastrophes naturelles
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={22} offset={1}>
                      <h3>Tarification</h3>
                      <Divider
                        style={{ marginBottom: "30px", marginTop: "10px" }}
                      ></Divider>
                    </Col>
                    <Col span={22} offset={1}>
                      <Table
                        rowClassName="editable-row"
                        columns={this.columns}
                        dataSource={context.record}
                        pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
                      />
                    </Col>
                  </Form>
                </Col>
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
export default ProduitMRBDetails;

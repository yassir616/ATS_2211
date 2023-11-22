import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";
import { MyContext } from "../ConsultDecesContratStatus";

const { Panel } = Collapse;

class Produits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left"
    };
  }

  render() {
    const { expandIconPosition } = this.state;
    return (
      <MyContext.Consumer>
        {context => (
          <React.Fragment>
            <div>
              <Collapse
                defaultActiveKey={["1"]}
                expandIconPosition={expandIconPosition}
              >
                <Panel
                  header="Produit"
                  key="1"
                  extra={
                    <div style={{ fontSize: "13px" }}>
                      Libelle : {context.state.produit.libelle}
                    </div>
                  }
                >
                  <div>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Libelle</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.libelle}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Code</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.code}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Fraisd&aposacquisition
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.fraisAcquisition}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Risque</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.risque.libelle}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Catégorie</h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.produit.categorie.libelle}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Durée min contrat (Mois)
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.dureeMin}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Numéro de compte
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.numeroCompte}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Délai résiliation
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.delaiResiliation}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Délai préavis</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.delaiPreavis}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Délai déclaration
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.delaiDeclaration}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Seuil examinateur
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.seuilExaminateur}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Seuil Conseil</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.seuilConseil}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Durée Max</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.dureeMax}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Durée Min</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.dureeMin}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Différé Max</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.differeMax}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Différé Min</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.differeMin}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Age Max</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produit.ageMax}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Age Min</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produit.ageMin}</p>
                      </Col>
                    </Row>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </React.Fragment>
        )}
      </MyContext.Consumer>
    );
  }
}
export default Produits;

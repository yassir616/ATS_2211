import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";

import { MyContext } from "../ConsultationsContratsMrb";
const { Panel } = Collapse;
class ProduitMrb extends Component {
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
                      Libelle : {context.state.produitMrb.libelle}
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
                        <p>{context.state.produitMrb.libelle}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Code</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produitMrb.code}</p>
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
                          - Frais de gestion
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produitMrb.fraisGestion}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - TVA frais de gestion
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.produitMrb.tvaFraisGestion}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Délai prescription
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produitMrb.delaiPrescription}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Délai prescription sans souscription
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>
                          {
                            context.state.produitMrb
                              .delaiPrescriptionSansSouscription
                          }
                        </p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Nature Assuré</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produitMrb.natureAssure}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Nature du bien assuré
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produitMrb.natureBienAssure}</p>
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
                          - Montant maximum de garantie
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produitMrb.montantMaximumGarantie}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Taux taxe</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.produitMrb.tauxTaxe}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Nature du participant
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.produitMrb.natureParticipant}</p>
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

export default ProduitMrb;

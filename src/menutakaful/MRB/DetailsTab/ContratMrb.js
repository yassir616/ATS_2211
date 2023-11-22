import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";
import { MyContext } from "../ConsultationsContratsMrb";
const { Panel } = Collapse;

class ContratMrb extends Component {
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
                  header="Contrat"
                  key="1"
                  extra={
                    <div style={{ fontSize: "13px" }}>
                      N° contrat : {context.state.numeroContrat}
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
                        <h4 style={{ fontWeight: "blod" }}>- N° de contrat</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.numeroContrat}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - N° dossier de financement
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.numeroDossierFinancement}</p>
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
                          - Date d&apos;effet
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.dateEffet}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Date d&apos;écheance
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.dateEcheance}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>-N° Simulataion</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.numeroSimulation}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - N° de titre foncier
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.numeroTitreFoncier}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Réduction</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.reduction}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Périodicité</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.periodicite.libelle}</p>
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
                          - Situation risque
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.situationRisque}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Superficie</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.superficie}</p>
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
                          - Valeur du Contenu
                        </h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.valeurBatiment}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Type de batiment
                        </h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.typeBatiment}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prime nette</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.primeNette}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prime Evcat</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.primeEvcat}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prime HT</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.primeHT}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prime TTC</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.primeTTC}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prorata HT</h4>
                      </Col>
                      <Col span={4} offset={1}>
                        <p>{context.state.prorata}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Prorata TTC</h4>
                      </Col>
                      <Col span={3} offset={1}>
                        <p>{context.state.prorataTTC}</p>
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

export default ContratMrb;

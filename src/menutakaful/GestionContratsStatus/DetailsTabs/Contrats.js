import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";
import { MyContext } from "../ConsultDecesContratStatus";
const { Panel } = Collapse;

class Contrats extends Component {
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
                        <h4 style={{ fontWeight: "blod" }}>
                          - N° de compte bancaire
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>---</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Numéro du contrat
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.numeroContrat}</p>
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
                        <h4 style={{ fontWeight: "blod" }}>- Durée (mois)</h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.dureeContrat}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant de la cotisation périodique
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.montantCotisation.toFixed(2)}</p>
                      </Col>
                    </Row>

                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Périodicité</h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.periodicite.libelle}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant des frais d&apos;acquisition
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.montantFrais.toFixed(2)}</p>
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
                          - Date de prélèvement
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.datePrelevement}</p>
                      </Col>
                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant de financement
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.capitalAssure.toFixed(2)}</p>
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
                          - Taux de financement (%)
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.tauxInteret}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Taux surprime (%)
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.tauxSurprime}</p>
                      </Col>
                    </Row>
                    <Row
                     style={{
                      backgroundColor: "rgb(0,0,0,0.00)",
                      marginTop: "10px"
                    }}>

                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant Taxe 
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.montantTaxe}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant supprimé / HT
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.montantSurprime}</p>
                      </Col>

                    </Row>

                    <Row
                     style={{
                      backgroundColor: "rgb(0,0,0,0.00)",
                      marginTop: "10px"
                    }}>

                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant global TTC
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.cotisation.montantTTC}</p>
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

export default Contrats;

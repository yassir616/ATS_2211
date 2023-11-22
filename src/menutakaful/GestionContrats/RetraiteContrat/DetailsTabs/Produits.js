import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";
import { MyContext } from "../ConsultRetraiteContrat/ConsultRetraiteContrat";
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
                          - Frais d&aposacquisition
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
                        <p>{context.state.produit.dureeMinimalSouscription}</p>
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
                          - Nature Condition Disciplinaire Rachat Total
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>
                          {
                            context.state.produit
                              .natureConditionDisciplinaireTotale
                          }
                        </p>
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
                          - Nature Condition Disciplinaire Rachat Partiel
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>
                          {
                            context.state.produit
                              .natureConditionDisciplinairePartiel
                          }
                        </p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Valeur Condition Disciplinaire Totale
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>
                          {
                            context.state.produit
                              .valeurConditionDisciplinaireTotale
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
                        <h4 style={{ fontWeight: "blod" }}>
                          - Valeur Condition Disciplinaire Partiel
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>
                          {
                            context.state.produit
                              .valeurConditionDisciplinairePartiel
                          }
                        </p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Pool Investissment
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.produit.poolInvestissment.libelle}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={6} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Revenu Global</h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.produit.revenuGlobal}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Montant Min de la Contribution
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.produit.montantMinContribution}</p>
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
                          - Taux de Rendement Avant Imposition
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>
                          {context.state.produit.tauxRendementAvantImposition}
                        </p>
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
                          - Mode de Gestion
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>{context.state.produit.modeGestion}</p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Frais Fixe WakalabilIstithmar
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>
                          {context.state.produit.fraisFixeWakalabilIstithmar}
                        </p>
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
                          - Surperformance WakalabilIstithmar
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>
                          {
                            context.state.produit
                              .surperformanceWakalabilIstithmar
                          }
                        </p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Profit Moudaraba
                        </h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.produit.profitMoudaraba}</p>
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
                          - Mode Calcul de Capital Constitue
                        </h4>
                      </Col>

                      <Col span={4} offset={1}>
                        <p>
                          {context.state.produit.modeCalculCapitalConstitue}
                        </p>
                      </Col>

                      <Col span={7} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Regime Fiscal</h4>
                      </Col>

                      <Col span={3} offset={1}>
                        <p>{context.state.produit.regimeFiscal}</p>
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

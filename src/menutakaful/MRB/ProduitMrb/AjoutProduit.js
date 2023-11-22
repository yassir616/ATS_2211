/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import "./produitMrb.css";
import {
  notification,
  Button,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Modal,
  Popconfirm,
  Checkbox,
  Table,
  InputNumber
} from "antd";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { addProduitMrb } from "./ProduitMRBAPI";
import { getExclusion } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
import { useCallback } from "react";
const { Option , OptGroup } = Select;
let key = 0;
let exclusFamille = "MRB";
class AjoutProduit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      periodicite: [],
      exclusions: [],
      tarifications: [],
      data: [],
      visible: false,
      partenaire: [],
      valueBat :[],
      Exclusionsgenerales:[],
      ExclusionsIncendie :[],
      ExclusionsEaux :[],
      ExclusionsGlaces :[],
      affichageTarif :[]
    };
    this.columns = [
      {
        title: "Nature du bien",
        dataIndex: "natureBien",
        key: "natureBien"
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
      },
      /*{
        title: "Montant EVCAT",
        dataIndex: "montantEvCat",
        key: "montantEvCat"
      },
      {
        title: "Prime Ht",
        dataIndex: "primeHt",
        key: "primeHt"
      },
      {
        title: "Taxe",
        dataIndex: "taxe",
        key: "taxe"
      },
      {
        title: "Taxe Para Fiscale",
        dataIndex: "taxeParaFiscale",
        key: "taxeParaFiscale"
      },
      {
        title: "Prime TTC",
        dataIndex: "primeTtc",
        key: "primeTtc"
      },
      {
      {
        title: "Age min",
        dataIndex: "ageMin",
        key: "ageMin"
      },
      {
        title: "Age max",
        dataIndex: "ageMax",
        key: "ageMax"
      },
      {
        title: "Valeur min",
        dataIndex: "valeurMin",
        key: "valeurMin"
      },
      {
        title: "Valeur max",
        dataIndex: "valeurMax",
        key: "valeurMax"
      },
      {
        title: "Montant de Contribution",
        dataIndex: "tauxContribution",
        key: "tauxContribution"
      },}*/
      {
        title: "Opération",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <Popconfirm
              title="etes-vous sur?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a href="#top">
                <Icon type="delete" theme="twoTone" />
              </a>
            </Popconfirm>
          ) : null
      }
    ];
  }

  handleDelete = keyMrb => {
    const data = [...this.state.data];
    const dt = [...this.state.affichageTarif];
    this.setState({ data: data.filter(item => item.key !== keyMrb) });
    this.setState({ affichageTarif: dt.filter(item => item.key !== keyMrb) });
  };

  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }

  componentDidMount() {
    this.props.form.setFieldsValue({ fraisGestion :30 });
    this.getAllPeriodicite();
    this.getAllExclusion(exclusFamille);
    this.getAllPartenaires();
    let j=50000;
    for(let i=200000;i<=15000000;i=i+j)
    {
      if(i==1000000)
      {
        j=100000;
      }
      if(i==2000000)
      {j=200000;}
      if(i==2200000)
      {
      continue;}
      if(i==5000000)
      {j=5000000;}

      this.state.valueBat.sort((a, b) => a - b);
      this.state.valueBat.push(i);
    }
    this.state.valueBat.push(2500000);
    this.state.valueBat.push(4500000);
    this.state.valueBat.sort((a, b) => a - b);


  }


  async ajouterProduitMrb(values) {
    try {
      let response = await addProduitMrb(values);

      if (response.status === 200) {
        notification.success({
          message: "l'ajout du produit est bien fait"
        });
      }
      this.props.record.history.push("/ProduitMrb");
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }

  async getAllPartenaires() {
    let response = await getAllPartenaire();
    this.setState({
      partenaire: response.data.content
    });
  }
 
  async getAllExclusion(famille) {
    let response = await getExclusion(famille);
    this.setState({
      exclusions: response.data.content
    });
    const filterByRange = (arr, min, max) => {
      return arr.filter(subArr => subArr[0] >= min && subArr[0] <= max);
    };
    const exc=response.data.content.map(element=> [element.id
      ,element.exclusionNom]);
   const Exclusionsgenerales  = filterByRange(exc,12,16);
   const ExclusionsIncendie  = filterByRange(exc,17,20);
   const ExclusionsEaux  = filterByRange(exc,21,26);
   const ExclusionsGlaces  = filterByRange(exc,27,32);
   this.setState({
    Exclusionsgenerales: Exclusionsgenerales,
    ExclusionsIncendie :ExclusionsIncendie,
    ExclusionsEaux :ExclusionsEaux,
    ExclusionsGlaces :ExclusionsGlaces
  });

    
     
    
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {//values.natureBien != "" && values.natureBien != null &&
      if( values.valeurBatiment != null
      && values.primeNet>0)
      {
      let request = {
        key: key,
        natureBien: values.natureBien,
        valeurBatiment: values.valeurBatiment,
        contenu:values.contenu,
        primeNet :values.primeNet,
        /* montantEvCat: values.montantEvCat,
        primeHt:values.primeHt,
        taxe : values.taxe,
        taxeParaFiscale: values.taxeParaFiscale,
        primeTtc: values.primeTtc 
         ageMax: values.ageMax,
        ageMin: values.ageMin,
        valeurMax: values.valeurMax,
        valeurMin: values.valeurMin,
        tauxContribution: values.tauxContribution */
      };
      let req = {
        key: key,
        natureBien: values.natureBien,
        valeurBatiment: currencyFormatter(values.valeurBatiment),
        contenu:currencyFormatter(values.contenu),
        primeNet :currencyFormatter(values.primeNet),

      };
      this.state.affichageTarif.push(req);
      this.state.data.push(request);
      key = key + 1;
      this.setState({ visible: false });
    }
    else{this.setState({ visible: true });}
  });

    
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    this.props.form.setFieldsValue({
      natureBien: "",
      valeurBatiment: "",
      primeNet: "",
      contenu: "",
      valeurMin: "",
      tauxContribution: ""
    });
  };
  handlechangevaleurBatiment = value => {
      let contenu = value / 5 ;
      this.props.form.setFieldsValue({
        contenu : contenu
      });
      
  };

  handleChangePrimeNet = value =>{
    //const values=this.props.form.getFieldsValue();
   /*  const primeNet=value;
    if(value>0)
      {
       let montantEvCat= primeNet*0.08;
       let PrimeHt=primeNet + montantEvCat;
       let taxe =PrimeHt * 0.14;
       let taxeParaFiscale=PrimeHt * 0.01;
       let  PrimeTtc= PrimeHt + taxe + taxeParaFiscale;
        this.props.form.setFieldsValue({
          montantEvCat: montantEvCat,
          primeHt:PrimeHt,
          taxe : taxe,
          taxeParaFiscale: taxeParaFiscale,
          primeTtc: PrimeTtc
        });
      }
      else{
        this.props.form.setFieldsValue({
          montantEvCat: 0,
          primeHt:0,
          taxe : 0,
          taxeParaFiscale: 0,
          primeTtc: 0
        });
      } */
    
  }
/*   handlechangevaleurBatiment = value => {
    let contenu = value / 5 ;
    this.props.form.setFieldsValue({
      contenu : contenu
    });
  
}; */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let exclus = [];
      values.exclusion.forEach(element => {
        exclus.push({ id: element });
      });
      values.exclusion = [...exclus];
      let periodicite = [];
      values.periodicites.forEach(element => {
        periodicite.push({ id: element });
      });
      values.periodicites = [...periodicite];

      let data2 = [];

      for (let index = 0; index < this.state.data.length; index++) {
        let data = {
        natureBienAssure: this.state.data[index].natureBien,
        valeurBatiment: this.state.data[index].valeurBatiment,
        contenu:this.state.data[index].contenu,
        primeNet :this.state.data[index].primeNet,
          /* ageMax: this.state.data[index].ageMax,
          ageMin: this.state.data[index].ageMin,
          valeurMax: this.state.data[index].valeurMax,
          valeurMin: this.state.data[index].valeurMin,
          natureBienAssure: this.state.data[index].natureBien,
          tauxContribution: this.state.data[index].tauxContribution */
        };
        data2.push(data);
      }
      let requestModel = {
        code: values.code,
        libelle: values.libelle,
        natureParticipant: values.natureSouscripteur,
        natureAssure: values.natureAssure,
        assureDiffParticipant: values.assureDiffParticipant,
        natureBienAssure: values.natureBien,
        franchiseIncendie: true,//values.franchiseIncendie,
        franchiseBrisGlace: true,//values.franchiseBrisGlace,
        franchiseDegatEaux: true,//values.franchiseDegatEaux,
        franchiseCatastropheNaturelles: true,//values.franchiseCatastrophesNaturelles,
        tauxTaxe: values.tauxTaxe,
        montantMaximumGarantie: values.montantMaximum,
        fraisGestion: values.fraisGestion,
        tvaFraisGestion: values.tvaFraisGestion,
        delaiPrescription: values.delaiEnAttente,
        delaiPrescriptionSansSouscription: values.delaiSansSouscription,
        exclusionsProduit: values.exclusion,
        periodicitesMrb: values.periodicites,
        partenaireId: values.intermediaire,
        tarificationsMrb: data2
      };

      this.ajouterProduitMrb(requestModel);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <div>
        <ComponentTitle title="Nouveau produit MRB" />
        <Modal
          visible={visible}
          title="Ajout de tarification"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              className="not-rounded"
            >
              Annuler
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              className="not-rounded"
            >
              Ajouter
            </Button>
          ]}
        >
       <Form {...formItemLayout} hideRequiredMark>
            <Col>

              {/* <Form.Item label="Nature du bien ">
                {getFieldDecorator("natureBien", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <Select placeholder="Séléctionnez...">
                    <Option value="Appartement">Appartement</Option>
                    <Option value="Maison">Maison</Option>
                    <Option value="Villa">Villa</Option>
                    <Option value="Bâtiment">Bâtiment</Option>
                  </Select>
                )}
              </Form.Item> */}
              <Form.Item label="Valeur Batiment" required={false}>
                {getFieldDecorator("valeurBatiment", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <Select
                  className="not-rounded"
                  addonAfter="Dhs"
                  placeholder="Valeur Batiment"
                  onChange={this.handlechangevaleurBatiment}
                >
                  {this.state.valueBat.map(element => {
                    return (
                      <Option
                      key={element}
                      value={element}
                      label={element} 
                    >
                      {currencyFormatter(element)}
                    </Option>
                    );
                  })}
                </Select>
                  /*<InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    placeholder="Valeur Batiment"
                    onChange={this.handlechangevaleurBatiment}
                    formatter={currencyFormatter}
                    parser={currencyParser}
                />*/
                )}
              </Form.Item>
              {/* <Form.Item label="Age du bien" required={false}>
                {getFieldDecorator("ageMin", {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <Input
                    addonAfter="Ans"
                    className="not-rounded"
                    placeholder="Min"
                  />
                )}
                {getFieldDecorator("ageMax", {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <Input
                    addonAfter="Ans"
                    className="not-rounded"
                    placeholder="Max"
                  />
                )}
              </Form.Item>*/}
               {/* {getFieldDecorator("valeurMax", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    addonAfter="Dhs"
                    className="not-rounded"
                    placeholder="Max"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}*/}
              
              <Form.Item label="Contenu" required={false}>
                {getFieldDecorator("contenu", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="contenu"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              <Form.Item label="Prime Net" required={false}>
                {getFieldDecorator("primeNet", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    placeholder="Prime Net"
                    onChange={this.handleChangePrimeNet}
                    formatter={currencyFormatter}
                    parser={currencyParser} 
                  />
                )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> MAD </span>
              </Form.Item>
             {/*<Form.Item label="MontantEVCAT" required={false}>
                {getFieldDecorator("montantEvCat", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="Prime Net"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              <Form.Item label="Prime HT" required={false}>
                {getFieldDecorator("primeHt", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="Prime Net"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              <Form.Item label="Taxe" required={false}>
                {getFieldDecorator("taxe", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="Prime Net"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              <Form.Item label="Taxe Para Fiscale" required={false}>
                {getFieldDecorator("taxeParaFiscale", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="Prime Net"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              <Form.Item label="Prime TTC" required={false}>
                {getFieldDecorator("primeTtc", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    //placeholder="Prime Net"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
              
              {/*<Form.Item label="Montant de la contribution" required={false}>
                {getFieldDecorator("tauxContribution", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(
                  <InputNumber
                    className="not-rounded"
                    addonAfter="Dhs"
                    placeholder="Montant de la contribution"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>*/}
            </Col>
          </Form>
        </Modal>
        <div style={{ background: "#ECECEC", padding: "20px" }}>
          <Form id="formadd" {...formItemLayout}>
            <Row gutter={12}>
              <Col span={12}>
                <Card
                  title="Informations Générales"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item label="Libelle">
                    {getFieldDecorator("libelle", {
                      rules: [
                        {
                          required: true,
                          message: "entrez la libelle"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Abréviation">
                    {getFieldDecorator("code", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Intermédiaire">
                    {getFieldDecorator("intermediaire", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select
                        placeholder="Selectionnez ..."
                        onChange={this.handleChange}
                      >
                        {this.state.partenaire.map(element => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.raisonSocial}
                            >
                              {element.raisonSocial}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="Periodicité">
                    {getFieldDecorator("periodicites", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        placeholder="Selectionnez ..."
                        onChange={this.handleChange}
                      >
                        {this.state.periodicite.map(element => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.abb}
                            >
                              {element.libelle}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="Exclusion">
                    {getFieldDecorator("exclusion", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Select style={{ width:'120%' }}
                        dropdownMatchSelectWidth
                        mode="multiple"
                        placeholder="Selectionnez ..."
                        onChange={this.handleChange}
                        
                      >
                           <OptGroup label={<span style={{color :'green',fontWeight: 'bold'}}>Exclusions générales et limites de garantie</span>} >
                           {this.state.Exclusionsgenerales.map(element => {
                          return (
                            <Option
                              key={element[0]}
                              value={element[0]}
                              label={element[1]}
                            >
                              {element[1]}
                            </Option>
                          );
                        })}
                          </OptGroup> 
                          <OptGroup label={<span style={{color :'green',fontWeight: 'bold'}}>Exclusions de la garantie contre l’incendie et les risques annexes</span>} >
                           {this.state.ExclusionsIncendie.map(element => {
                          return (
                            <Option
                              key={element[0]}
                              value={element[0]}
                              label={element[1]}
                            >
                              {element[1]}
                            </Option>
                          );
                        })}
                          </OptGroup> 

                          <OptGroup label={<span style={{color :'green',fontWeight: 'bold'}}>Exclusions de la garantie contre les dommages occasionnés par les eaux</span>} >
                           {this.state.ExclusionsEaux.map(element => {
                          return (
                            <Option
                              key={element[0]}
                              value={element[0]}
                              label={element[1]}
                            >
                              {element[1]}
                            </Option>
                          );
                        })}
                          </OptGroup> 

                          <OptGroup label={<span style={{color :'green',fontWeight: 'bold'}}>Exclusions de la garantie contre les bris de glace</span>} >
                           {this.state.ExclusionsGlaces.map(element => {
                          return (
                            <Option
                              key={element[0]}
                              value={element[0]}
                              label={element[1]}
                            >
                              {element[1]}
                            </Option>
                          );
                        })}
                          </OptGroup> 
                    
                      </Select>
                    )}
                  </Form.Item>
                
                </Card>
                
                <Card
                  title="Franchise"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item>
                    {getFieldDecorator("franchiseIncendie")(<Checkbox checked >Franchise incendie</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseBrisGlace")(<Checkbox checked>Franchise bris de glace</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseDegatEaux")(<Checkbox checked>Franchise dégats des eaux</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("franchiseCatastrophesNaturelles")(<Checkbox checked disabled  style={{ display: 'none' }}>Franchise catastrophes naturelles</Checkbox>)}
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Paramètres globaux"
                  bordered={false}
                  style={{ marginTop: 16 , height :745 }}
                >
                  <Form.Item label="Frais de gestion Wakala">
                    {getFieldDecorator("fraisGestion")(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                        disabled
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <Form.Item label="TVA frais de gestion">
                    {getFieldDecorator("tvaFraisGestion", {
                      rules: [
                        {
                          required: true,
                          message: "entrez le code "
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                        min={0}
                        max={100}
                        maxLength="3"
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <Form.Item label="Montant max de garantie">
                    {getFieldDecorator("montantMaximum", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}>MAD </span>
                  </Form.Item>
                  <Form.Item label="Taux taxe">
                    {getFieldDecorator("tauxTaxe", {
                      rules: [
                        {
                          message: "Champ Obligatoire",
                          required: true
                         
                          
                        }                   
                      ]
                    })(
                      <InputNumber
                      className="not-rounded"
                      //addonAfter="%"
                        formatter={currencyFormatter}
                        parser={currencyParser}
                        min={0}
                        max={100}
                        maxLength="3"
                       
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}> % </span>
                  </Form.Item>
                  <label>
                    <Form.Item label=" Délai de prescription de l’offre EART" />
                  </label>
                  <Form.Item label="En l’attente du retour client">
                    {getFieldDecorator("delaiEnAttente", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        addonAfter="Jours"
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}>Jours </span>
                  </Form.Item>
                  <Form.Item label="Client sans souscription">
                    {getFieldDecorator("delaiSansSouscription", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <InputNumber
                        addonAfter="Jours"
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}<span class="input-group-text" style={{ fontWeight: 'bold' }}>Jours </span>
                  </Form.Item>
                </Card>
                {/*<Card
                  title="Souscripteur/ Assuré"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item>
                    {" "}
                    {getFieldDecorator("assureDiffParticipant", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(
                      <Checkbox defaultChecked={false}>
                        Assuré différent du participant
                      </Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item label="Nature du participant/souscripteur">
                    {getFieldDecorator("natureSouscripteur", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="Nature de l'assuré">
                    {getFieldDecorator("natureAssure", {
                      rules: [
                        { required: true, message: "Champs Obligatoire !" }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  </Card>*/}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card
                  title="Tarification"
                  bordered={false}
                  style={{ marginTop: 16 }}
                >
                  <Table
                    rowClassName="editable-row"
                    columns={this.columns}
                    dataSource={this.state.affichageTarif}
                  />
                  <Button
                    type="primary"
                    className="not-rounded"
                    onClick={this.showModal}
                    style={{ marginTop: 8 }}
                  >
                    <Icon type="plus" />
                    Ajouter
                  </Button>
                </Card>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="not-rounded"
                style={{ width: "25%", marginTop: 40 }}
                onClick={this.handleSubmit}
              >
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AjoutProduit);

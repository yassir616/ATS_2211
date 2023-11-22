import React, { Component } from 'react';
import ComponentTitle from '../../util/Title/ComponentTitle';
import {Col,Typography,Form,Select,DatePicker,Button,Icon,notification,Table} from "antd"
import { getAllPartenaire } from "../Parametrage/partenaire/PartenaireAPI";
import { getCompteBancaire } from './CotisationAPI';
import { getBordereauEncaissement,getAllBordereau ,imprimerBordereau} from './BordereauEncaissementAPI';
import './BordereauEncaissementCss.css';
const { Title } = Typography;
const { Option } = Select;
class BordereauEncaissement extends Component {
    constructor(props) {
        super(props);
    this.state = { 
      partenaires:[],
      compteBancaire:[],
      bordereauxList:[],
      visibleTable:false,
      unableAffichage:true,
      disablingClass : 'disabled'
     } 

    this.columns=[{
        title: "Réference Bordereau",
        dataIndex: "refBordereau",
        key: "refBordereau",
        width: 140,
        render: (text, record) => {
          return(
         <span style={{ color: "#1890ff"}}>
             <a onClick={() => this.handleRecord(record)}>{record.refBordereau}</a>
         </span>)
        },
       },
       {
        title:"Mutuelle",
        dataIndex:"mutuelle",
        key:"mutuelle"
       },
       {
        title: "Point de vente",
        dataIndex: "pointVente",
        key: "pointVente"
       },
       {
        title: "Compte Bancaire",
        dataIndex: "compteBancaire",
        key: "compteBancaire"
       },
       {
        title: "Montant Totale",
        dataIndex: "montantTotal",
        key: "montantTotal"
       },
       {
        title:"Date de Création",
        dataIndex:"creationDate",
        key:"creationDate",
        render: (text, record) => {
          return(
             <p>{this.formatDate(text)}</p>)
       },
       },
       {
        title:"Action",
        dataIndex:"operation",
        width:"10%",
        render: (text, record) => {
          return(
             <span>
              <span
                onClick={() => this.fichierBordereau(record)}
                style={{ cursor: 'pointer', marginRight: '8px'}}
              >
                <Icon type="file-pdf" style={{ color: 'red',fontSize: '24px'  }}/>
              </span>
             </span>)
       },
       }
       
      ]
    }

    sleep(ms) {
      const start = new Date().getTime();
      while (new Date().getTime() < start + ms);
    }

    formatDate(dateString) {
      const originalDate = new Date(dateString);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0');
      const day = String(originalDate.getDate()).padStart(2, '0');
      const hours = String(originalDate.getHours()).padStart(2, '0');
      const minutes = String(originalDate.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    componentDidMount(){
      this.getAllPartenaire()
      this.getCompteBancairee()
      this.getAllBordereaux()
    }

    handleRecord=(record)=>{
      console.log("record",record)
    }

    async getAllBordereaux(){
      console.log("...getting all Bordereaux")
      let response=await getAllBordereau();
        if(response.status==200){
          console.log("bordereaux : ",response.data);
          let list=response.data
          list = list.map(function(obj) {
            obj.mutuelle = "TTT";
            return obj;
        });
          console.log("list : ",list)
          this.setState({ bordereauxList:list  });
          this.sleep(2000)
          this.setState({disablingClass:'notDisabled', unableAffichage:false  });
        }
        else{
            notification.error({
              message: "Takaful",
              description: "Error in getting bordereau Encaissement",
            });
        }
    }


    async getCompteBancairee(){
      console.log("getCompteBancaire...")
      let request=await getCompteBancaire();
      console.log(request)
      if(request.status==200){
        console.log("comptes : ",request.data.content)
        this.setState({ compteBancaire:request.data.content  });
        }
      else{
        notification.error({ message: "Get Comptes Failed" });
      }
        
      }

    async getAllPartenaire() {
      console.log("getting all partenaires");
      let partenaireResponse = await getAllPartenaire();
      if (partenaireResponse.status == 200) {
        console.log("partenaire", partenaireResponse.data.content);
        this.setState({ partenaires: partenaireResponse.data.content });
      } else {
        notification.error({ message: "Get Partenaire Failed" });
      }
    }

    async getBordereauEncaissements(request){
      console.log("Generation Bordereau Encaissement....")
      let response=await getBordereauEncaissement(request);
      if (response.status==200){
        console.log("response : ",response.data)
        if([...response.data].length > 0){
          console.log("response : ",response.data)
        }
        else{
          notification.warning({
            message: "Takaful",
            description: "Pas d'Encaissement dans cette recherche",
          });
        }
        
      }
      else{
        notification.error({
          message: "Takaful",
          description: "Error in generating bordereau Encaissement",
        });
      }
    }

    async fichierBordereau(record){
      console.log('record  : ',record)
      let response = await imprimerBordereau(record);
      if(response.status==200){
        // const file = new Blob([response.data], { type: "application/pdf" });
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL);
        console.log("response Bordeoreaux : ",response)
      }
      else{
        notification.error({
          message: "Takaful",
          description: "Error in fichier bordereau Encaissement",
        });
       }
      }
    
    handleDateChange=(e)=>{
      if(e!=null && e!=undefined && e!=""){
        console.log("dateChanged : ",e.format('YYYY-MM'));
      }
    }

    afficherTable=()=>{
      this.setState({ visibleTable:true  });
    }

    handleSubmit=(e)=>{
      e.preventDefault(); 
      this.props.form.validateFields((err, values) => {
        if(!err){
          let request={}
          request.dateEncaissement=values.dateEncaissement.format('YYYY-MM')
          request.partenaire=values.partenaire.key
          request.compteBancaire=values.compteBancaire.key
          console.log(request)
          this.getBordereauEncaissements(request)
        }
        else{
          notification.warning({
            message: "Takaful",
            description:
              "Veuillez bien remplir les données"
          });
        } 
      })
    }

    render() { 
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 24,
            offset: 4
          }
        }
      };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };
        return (<React.Fragment>
            <ComponentTitle title="Bordereau Encaissement" />
            <Col span={24} offset={1}>
            <Title style={{ marginBottom: "25px" }} level={4} underline={true}>
              Critéres de Recherche :
            </Title>
            <Form
                {...formItemLayout}
                onSubmit={this.handleSubmit}
            >
             <Col span={10}>
                  <Form.Item label="Date Encaissement " hasFeedback >
                    {getFieldDecorator("dateEncaissement", {
                      rules: [
                        {
                          required: true,
                          message: "Veuillez selectionner"
                        }
                      ]
                    })(
                      <DatePicker.MonthPicker
                        placeholder="Veuillez selectionner"
                        onChange={this.handleDateChange}
                        picker="month"
                        disabledDate={this.disabledDate}
                        style={{width:"80%"}}
                        allowClear
                      >
                      </DatePicker.MonthPicker>
                    )}
                  </Form.Item>
                  <Form.Item label="Intermédiaire " hasFeedback>
                    {getFieldDecorator("partenaire", {
                      rules: [
                        {
                          required: true,
                          message: "Veuillez selectionner"
                        }
                      ]
                    })(
                      <Select
                        placeholder="Veuillez selectionner"
                        labelInValue
                        allowClear
                      >
                           {this.state.partenaires.map((element) => {
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
                  </Col>
                  <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Compte Bancaire " hasFeedback>
                    {getFieldDecorator("compteBancaire", {
                      rules: [
                        {
                          required: true,
                          message: "Veuillez selectionner"
                        }
                      ]
                    })(
                      <Select
                        placeholder="Veuillez selectionner"
                        labelInValue
                        allowClear
                      >
                        {this.state.compteBancaire.map((element) => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.code}
                            >
                              {element.code}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      style={{ margin: "10px" }}
                      type="primary"
                      htmlType="submit"
                      className="not-rounded"
                      onClick={this.handleSubmit}
                    >
                      <Icon type="file-add" theme="filled" />
                      Générer bordereau d'encaissement
                    </Button>
                    <Button
                      style={{ margin: "10px" }}
                      className={this.state.disablingClass}
                      type="default"
                      //className="not-rounded"
                      onClick={this.afficherTable}
                      disabled={this.state.unableAffichage}
                    >
                      Afficher les bordereaus d'encaissment
                    </Button>
                  </Form.Item>
                </Col>
            </Form>
            </Col>
           {
            this.state.visibleTable &&
          <Table
            rowClassName="editable-row"
            columns={this.columns}
            size="small"
            bordered
            dataSource={this.state.bordereauxList}
            pagination={{
              pageSize:5
            }}
            style={{marginTop:"300px"}}
          />
            }
            
            
        </React.Fragment>);
    }
}
 
export default Form.create()(BordereauEncaissement);

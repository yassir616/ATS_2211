/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import React, { useState } from "react";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
const { Option } = Select;
const AjoutePrestation = props => {
  const [setReference] = useState("");
  const { montantGlobale,typeFiscal ,montantGIR, montantNet} = props;
 
  const { getFieldDecorator } = props.form;

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
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let helpArray = [];
        props.rows.forEach(element => {
          element.honoraires.forEach(elem => {
            helpArray.push({
              acceptationTestMedical: element,
              montantHonoraire: elem.montantHonoraire
            });
          });
        });
        values.detailPrestationHonoraire = [...helpArray];
        values.auxiliaire = { id: props.auxiliaire };
        props.Ajouter(values);
        console.log("***--------------------------------");
        console.log(values);
      }
    });
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit} hideRequiredMark>
      <Row style={{ marginTop: "20px" }}>
        <Col span={10}>
          <Form.Item label="Ref : " hasFeedback>
            {getFieldDecorator("reference", {
              rules: [
                {
                  required: true,
                  message: "Veuillez saisir"
                }
              ]
            })(<Input></Input>)}
          </Form.Item>

          <Form.Item label="Montant Net">
            {getFieldDecorator("montantNet", {
              initialValue: montantNet,
              rules: [
                {
                  required: false,
                  message: "Veuillez saisir"
                }
              ]
            })(<InputNumber
              addonAfter="DH"
              disabled
              formatter={currencyFormatter}
              parser={currencyParser}
            ></InputNumber>)}
          </Form.Item>

          <Form.Item label="Type Fiscal : ">
            {getFieldDecorator("typeFiscal", {
              initialValue : typeFiscal,
              rules: [
                {
                  message: "Veuillez saisir"
                }
              ]
            })(<Input disabled style={{width : "90px"}}></Input>)}
          </Form.Item>

        
        </Col>

        <Col span={1}></Col>

        <Col span={10}>
          <Form.Item label="Montant">
            {getFieldDecorator("montant", {
              initialValue: montantGlobale,
              rules: [
                {
                  required: true,
                  message: "Veuillez saisir"
                }
              ]
            })(
              <InputNumber
                addonAfter="DH"
                disabled
                formatter={currencyFormatter}
                parser={currencyParser}
              ></InputNumber>
            )}
          </Form.Item>

          <Form.Item label="Montant IR">
            {getFieldDecorator("montantIr", {
              initialValue: montantGIR,
              rules: [
                {
                  required: false,
                  message: "Veuillez saisir"
                }
              ]
            })(<InputNumber
              addonAfter="DH"
              disabled
              formatter={currencyFormatter}
              parser={currencyParser}
            ></InputNumber>)}
          </Form.Item>
          
          
          <Form.Item label="Mode Reglement">
             {getFieldDecorator("modeReglement",{
                rules: [
                  {
                    required: true,
                   
                  }
                ]})
              (<Select placeholder="Choisissez le mode reglement" style={{ width: "50%" }}>
                  <Option value="Virement">Virement</Option>
                  <Option value="Cheque">Chèque</Option>
                </Select>
                )}
          </Form.Item>
          


          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Valider
            </Button>
          </Form.Item>
        </Col>

        
      </Row>
    </Form>
  );
};

const AjoutePrestationHonoraire = Form.create()(AjoutePrestation);

export default AjoutePrestationHonoraire;

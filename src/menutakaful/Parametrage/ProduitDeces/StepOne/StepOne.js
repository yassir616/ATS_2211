import 'antd/dist/antd.css';
import { Button, Checkbox, Col, Divider, Form, Icon, Input, Popconfirm, Row, Select } from 'antd';
import React, { Component } from 'react';
import { getPieceJoint, getTypePrestation } from '../../../../util/APIUtils';
const { Option } = Select;
class StepThree extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      count: 0,
      typePrestation: [],
      pieceJointe: [],
    };
    this.columns = [
      {
        title: 'Type prestation',
        dataIndex: 'typePrestation',
      },
      {
        title: 'Delai déclaration',
        dataIndex: 'delaiDeclaration',
      },
      {
        title: 'Pièces justificatives',
        dataIndex: 'piecesJustificatives',
      },
      {

        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>

              <a><Icon type="delete" style={{ fontSize: '20px', color: 'red' }} /></a>
            </Popconfirm>
          ):"",
      },
    ];
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let array = [];
      for (var index = 0; index < values.names.length; index++) {
        let data = { key: values.keys[index], names: values.names[index], name: values.name[index] }
        array.push(data);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  componentDidMount() {
    this.getAllTypePrestation();
    this.getAllPiece();
  }

  async getAllTypePrestation() {
    let response = await getTypePrestation();
    this.setState({
      typePrestation: response.data.content
    })
  }

  async getAllPiece() {
    let response = await getPieceJoint();
    this.setState({
      pieceJointe: response.data.content
    })
  }

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      typePrestation: <Select
        placeholder="cliquez pour choisir un type"
        optionLabelProp="label"
        placeholder="- Veuillez sélectionner -" style={{ width: '15em', maxwidth: '100%' }}
      >
        {this.state.typePrestation.map(element => {
          return <Option value={element.id} label={element.libelle}>
            {element.libelle}
          </Option>
        })}
      </Select>,
      delaiDeclaration: <Input style={{ width: '15em', maxwidth: '100%' }} />,
      piecesJustificatives: <Select
        mode="multiple"
        style={{ width: '30em', maxwidth: '100%' }}
        placeholder="Select..." >
        {this.state.pieceJointe.map(element => {
          return <Option value={element.id} label={element.libelle}>
            {element.libelle}
          </Option>
        })}
      </Select>,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <div>
        <Form.Item
          {...formItemLayout}
          label="Passengers"
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field."
              }
            ]
          })(
            <Input
              placeholder="passenger name"
              style={{ width: "60%", marginRight: 8 }}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Pass" required={false} key={k}>
          {getFieldDecorator(`name[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                message: "Please input passenger's name or delete this field."
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="cliquez pour choisir un type"
              optionLabelProp="label"
              placeholder="- Veuillez sélectionner -"
              style={{ width: '15em', maxwidth: '100%' }}
            >
              <Option value='1' label="test">Teste</Option>
              <Option value='2' label="test">Teste</Option>
              <Option value='3' label="test">Teste</Option>
            </Select>
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      </div>
    ));

    return (
      <Row>
        <Col span={24}>
          <Form {...formItemLayout} id="stepthree" onSubmit={this.handleSubmit}>
            <Divider orientation="left">Modalités prestations</Divider>
            <Col span={10}>
              <Form.Item label="Calcul CRD">
                <Checkbox ></Checkbox>
              </Form.Item>
              <Form.Item label="Seuil conseil">
                {getFieldDecorator("seuilConseil", {
                  rules: [{
                    required: true, pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                    message: "Format invalide!"
                  }]
                })(<Input addonAfter="Dhs" />)}
              </Form.Item>
              <Form.Item label="Seuil réassurance">
                {getFieldDecorator("seuilReassurance", {
                  rules: [{
                    required: true, pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                    message: "Format invalide!"
                  }]
                })(<Input addonAfter="Dhs" />)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Délai résiliation">
                {getFieldDecorator("delaiResiliation", {
                  rules: [{
                    required: true, pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide!"
                  }]
                })(<Input addonAfter="Mois" />)}
              </Form.Item>
              <Form.Item label="Délai préavis">
                {getFieldDecorator("delaiPreavis", {
                  rules: [{
                    required: true, pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide!"
                  }]
                })(<Input addonAfter="Mois" />)}
              </Form.Item>
              <Form.Item label="Seuil examinateur">
                {getFieldDecorator("seuilExaminateur", {
                  rules: [{
                    required: true, pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                    message: "Format invalide!"
                  }]
                })(<Input addonAfter="Dhs" />)}

              </Form.Item>
            </Col>
            <Divider orientation="left">Type de prestations</Divider>
            <Col span={10}>
              <Button onClick={this.handleAdd} type="primary">
                <Icon type="plus" />Ajouter
              </Button>
            </Col>
            <Col span={16}>
              <Form.Item >
                {getFieldDecorator('typePrestation', {
                  rules: [{ required: false }]
                })    
                       {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                    <Icon type="plus" /> Add field
                  </Button>
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
                   }
              </Form.Item>
            </Col>
          </Form></Col></Row>

    );

  }
}

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {
      typePrestation: Form.createFormField({
        ...props.typePrestation,
        value: props.typePrestation.value,
      }),
      seuilExaminateur: Form.createFormField({
        ...props.seuilExaminateur,
        value: props.seuilExaminateur.value,
      }),
      delaiResiliation: Form.createFormField({
        ...props.delaiResiliation,
        value: props.delaiResiliation.value,
      }),
      delaiPreavis: Form.createFormField({
        ...props.delaiPreavis,
        value: props.delaiPreavis.value,
      }),
      seuilConseil: Form.createFormField({
        ...props.seuilConseil,
        value: props.seuilConseil.value,
      }),
      seuilReassurance: Form.createFormField({
        ...props.seuilReassurance,
        value: props.seuilReassurance.value,
      }),
    };
  }
})(StepThree);

import React, { Component } from 'react';
import { Button, Select, Input, Slider, InputNumber, Row, Col, Table, message, Space, Form } from 'antd';
import ProCard from '@ant-design/pro-card';
import '@ant-design/pro-card/dist/card.css';
import { LoadingDataType, StoreType } from '../../types/propsTypes';
import { AnyIfEmpty, connect } from 'react-redux';


interface DataPreprocessingProps {
  LoadingDataCom:LoadingDataType
}
interface DataPreprocessingState {
  inputValue:number,
  selectButton:String
}
class DataPreprocessing extends Component<DataPreprocessingProps, DataPreprocessingState>{
  public constructor(props: DataPreprocessingProps) {
    super(props)
    this.state = {
      inputValue:45,
      // textData:[],
      // completeArray:[],
      // markTextData:[],
      selectButton:""
    }
  }

  componentDidMount(){
    console.log("DataPreprocessing",this.props.LoadingDataCom.dictionarySelectObject?.selectedRows)
  }

  onChange = (value: any) => {
    this.setState({
      inputValue: value,
    });
  };

  public render(): JSX.Element {
    const {Option} = Select
    const { inputValue } = this.state;
    const { dictionarySelectObject } = this.props.LoadingDataCom

    const dataSource = [
      {
        key: '1',
        name: '同义词字典',
        description: '电力领域同义词词典',
        words: '1000',
        dicts: '100Kb',
      },
      {
        key: '2',
        name: '设备字典',
        description: '发电设备字典',
        words: '800',
        dicts: '80Kb',
      },
    ];

    const columns = [
      {
        title: '字典名称',
        dataIndex: 'dictionaryName',
        key: 'dictionaryName',
      },
      {
        title: '字典描述',
        dataIndex: 'dictionaryDescribe',
        key: 'dictionaryDescribe',
      },
      {
        title: '包含词量',
        dataIndex: 'wordsNum',
        key: 'wordsNum',
      },
      {
        title: '字典容量',
        dataIndex: 'dictsContent',
        key: 'dictsContent',
      },
      {
        title: '操作',
        titleStyle:{
          // fontSize:"20px",
          // textAlign:'center'
        },
        textAlign:"center",
        dataIndex: 'action',
        key: 'action',
        
        render: (number: any,r: any,index: any) => {
          return<Space>
            <a
              onClick={()=>{
                
              }}
            >查看</a>
            <a

            >导出</a>
            <a
              
            >匹配</a>
          </Space>
        }
      },
    ];

    return <div>
      <ProCard
        split="horizontal"
        bordered
        size='small'
      >
        <ProCard
          style={{
            height:"30%"
          }}
        >
          <Form
            wrapperCol={{span: 12, offset: 2}}
            labelCol={{span:12,offset:0}}
            colon={false}
            onFinish={(valueList:any) => {
              console.log("valueList",valueList)
            }}
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  label="向量化方法"
                  wrapperCol={{span:12}}
                  // key={"vectorMethod"}
                  name={"vectorMethod"}
                  // rules={[
                  //   {
                  //     required:true
                  //   }
                  // ]}
                >
                  <Select
                    // defaultValue={"dec2Vec"}
                    
                  >
                    {/* <Select.Option value="dec2Vec">dec2Vec</Select.Option> */}
                    <Option 
                      key="dec2Vec"
                      value={"dec2Vec"}
                    >
                      dec2Vec
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  key={"vectorDimension"}
                  name={"vectorDimension"}
                  label="向量维度"
                >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item

                  // labelCol={{span:0,offset:0}}
                  wrapperCol={{span:0,offset:6}}
                >
                  <Button style={{ marginLeft: '5%', borderRadius: '5px', width: '80px', backgroundColor: 'rgb(0,68,107)', border: 'rgb(0,68,107)', color: 'white' ,display:"none"}}>向量化</Button>
                </Form.Item>
              </Col>
            </Row>
            
            <Row>
              <Col span={8}>
                <Form.Item
                  label="聚类方法"
                  wrapperCol={{span:12}}
                  // key={"clusteringMethod"}
                  name={"clusteringMethod"}
                >
                  <Select
                    // defaultValue=
                    // onChange={(value) => {
                      
                    // }}
                  >
                    <Select.Option value="Kmeans">Kmeans</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  label="聚类类数"
                  key={"clusteringParameters"}
                  name={"clusteringParameters"}
                >
                  <Input></Input>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  // label="向量化方法"
                  wrapperCol={{span:0,offset:6}}
                >
                  <Button 
                    // type='primary'
                    htmlType='submit'
                    style={{ 
                      marginLeft: '5%', 
                      borderRadius: '5px', 
                      width: '80px', 
                      backgroundColor: 'rgb(0,68,107)', 
                      border: 'rgb(0,68,107)', 
                      color: 'white' 
                    }}
                  >聚类</Button>
                </Form.Item>
              </Col>
            </Row>

            
          </Form>
          <Form
            // onFinish={(value:AnyIfEmpty) => {
              
            // }}
          >
            <Row>
              <Col span={12}>
                <Slider
                    min={1}
                    max={100}
                    onChange={this.onChange}
                    
                    value={typeof inputValue === 'number' ? inputValue : 0} 
                    // style={{  float: 'left' }} 
                />
              </Col>
              <Col span={6}>
                <Form.Item
                  wrapperCol={{span: 15, offset: 2}}
                  labelCol={{span:8,offset:12}}
                >
                  <InputNumber
                    min={"1"}
                    max={"100"}
                    style={{ 
                      // margin: '0 48px', 
                      width: '90%', 
                      // marginRight: '0%' 
                    }}
                    value={inputValue + '%'}
                  ></InputNumber>
                </Form.Item>
                
              </Col>
              <Col span={6}>
                <Form.Item 
                  wrapperCol={{span:0,offset:0}}
                >
                <Button style={{ marginLeft: '5%', borderRadius: '5px', width: '80px', backgroundColor: 'rgb(0,68,107)', border: 'rgb(0,68,107)', color: 'white' }}
                  onClick={() => {
                    console.log("button",this.state.inputValue)
                  }}
                >采样</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ProCard>
        <ProCard
          style={{
            // height:"30%"
          }}
        >
          <Table 
                dataSource={dictionarySelectObject?.selectedRows} 
                columns={columns} 
                scroll={{
                  y:`calc(20vh - 70px)`
                  // y:"100px"
                }}
                pagination={{
                  hideOnSinglePage:true
                }}
                 

              />
        </ProCard>
        <ProCard
          tabs={{
            type: 'card',
          }}
        >
          <ProCard.TabPane key="visual" tab="可视化">
            <ProCard 
              split='vertical'
            >
              <ProCard>scatter</ProCard>
              <ProCard>wordCloud</ProCard>
            </ProCard>
          </ProCard.TabPane>
          <ProCard.TabPane key="result" tab="数据结果">
            result
          </ProCard.TabPane>
          <ProCard.TabPane key="after" tab="字典匹配">
            dict
          </ProCard.TabPane>
          
        </ProCard>
      </ProCard>
    </div>
  }
}

const mapStateToProps = (state:StoreType,ownProps?:any) =>{
  const { LoadingDataCom } = state
  return {
    ...ownProps,
    LoadingDataCom:LoadingDataCom
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps,mapDispatchToProps)(DataPreprocessing);
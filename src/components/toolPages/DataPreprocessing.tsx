import React, { Component } from 'react';
import { Button, Select, Input, Slider,InputNumber, Row, Col, Table, message, Space, Form } from 'antd';
import ProCard from '@ant-design/pro-card';
import '@ant-design/pro-card/dist/card.css';
import { LoadingDataType, StoreType } from '../../types/propsTypes';
import { AnyIfEmpty, connect } from 'react-redux';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';
import MyScatterChart from './DataVisual/MyScatterChart';
import MyWordsCloud from './DataVisual/MyWordsCloud';
import { AnyMxRecord } from 'dns';
import ShowMarkTexts from '../ShowView/ShowMarkTexts';

const {Column} = Table


interface DataPreprocessingProps {
  LoadingDataCom:LoadingDataType
}
interface DataPreprocessingState {
  inputValue:number,
  selectButton:String,
  completeArray:Array<number>,
  afterSamplingTextsData:Array<any>,
  afterMatchTextsData:Array<any>,
  isComplete:boolean
}
class DataPreprocessing extends Component<DataPreprocessingProps, DataPreprocessingState>{
  public constructor(props: DataPreprocessingProps) {
    super(props)
    this.state = {
      inputValue:45,
      // textData:[],
      // completeArray:[],
      // markTextData:[],
      selectButton:"",
      completeArray:[],
      afterSamplingTextsData:[],
      afterMatchTextsData:[],
      isComplete:false
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
    const { dictionarySelectObject ,textsSelectObject } = this.props.LoadingDataCom
    // const {} = this.props
    

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
        
        render: (text: any,record: any,index: any) => {
          return<Space>
            <a
              onClick={()=>{
                
              }}
            >查看</a>
            <a

            >导出</a>
            <a
              onClick={() => {
                this.props.LoadingDataCom.textsSelectObject?.selectedRows.map((value,index) => {
                  let postObject = {}
                  postObject = {
                    dictKey:record.key,
                    textsKey:value.key
                  }
                  console.log("postObject",postObject,record)
                  axios.post(`${PATH}/mongo/utils/dbDictSplit`,postObject).then((res:AxiosResponse<any,any>) => {
                    if(res.data.status === 200 ){
                      message.success("字典匹配成功")

                      axios.get(`${PATH}/mongo/xferStations/all`).then((res:AxiosResponse<any,any>) => {
                        if(res.data.status === 200 ){
                          message.success("成功获取")

                          // console.log("xferStation",res.data.data.data)
                          let fileData = res.data.data.data
                                      
                          const after =  fileData.map((value:any, i: string)=>{
                            let returnValue = {
                                text: value['text'],
                                key: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
                                textArr: value['text'].split('').map((v: any, index: any) => ({
                                    text: v,
                                    start: index,
                                    end: index,
                                    label: 'none',
                                    color: '',
                                }))
                            }
                            for(let i = value['labels'].length - 1; i >= 0; i--) {
                                const { start, end, label } = value['labels'][i]
                                // console.log("each",start,end,label)
                                returnValue['textArr'].splice(start, end - start)
                                returnValue['textArr'].splice(start, 0, {
                                    text: value['text'].slice(start, end),
                                    start,
                                    end: end - 1,
                                    label,
                                    color:'#d1c7b7'
                                })
                            }

                            return returnValue
                          })
                          this.setState({
                            afterMatchTextsData:after
                          })

                          axios.post(`${PATH}/mongo/markTexts/upload`,after).then((res:AxiosResponse<any,any>) => {
                            if(res.data.status === 200 ){
                              message.success("上传标注数据成功")
                            }
                          })
                        }
                      })
                    }
                  })
                })
              }}
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
              console.log("valueList",valueList,textsSelectObject)
              const { selectedRows  } = textsSelectObject as {
                selectedRowKeys?: any[] ;
                selectedRows?: any[] ;
              }
               (selectedRows as any[]).forEach((value:any,index:number,array:any[]) => {
                let postObject = {
                  textsKey:value.key,
                  numberOfClusters:valueList.clusteringParameters,
                  sentenceVectorDimension:valueList.vectorDimension
                }
                
                console.log("postObject",postObject)
                axios.post(`${PATH}/mongo/utils/dbSentenceVecScatter`,postObject).then((res:AxiosResponse<any,any>) => {
                  if(res.data.status === 200 ){
                    message.success("dec2vec模型调用成功") 

                    this.setState({
                      isComplete:true
                    })
                    // axios
                  }
                })
              })
              // let postObject = {
              //   "textsKey": textsSelectObject.,
              //   "numberOfClusters": 0,
              //   "sentenceVectorDimension": 0
              // }
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
                    // defaultValue={"dec2Vec"}
                    // labelInValue
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
                  <Input 
                    // defaultValue={10}
                  ></Input>
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
                    // console.log("button",this.state.inputValue,
                    // textsSelectObject?.selectedRows)
                    
                    let allNumber = 0
                    
                    let allTextsKey: any[] = []
                    this.props.LoadingDataCom.textsSelectObject?.selectedRows.map((value,index) => {
                      allTextsKey.push(value.key)
                      allNumber += value.data.length
                    })
                    let frequency = Math.round( this.state.inputValue*0.01*allNumber )
                    console.log(frequency)
                    let temptData: any[] = []
                    let count = 0
                    this.props.LoadingDataCom.textsSelectObject?.selectedRows.map((value,index) => {
                      value.data.map((textObj: any,textIndex: any) => {
                        if(count < frequency){
                          temptData.push(textObj)
                          count ++
                        }
                      })
                    })
                    console.log("tempData",temptData)
                    this.setState({
                      afterSamplingTextsData:temptData
                    })
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
              <ProCard>
                {
                  this.state.isComplete ? <MyScatterChart></MyScatterChart> : null
                }
              </ProCard>
              <ProCard>
                {
                  this.state.isComplete ? <MyWordsCloud></MyWordsCloud> : null
                }
              </ProCard>
            </ProCard>
          </ProCard.TabPane>
          <ProCard.TabPane key="result" tab="数据结果">
              <Table
                size='small'
                id="ant-table"
                dataSource={this.state.afterSamplingTextsData ? this.state.afterSamplingTextsData : []}
                // columns={this.state.columns as ColumnsType<any>}
                rowKey={'key'}
                scroll={{
                  y:`calc(15vh)`
                }}
                
                // pagination={this.state.myPagination}
                style={{ width: '100%' }}
              > 
                <Column
                  title="文本"
                  width={'100%'}
                  align='left'
                  
                  dataIndex={'text'}
                  key="text"
                ></Column>
              </Table>
          </ProCard.TabPane>
          <ProCard.TabPane key="after" tab="字典匹配">
            <ShowMarkTexts
              data={this.state.afterMatchTextsData ? this.state.afterMatchTextsData : []}
            ></ShowMarkTexts>
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
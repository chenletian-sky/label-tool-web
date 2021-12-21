import React, { Component } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Radio, Row, Select, Space, Table } from 'antd'
// import 'antd/dist/antd.css';
// import "./index.css"
import { ColumnsType } from 'antd/lib/table';

// import TrainView from '../../../TrainView';
import ProCard from '@ant-design/pro-card';
import reactCSS from 'reactcss'
import { ChromePicker, SketchPicker } from 'react-color'
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';
import MarkView from './MarkView';
// import MarkView from '../../../MarkView';


interface HandleLabelProps {

}
interface HandleLabelState {
  columns: any,
  pagination: any,
  displayColorPicker:boolean,
  color:any,
  labelData:Array<any>,
  editLabel:String,
  editLabelData:{label:string,hotKey:string}
}
class HandleLabel extends Component<HandleLabelProps, HandleLabelState>{
  public constructor(props: HandleLabelProps) {
    super(props)
    this.state = {
      columns: [
        {
          title: '选择',
          dataIndex: 'select',
          // width: '15%',
          columnWidth: '5px',
          align: 'center',
          render: (text: number) => { return <input name="checkbox" type="checkbox" value="checkbox" style={{ width: "20px", height: '20px' }}></input> }
        },
        {
          title: '标签',
          dataIndex: "name",
          // width: '15%',
          // height: '10%',
          align: 'center',
          render:(text: any,record: any,index: any) =>{
            // console.log("each",record,index)
            const {editLabel} = this.state
            return <div>
              {
                editLabel === record._id ? <Input.TextArea
                  defaultValue={text}
                  autoSize={true}
                  onChange={(value:any) => {
                    let { editLabelData } = this.state
                    this.setState({
                      editLabelData:{
                        ...editLabelData,
                        label:value.target.value
                      }
                    })
                  }}
                ></Input.TextArea> : <div>{text}</div>
              }
              </div>
          }
        }
        ,
        {
          title: '快捷键',
          // render: (text: string) => <p style={{ textAlign: 'center' }} >{text}</p>,
          dataIndex: 'key',
          // height: '10%',
          align: 'center',
          render:(text: any,record: any,index: any) => {
            const { editLabel } = this.state
            return <div>
              {
                editLabel === record._id ? <Input.TextArea
                defaultValue={text}
                autoSize={{ minRows: 1, maxRows: 1 }}
                onChange={(value:any) => {
                  let { editLabelData } = this.state
                  this.setState({
                    editLabelData:{
                      ...editLabelData,
                      hotKey:value.target.value
                    }
                  })
                }}
              ></Input.TextArea> :<div>{text}</div>
              }
            </div>
          }
        }
        ,
        {
          title: '颜色标签',
          dataIndex: "color",
          width: '15%',
          // height: '10%',
          align: 'center',
          render: (color: string,record:any,index:number) => { 
            const { editLabel } = this.state
            return <div>
            {
              <div>
                <div 
                  style={{
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }} 
                >
                <div 
                  style={{
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    backgroundColor:`${color}`
                    // background: `${this.state.color.hex}`,
                  }}
                />
                {/* { this.state.displayColorPicker ? <div 
                          style={{position: 'absolute',
                          // left:"-40px",
                          zIndex: '2'}}
                          >
                          <div 
                            style={{position: 'fixed',
                            top: '0px',
                            right: '0px',
                            bottom: '0px',
                            left: '0px'}} 
                            onClick={ this.handleClose }/>
                          <ChromePicker  color={ this.state.color.rgb } onChange={ this.handleChange } />
                        </div> : null } */}
              </div></div>
              
            }
          </div>
        }
        }
        , {
          title: '操作',
          dataIndex: "operate",
          position: 'center',
          align: 'center',
          render: (text: string,record:any,index: any) => {
            const { editLabel } = this.state
            return (
              <Space>
                <a
                  onClick={() => {
                    // 进入编辑状态(当前状态为保存)
                    if(!editLabel){
                      // console.log("@",this.state.editLabel,record) 
                      this.setState({
                        editLabel:record._id
                      })
                    }else{
                      // 进入保存状态(当前状态为编辑)
                      // console.log("@",this.state.editLabel,record)
                      const { editLabelData } = this.state
                      let updateLabelData = {
                        _id:record._id,
                        name:editLabelData.label ? editLabelData.label : record.name,
                        color:record.color,
                        key:editLabelData.hotKey ? editLabelData.hotKey : record.key
                      }
                      // console.log("@",updateLabelData)
                      axios.post(`${PATH}/mongo/label/update`,updateLabelData).then((res:AxiosResponse<any,any>) => {
                        if(res.data.status === 200 ){
                          message.success("更新标签数据成功")
                          this.setState({
                            editLabel:'',
                            editLabelData:{label:"",hotKey:""}
                          })

                          axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
                            const {data:labelData} = res.data
                            // console.log("res",labelData)
                            this.setState({
                              labelData
                            })
                          })
                        }
                      })
                      
                    }
                    
                  }}
                >{this.state.editLabel === record._id ? '保存' : '编辑'}</a>
                <a
                  onClick={() => {
                    let deleteLabelData = {"_id":record._id}
                    console.log("@",deleteLabelData)
                    axios.delete(`${PATH}/mongo/label/delete`,{data:deleteLabelData}).then((res:AxiosResponse<any,any>) => {
                      if(res.data.status === 200 ){
                        message.success("删除标签数据成功！")

                        axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
                          const {data:labelData} = res.data
                          // console.log("res",labelData)
                          this.setState({
                            labelData
                          })
                        })
                      }
                    })
                  }}
                >删除</a>
              </Space>

            )


          }
        }
      ],
      pagination: {
        total: 10,
        // pageSize: 1,
        showSizeChanger: false,
        // defaultPageSize: 1,
        height: '100px',
      },
      displayColorPicker: false,
      color: {
        hex:"black"
      },
      labelData:[],
      editLabel:'',
      editLabelData:{label:'',hotKey:''}
    }
  }

  componentDidMount(){
    axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
      const {data:labelData} = res.data
      // console.log("res",labelData)
      this.setState({
        labelData
      })
    })

    axios.get(`${PATH}/mongo/markTexts/all`).then((res:AxiosResponse<any,any>) => {
      if(res.data.status === 200 ){
        // this.setS
      }
    })
  }

  componentDidUpdate(){
    
  }

  handleClick = () => {
    // if(!editLabel)
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    // if(!editLabel)
      this.setState({ displayColorPicker: false })
  };

  handleChange = (color: any) => {
    // if(!editLabel)
    this.setState({ color: color })
  };

  public render(): JSX.Element {
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${this.state.color.hex}`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          // left:"-40px",
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    const dataSource: readonly any[] | undefined = [
      // {
      //   'key': 0,
      //   "select": 1,
      //   "flag_name": '设备',
      //   'alias': 'EQU',
      //   "flag_color": "red",
      //   "operate": "编辑删除",
      // }, {
      //   'key': 1,
      //   "select": 0,
      //   "flag_name": '人名',
      //   'alias': 'PER',
      //   "flag_color": "blue",
      //   "operate": "编辑删除",
      // }
    ]
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          // border: "1px solid black",
          // margin:"10px 10px 10px 10px",
          padding: "10px 10px 10px 10px"
        }}
      >

        {/* <span
          style={{
            position: 'relative',
            top: "-20px",
            zIndex: 99,
            backgroundColor: "white"
          }}
        >数据标注配置</span> */}

        <ProCard
          split='horizontal'
          // bordered
          headerBordered
          style={{
            height: "100%",
            width: "100%"
          }}
        >
          <ProCard
          // colSpan="100%"
          >
            <div>
              <div className="YuLiaoPeiZhi-Head"
                style={{
                  // position: "relative",
                  // left: "50px"
                }}
              >
                <Form
                  colon={false}
                  onFinish={(value:any) => {
                    console.log("handleLabel",value,this.state.color)
                    axios.post(`${PATH}/mongo/label/insert`,{name:value.labelName,color:this.state.color.hex,key:value.hotKey}).then((res:AxiosResponse<any,any>) => {
                      if(res.data.status === 200 ){
                        message.success("新增标签成功！")

                        axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
                          const {data:labelData} = res.data
                          // console.log("res",labelData)
                          this.setState({
                            labelData
                          })
                        })
                      }
                    })
                  }}
                  labelCol={{offset:0}}
                  // wrapperCol={{span:16,offset:4}}
                >
                  <Row>
                    <Col 
                      span={6}
                    >
                      <Form.Item
                        label="标签名"
                        name="labelName"
                      >
                        <Input 
                        ></Input>
                      </Form.Item>
                    </Col>
                    <Col span={6}
                      
                    >
                      <Form.Item
                        label="标签颜色"
                        name={"labelColor"}
                        wrapperCol={{span:4,offset:2}}
                      >
                        <div>
                          <div style={ styles.swatch } onClick={ this.handleClick }>
                          <div style={ styles.color } />
                        </div>
                        { this.state.displayColorPicker ? <div 
                          style={ styles.popover as React.CSSProperties | undefined}
                          >
                          <div 
                            style={ 
                            
                            styles.cover as React.CSSProperties | undefined
                            } 
                            onClick={ this.handleClose }/>
                          <ChromePicker  color={ this.state.color.rgb } onChange={ this.handleChange } />
                        </div> : null }
                        </div>
                        
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label={"快捷键"}
                        name={"hotKey"}
                      >
                        <Input value={'test'}></Input>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                      >
                        <Button
                          htmlType='submit'
                          style={{ 
                            marginLeft: '5%', 
                            borderRadius: '5px', 
                            width: '80px', 
                            backgroundColor: 'rgb(0,68,107)', 
                            border: 'rgb(0,68,107)', 
                            color: 'white' 
                          }}
                        >新增</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                {/* <span className="YuLiaoPeiZhi-text">新增标签名</span>
                <input className="YuLiaoPeiZhi-input" type="text" style={{ marginLeft: '20px' }} placeholder="新增标签"></input>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="YuLiaoPeiZhi-text">新增标签颜色</span>
                <select className="YuLiaoPeiZhi-input" defaultValue="lucy" style={{ width: '100px', marginLeft: "20px" }} onChange={function handleChange(value) { console.log(`selected ${value}`); }}>
                  <option value="red">red</option>
                  <option value="skyblue">skyblue</option>
                  <option value="yellow">yellow</option>
                </select>
                <button className="YuLiaoPeiZhi-button" style={{ marginLeft: '20px', backgroundColor: 'rgb(25,121,182)' }}>新增</button> */}
              </div>

              <Table
                size='small'
                id="ant-table"
                style={{
                  // position: "relative",
                  // top: "10px"
                  // left:"24px"
                }}
                // scroll={{y:`calc(10vh)`}}
                columns={this.state.columns as ColumnsType<any>}
                rowKey={'key'}
                dataSource={this.state.labelData as readonly any[] | undefined}
                pagination={{pageSize:1,}}
              />
            </div>
          </ProCard>
          <ProCard
            style={{
              // height:"60%"
              position:"relative",
              top:"-3vh"
            }}
          >
            <MarkView></MarkView>
          </ProCard>
        </ProCard>





      </div>
    )
  }
}
export default HandleLabel;




// function reactCSS(arg0: { default: { color: { width: string; height: string; borderRadius: string; background: string; }; swatch: { padding: string; background: string; borderRadius: string; boxShadow: string; display: string; cursor: string; }; popover: { ...; }; cover: { ...; }; }; }) {
//   throw new Error('Function not implemented.');
// }


{/* <div style={{ color: color, width: '15px', height: '15px', backgroundColor: color, left: '40%', position: 'relative' }}></div> */}
// 

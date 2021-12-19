import Icon, { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal, Space, Spin, TableColumnsType, Tag, Upload } from 'antd';
import Button from 'antd/lib/button';
import TextArea from 'antd/lib/input/TextArea';
import Table, { ColumnsType } from 'antd/lib/table';
import Column from 'antd/lib/table/Column';
import { saveAs } from 'file-saver';
import Qs from 'qs'
import axios from 'axios';
import React, { Component } from 'react'
import { AddIcon, CircleIcon, LabelIcon, SaveIcon } from '../Icon';

import './index.css'

interface Props {
  
}
interface SourceElemType {
    key: string,
    textsName:string,
    textsDescribe:string,
    wordsNum:string,
    textsContent?:string,
    data:Array<{key:number,text?:string,label?:any[],textArr?:Array<any>,_id?:string}>,
    [da:string]:any             //添加特殊键值   避免数据库中的数变化
}

interface stateType {
  dataSource: Array<SourceElemType>,
  newUploadData?:SourceElemType | {},
  selectedRowText?:string,
  showDataKey:number,
  inputNameByShow:string,
  inputVisibleName:string,
  selectedRowKeys:Array<string|number>,
  editType:boolean,
  firstGetState:boolean,
}

export default class TextsTool extends Component<Props, stateType> {
  state : stateType= {
    dataSource :[{
        key: '1',
        textsName: '同义词字典',
        textsDescribe: '电力领域同义词词典',
        wordsNum: '1000',
        textsContent: '100 KB',
        data:[{key:0,text:"语料句子示例",label:[],textArr:[]}]
      }],
    selectedRowText:"",
    newUploadData:{},
    showDataKey:0,
    selectedRowKeys:[],
    inputNameByShow:"1",
    inputVisibleName:"2",
    editType:true,
    firstGetState:false,
  }
  nameInput!: Input ;
  input!: Input;
  changeDictDes!: Input;
  changeTxt!: any;
  changeDictName!: Input;

  componentDidMount(){
    // console.log("开始初始化");
    const {firstGetState} = this.state;
    if(!firstGetState){
    // 实现初始话的时候获取数据库中的语料数据
      axios({
        timeout: 10000,
        method:'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url:"http://101.35.15.228:8080/mongo/texts/all",    //dictName,textsDescribe,wordsNum:String(wordsNum),textsContent,data
      })
        .then((res)=>{
          if (res.data.data.texts.length <=0) {
            return ;
          }else{
            this.setState({dataSource:res.data.data.texts,firstGetState:true},()=>{
            setTimeout(()=>{message.success("成功加载语料数据")},1000)
          })
          }
        })
        .catch((error)=>{
          // console.log(error)
          this.setState({firstGetState:true});
          message.error("请检查服务器是否开启")
        })
      }else{
        message.success("后面的初始化成功");
      }
  }
  
  public render(): JSX.Element{
    const dictColumns = [
      {
        title: '字典名称',
        dataIndex: 'textsName',
        key: 'textsName',
        width:"25%",
        align: 'center',
      },
      {
        title: '字典描述',
        dataIndex: 'textsDescribe',
        key: 'textsDescribe',
        width:"35%",
        align: 'center',
      },
      {
        title: '包含词量',
        dataIndex: 'wordsNum',
        key: 'words',
        width:"15%",
        align: 'center',
      },
      {
        title: '字典容量',
        dataIndex: 'textsContent',
        key: 'dicts',
        width:"15%",
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'functions',
        key: 'functions',
        width:"15%",
        align: 'center',
        render: (elem:any,row:any,index:number) => {
          return <Space  size={1}>
          <Button style={{ color: 'steelblue',margin:"0px",border:"0px"}} onClick={(e)=>{
            Modal.confirm({
              title: "更新字典名字",
              icon: <ExclamationCircleOutlined />,
              content: <>
                      <div style={{marginBottom:"5px"}}>
                        <label>语料名称:</label>&nbsp;<Input ref={a=>this.changeDictName  = a as Input } style={{width:"100px",zIndex:"9999"}} defaultValue={this.state.dataSource[this.state.showDataKey].textsName}></Input>
                      </div>
                      <label>语料描述:</label>&nbsp;<Input ref={a=>this.changeDictDes = a as Input } style={{width:"250px",zIndex:"9999"}} defaultValue={this.state.dataSource[this.state.showDataKey].textsDescribe}></Input>
                      </>,
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
                const { state:{value:textsDescribe} } = this.changeDictDes ;
                // console.log(this.changeDictDes);
                const { state:{value:dictName}} = this.changeDictDes ;
                if(textsDescribe&&dictName){
                  const { dataSource,showDataKey } = this.state;
                  dataSource[showDataKey].textsDescribe = textsDescribe;
                  dataSource[showDataKey].textsName = dictName;
                  this.setState({
                    dataSource
                  },
                  message.success("更新成功")
                )
                }else{
                  message.warning("失败,未输入内容")
                }
              },
              onCancel() {
                message.success("取消更新")
              },
            })
          }} >更新</Button>
          <Button style={{ color: 'steelblue',margin:"0px",border:"0px"}} onClick={(e)=>{
            // console.log(index);
            const {dataSource,showDataKey} = this.state;
            for(let i=0;i<dataSource.length;i++){
              if(row.key as string === dataSource[i].key as string){
                this.setState({
                  showDataKey:i,
                })
                break;
              }
            }
          }} >查看</Button>
          <Button style={{ color: 'steelblue',margin:"0px",border:"0px"}} onClick={(e)=>{
            const textString:string = this.state.dataSource[this.state.showDataKey].data.map((data=>data.text)).join("\r\n")
            saveAs(new Blob([textString], {type: 'text/plain;charset=utf-8'}), `data.txt`);
            message.success("文件导出成功!",1)
          }} >导出</Button>
        </Space>
        },
      },
    ];
    const textsColumns = [
      {
        title: '语料句子',
        dataIndex: 'text',
        key: 'text',
        width:"92%",
      },
    ]
    const {data} = this.state.dataSource[this.state.showDataKey];
    const {showDataKey} = this.state;
    return(
      <div style={{backgroundColor:'white', marginTop:'-0.8rem', marginLeft:'-0.8rem', width:'90rem', height:'40rem'}}>
        <Spin 
          tip="获取数据中"
          spinning={!this.state.firstGetState}
          style={{position:"absolute","top":"300px"}}
        >
        <div id="newDict" style={{
          width: '35rem',
          height: '16rem',
          border: '0.1rem solid gray',
          marginLeft: '2.5rem',
          marginTop: '2rem',
          float: 'left'
        }}>
          <span className="spanCss">新增语料</span>
            <Form
                name="basic"
                wrapperCol={{ span: 8 }}
                autoComplete="off"
                onFinish={(value:any)=> {
                  console.log("dictFinish",value)
                  const { dictName:textsName,textsDescribe } = value ;
                  const fileByRead = value['inputFile']
                  const reader = new FileReader(); 
                  const textsContent = String((value['inputFile'][0].size / 1024).toFixed(2) + " KB") ;
                  // console.log(textsContent);
                  reader.readAsText(fileByRead[0].originFileObj); 
                  //读取文件的内容
                  reader.onload = () => {
                    const { result } = reader;
                    const newData : Array<string> = (result as string).split('\r\n'); 
                    let wordsNum = 0;
                    const newNewData:Array<{key:number,text:string,label:any[],textArr:any[]}> = []
                    const usedTexts:string[] = [];
                    // 实现语料数据的初步去重
                    for(let i =0;i<newData.length;i++){
                      wordsNum += newData[i].length ;
                      if(!usedTexts.includes(newData[i]))
                        newNewData.push({key:newNewData.length,text:newData[i],label:[],textArr:[]});
                        usedTexts.push(newData[i])
                      }
                    console.log(newNewData.length,usedTexts.length);
                    const {dataSource} = this.state;
                    const newUploadData = {key:String(dataSource.length + 1),textsName,textsDescribe,wordsNum:String(wordsNum),textsContent,data:newNewData }
                    this.setState({newUploadData})
                    // this.setState({
                    //   dataSource:[{key:String(dataSource.length + 1),dictName,textsDescribe,wordsNum:String(wordsNum),textsContent,data:newNewData },...dataSource],
                    // })
                  }
                  message.success("数据校验成功")
                }}
                >
            <Form.Item
              label="语料名称"
              name="dictName"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
              wrapperCol={{span:20}}
            >
            <Input type="text" style={{width:'25rem', height:'1.6rem'}}/>
            </Form.Item>
            <Form.Item
              label="语料描述"
              name="textsDescribe"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
              wrapperCol={{span:20}}
            >
            <TextArea autoSize={false} style={{width:'25rem', height:'6rem', resize:'none'}}></TextArea>
            </Form.Item>
          <div style={{width:'35rem', height:'2rem'}}>
            <Form.Item
              // valuePropName="fileList"
              valuePropName="fileList" 
              // 如果没有下面这一句会报错
              getValueFromEvent={(e:any) => {if (Array.isArray(e)) { return e; } return e && e.fileList; }}
              label="导入文件"
              name="inputFile"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
            >
              <Upload
                showUploadList = {false}
                accept='.txt'
                beforeUpload = {(file)=>{
                  const isType = 
                    file.type === 'text/plain'
                    isType ? message.success("上传成功!") : message.error("上传文件只支持txt类型")
                  return isType
                }}
                >
              <Button icon={<UploadOutlined />} style={{zIndex:"999"}} >点击上传文件</Button>
            </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{position:"relative",top:"-55px",left:"65px"}} >
                <Space>
                  <Button type="primary" htmlType="submit" onClick={()=>{
                    // axios({
                    //   timeout: 10000,
                    //   method:'get',
                    //   headers: {
                    //     'Content-Type': 'application/x-www-form-urlencoded'
                    //   },
                    //   url:"http://101.35.15.228:8080/mongo/dictionaries/all",
                    // })
                    // .then((res)=>{console.log(res)
                    // })
                    // .catch((error)=>{console.log(error)})
                    
                  }}>
                    文件校验
                  </Button>
                  <Button type="primary" htmlType="button" onClick={()=>{
                    const {newUploadData,dataSource} = this.state;
                    // console.log(Object.keys(newUploadData as Object).length !== 0);
                    if(Object.keys(newUploadData as Object).length !== 0){
                      const upLoadData = {
                        key:(newUploadData as any).key,
                        textsName:(newUploadData as any).textsName,
                        textsDescribe:(newUploadData as any).textsDescribe,
                        textsContent:(newUploadData as any).textsContent,
                        data:(newUploadData as any).data,
                        wordsNum:(newUploadData as any).wordsNum,
                      }
                      
                      axios({
                      timeout: 10000,
                      method:'post',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      url:"http://101.35.15.228:8080/mongo/texts/upload",    //dictName,textsDescribe,wordsNum:String(wordsNum),textsContent,data
                        data: Qs.stringify(upLoadData), 
                    })
                    .then((res)=>{
                      // console.log(res)
                      this.setState({newUploadData:{}, dataSource:[newUploadData as SourceElemType,...dataSource]},() => {
                        message.success("语料新增成功")
                      })
                    })
                    .catch((error)=>{
                      console.log(error)
                      message.error("数据插入失败")
                    })
                    }
                    else
                      message.warn("上传失败,您还未上传内容或您还未进行文件校验")
                  }}>
                    新增语料
                  </Button>
                </Space>
            </Form.Item>
          </div>
          </Form>
        </div>
        <div id="ManagerDict" style={{
          width: '35rem',
          height: '18rem',
          border: '0.1rem solid none',
          marginLeft: '2.5rem',
          marginTop: '18.5rem',
          float: 'left',
          position: 'absolute'
        }}>
          <Table 
            className="dict-left"
            bordered
            dataSource={this.state.dataSource}
            columns={dictColumns  as ColumnsType<any> }
            style={{ marginLeft:'0rem', marginRight:'4rem', marginTop:'0.05rem', width:'35rem'}}
            pagination={{hideOnSinglePage:true,pageSize:2}} 
            />
        </div>
        <div id="CheckDict" style={{
          width: '42rem',
          height: '36.5rem',
          border: '0.1rem solid gray',
          marginLeft: '38.5rem',
          marginTop: '2rem',
          position: 'absolute'
        }}>
          <span className="spanCss">查看详情</span>

      {/*                                                       右侧页面                                                                            */}
      <Space style={{position: 'relative' , top:"-10px", float:'right' , marginRight:"10px"}}>
          
          <Button type="primary" size='middle' icon={
            <Icon component={4 ? SaveIcon : CircleIcon} />
          } 
          onClick={
            () => {
              const textString:string = data.map(
                (value) => value["text"] 
              ).join('\r\n')
              saveAs(new Blob([textString], {type: 'text/plain;charset=utf-8'}), `data.txt`);
            }
          }>
            导出
          </Button>
          <Button size='middle' type='primary' icon={<Icon component={AddIcon} />} onClick={
            () => {
              Modal.confirm({
                title: "增加文本句子",
                icon: <ExclamationCircleOutlined />,
                content: <>
                        <div style={{marginBottom:"5px"}}>
                          <label>句子:</label>&nbsp;<TextArea ref={a=>this.changeTxt  = a as Input } style={{width:"315px",zIndex:"9999",height:"200px"}} placeholder="请输入您的句子"></TextArea>
                        </div>
                        </>
                ,
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                  const insertData = {key:data.length,text:this.changeTxt.resizableTextArea.props.value,label:[],textArr:[]}
                  data.unshift(insertData)
                  const {dataSource} = this.state; 
                  dataSource[showDataKey].data = data;
                  const editTxt = {
                    key:this.state.dataSource[showDataKey].key,
                    "data":insertData,
                  }
                  axios({
                      timeout: 10000,
                      method:'post',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      url:"http://101.35.15.228:8080/mongo/texts/insert",    //dictName,textsDescribe,wordsNum:String(wordsNum),textsContent,data
                        data: Qs.stringify(editTxt), 
                    })
                    .then((res)=>{
                      this.setState({
                        dataSource:[...dataSource] ,
                      },message.success("成功增加文本"))
                    })
                    .catch((error)=>{
                      console.log(error)
                      message.error("数据插入失败")
                  })
                },
                onCancel() {
                  message.success("取消增加文本")
                },
              })
            }
          } style={{
          }}>
            增加文本
          </Button>

            <Button type="primary" size='middle' 
            style={{
            }} onClick={
              () => {
                const {selectedRowKeys} = this.state;
                // console.log("selectedRowKeys",selectedRowKeys);
                const {dataSource,showDataKey}= this.state;
                const textKey = dataSource[showDataKey].key
                if(selectedRowKeys.length===0){
                  message.warn("未选中数据");
                  return ;
                }
                
                for(let i=0;i<selectedRowKeys.length;i++){
                  const nowData = data.filter(elem=>selectedRowKeys[i] === elem.key)
                  const dataKey = String(nowData[0].key)

                  axios({
                    timeout: 10000,
                    method:'delete',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url:"http://101.35.15.228:8080/mongo/texts/delete",
                    data: Qs.stringify({
                      textKey,
                      dataKey
                    }), 
                    })
                  .then((res)=>{
                    // console.log(res)
                  })
                  .catch((error)=>{
                    console.log(error)
                    message.error("数据插入失败")
                  })
                }
                dataSource[showDataKey].data = data.filter(elem=>!selectedRowKeys.includes(elem.key))
                this.setState({ selectedRowKeys: [] , dataSource },()=>{
                  message.success("成功删除")
                })
              }
            }>
              删除
            </Button>
            <Button type="primary" size='middle' 
            onClick={
              () => {
                const {selectedRowKeys} = this.state;
                if(selectedRowKeys.length === 0)
                  message.warn("未选中数据")
                else if (selectedRowKeys.length > 1)
                  message.warn("一次只能编辑一条数据")
                else{
                  Modal.confirm({
                    title: "修改句子",
                    icon: <ExclamationCircleOutlined />,
                    content: <>
                            <div style={{marginBottom:"5px"}}>
                              <label>句子:</label>&nbsp;<TextArea ref={a=>this.changeTxt  = a as Input } style={{width:"315px",zIndex:"9999",height:"200px"}} defaultValue={this.state.selectedRowText} ></TextArea>
                            </div>
                            </>,
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                      const rowsKey = selectedRowKeys[0]
                      console.log(rowsKey);
                      console.log(this.changeTxt.resizableTextArea.props.value);
                      const {dataSource,showDataKey} = this.state;
                      let id = 0;
                      for(let i=0;i<dataSource[showDataKey].data.length;i++)
                        if(rowsKey === dataSource[showDataKey].data[i].key){
                          id = i;
                          break;
                        }
                      dataSource[showDataKey].data[id].text = this.changeTxt.resizableTextArea.props.value;

                      const textKey = dataSource[showDataKey].key
                      const dataKey  = String(rowsKey)
                      const editTxt = {
                        textKey,
                        dataKey,
                        "data":dataSource[showDataKey].data[id]
                      }
                      // 实现句子的编辑
                      axios({
                            timeout: 10000,
                            method:'post',
                            headers: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            url:"http://101.35.15.228:8080/mongo/texts/update",    //dictName,textsDescribe,wordsNum:String(wordsNum),textsContent,data
                              data: Qs.stringify(editTxt), 
                          })
                          .then((res)=>{
                            // console.log(res)
                            this.setState({dataSource,selectedRowKeys:[]},
                              ()=>{
                              message.success("成功编辑");
                            })
                          })
                          .catch((error)=>{
                            console.log(error)
                            message.error("数据编辑失败")
                      })
                    },
                    onCancel() {
                      message.success("取消编辑")
                    },
                  })

                }
              }
            }>
              编辑
            </Button>

        </Space>
        {/*               右下方的表格设置              */}
        <Table 
          className="texts-table"
          columns={textsColumns as TableColumnsType<any>}
          dataSource={[...data]}
          bordered
          size='middle'
          pagination={{
            hideOnSinglePage:true,
            pageSize:6,
            position: ['bottomRight'],
          }}
          rowSelection={{
						selectedRowKeys:this.state.selectedRowKeys,
						onChange: (selectedRowKeys, selectedRows) => {
              // console.log(selectedRowKeys);
              const selectedLen = selectedRows.length;
              const selectedRowText = selectedLen === 0 ? "" : selectedRows[selectedLen-1].text
							this.setState({ selectedRowKeys,selectedRowText })
						}
					}}
        />
        </div>
        </Spin>
      </div>
    )
  }
}


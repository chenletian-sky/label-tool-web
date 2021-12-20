import React, { ReactElement } from "react";
import { Upload, Button, Form, Table, Pagination,Space,Input, message, Modal, Tag, Spin} from 'antd';
import Icon, { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import XLSX from 'xlsx'
import Qs from 'qs';
import axios, { AxiosResponse } from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import './dictionary.css'
import { ColumnsType } from "antd/lib/table";
import Column from "antd/lib/table/Column";
import { AddIcon, SaveIcon } from "../Icon";

type dataElemType = {
    key: string,
    dictionaryName:string,
    dictionaryDescribe:string,
    wordsNum?:string,
    dictsContent?:string,
    data:Array<{"key":string,"label":string,"name":string,"abbreviations":Array<string|undefined>,_id?:string|number,[aa:string]:any}>,
    [ss:string]:any,     //避免插入数据的key多了而产生报错
}

interface stateType {
  dataSource : Array<dataElemType>,
  newUploadData?:dataElemType | {},
  selectedRowData:{"key":string,"label":string,"name":string,"abbreviations":Array<string>,_id?:string|number,[aa:string]:any} | {},
  showDataKey:number,
  inputNameByShow:string,
  inputVisibleName:string,
  currentPage:number,
  firstGetState:boolean,
  selectedRowKeys:Array<string | number>
}


export default class Dictionary extends React.Component {
  state : stateType= {
    dataSource :[{
        key: '0',
        dictionaryName: '同义词字典',
        dictionaryDescribe: '电力领域同义词词典',
        wordsNum: '1000',
        dictsContent: '100 KB',
        data:[{key:"0",label:"EQU",name:"机组",abbreviations:["组","机组体"]}],
      }],
    newUploadData:{},
    selectedRowData:{},
    showDataKey:0,
    currentPage:1,
    inputNameByShow:"1",
    inputVisibleName:"2",
    firstGetState:false,
    selectedRowKeys:[]
  }
  nameInput!: Input ;
  input!: Input;
  changeDictDes!: Input;
  changeDictName!: Input;
  addDictName!: Input;
  addAbbreviations!: Input;
  addLable!: Input;
  changeName!: Input;
  changeAttribute!: Input;

  componentDidMount(){
    // console.log("开始初始化");
    const {firstGetState} = this.state;
    if(!firstGetState){
    // 实现初始话的时候获取数据库中的语料数据
      axios({
        timeout: 4000,
        method:'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url:"http://101.35.15.228:8080/mongo/dictionaries/all",    
      })
        .then((res)=>{
          console.log(res.data.data.dictionaries);
          // const getData = res.data.data.dictionaries.map((item : dataElemType) =>{
          //   const newData = item.data.map((elem:any) =>{
          //     elem.attributes = [...Array.from(new Set(elem.attributes))]
          //     return elem;
          //   })
          //   item.data = newData;
          //   return item
          // })
          if (res.data.data.dictionaries.length <=0) {
            return ;
          }else{
            this.setState({dataSource:res.data.data.dictionaries,firstGetState:true},()=>{
            setTimeout(()=>{
              // message.success("成功加载字典数据")
            },1000)
          })
          }
        })
        .catch((error)=>{
          console.log(error)
          this.setState({firstGetState:true})
          message.error("请检查服务器是否开启")
        })
      }else{
        message.success("后面的初始化成功");
      }
  }
  
  public render(): JSX.Element{
    const columns = [
      {
        title: '字典名称',
        dataIndex: 'dictionaryName',
        key: 'name',
        width:"25%",
        align: 'center',
      },
      {
        title: '字典描述',
        dataIndex: 'dictionaryDescribe',
        key: 'dictionaryDescribe',
        width:"30%",
        align: 'center',
      },
      {
        title: '包含词量',
        dataIndex: 'wordsNum',
        key: 'words',
        width:"25%",
        align: 'center',
      },
      {
        title: '字典容量',
        dataIndex: 'dictsContent',
        key: 'dicts',
        width:"20%",
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'functions',
        key: 'functions',
        width:"5%",
        align: 'center',
        render: (elem:any,row:any,index:number) => {
          // console.log(elem,rows);
          return <Space  size={5}>

          <a style={{ color: 'steelblue',margin:"0px",border:"0px",width:"50px"}} onClick={(e)=>{
            Modal.confirm({
              title: "更新字典名字",
              icon: <ExclamationCircleOutlined />,
              content: <>
                      <div style={{marginBottom:"5px"}}>
                        <label>字典名称:</label>&nbsp;<Input ref={a=>this.changeDictName  = a as Input } style={{width:"250px",zIndex:"9999"}} defaultValue={row.dictionaryDescribe}></Input>
                      </div>
                      <label>字典描述:</label>&nbsp;<Input ref={a=>this.changeDictDes = a as Input } style={{width:"250px",zIndex:"9999"}}  defaultValue={row.dictionaryName}></Input>
                      </>
              ,
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
                const { state:{value:dictionaryDescribe} } = this.changeDictDes ;
                console.log(this.changeDictDes);
                const { state:{value:dictionaryName}} = this.changeDictName ;
                if(dictionaryDescribe&&dictionaryName){
                  const { dataSource,showDataKey } = this.state;
                  dataSource[showDataKey].dictionaryDescribe = dictionaryDescribe;
                  dataSource[showDataKey].dictionaryName = dictionaryName;

                //   axios({
                //       timeout: 10000,
                //       method:'get',
                //       headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //       },
                //       url:"http://101.35.15.228:8080/mongo/dictionaries/all",
                //       data:Qs.stringify()
                //     })
                //     .then((res)=>{console.log(res)
                //     })
                //     .catch((error)=>{console.log(error)})
                  
                //   this.setState({
                //     dataSource
                //   },
                //   message.success("更新成功")
                // )
                }else{
                  message.warning("失败,未输入内容")
                }
              },
              onCancel() {
                message.success("取消更新")
              },
            })

          }} >更新</a>
          <a style={{ color: 'steelblue',margin:"0px",border:"0px"}} onClick={(e)=>{
            const {dataSource,showDataKey} = this.state;
            for(let i=0;i<dataSource.length;i++){
              if(row.key as string === dataSource[i].key as string){
                this.setState({
                  showDataKey:i,
                  selectedRowKeys:[],
                })
                break;
              }
            }
            
          }} >查看</a>
          <a style={{ color: 'steelblue',margin:"0px",border:"0px"}} onClick={(e)=>{
            const {data} = this.state.dataSource[index];
            // console.log(this.state.dataSource[0].data);
            var filename = "dict.xls";
            const loadData:Array<Array<string>> = data.map((value: { name: string; label: string; abbreviations?: any }) => [
              value['label'], value['name'], ...value['abbreviations']
            ])
            loadData.unshift(['标签', '全称', '别名'])
            var sheetName = "Sheet1";
            var wb = XLSX.utils.book_new(),
              ws = XLSX.utils.aoa_to_sheet(loadData);
            console.log(ws);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, filename);
            message.success("文件导出成功!",1)
          }} >导出</a>
        </Space>
        },
      },
    ];
    const {data} = this.state.dataSource[this.state.showDataKey];
    const {inputNameByShow,inputVisibleName,showDataKey} = this.state;
    const {abbreviations:editAbbreviations,key:editKey,name:editName} = this.state.selectedRowData as {
          [aa: string]: any;
          key: string;
          label: string;
          name: string;
          abbreviations: string[];
        }
    return(
      <div style={{backgroundColor:'white', marginTop:'0.5rem', marginLeft:'0.5rem', width:'90rem', height:'40rem'}}>
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
          <span className="spanCss">新增字典</span>
            <Form
                name="basic"
                wrapperCol={{ span: 8 }}
                autoComplete="off"
                onFinish={(value:any)=> {
                  console.log("dictFinish",value)
                  const { dictionaryName,dictionaryDescribe } = value ;
                  const fileByRead = value['inputFile'][0]
                  const reader = new FileReader(); 
                  const dictsContent = String((fileByRead.size / 1024).toFixed(2) + " KB") ;
                  // console.log(dictsContent);
                  reader.readAsArrayBuffer(fileByRead.originFileObj); //读取文件的内容
                  reader.onload = () => {
                    const { result } = reader;
                    const wb = XLSX.read(result)
                    
                    /* Get first worksheet */
                    const sheetNames = wb.SheetNames[0];
                    const ws = wb.Sheets[sheetNames];
                    const loadData:Array<Array<string>> = XLSX.utils.sheet_to_json(ws, {header:1});

                    let wordsNum : number = 0;
                    const newData = loadData.filter(elem=>elem.length!==0)
                    for(let i = 0;i<newData.length;i++){
                      wordsNum += loadData[i].length - 1 > 0 ? loadData[i].length - 1 : 0;
                      if(newData[i].length <=2)
                        newData[i].push("")
                    }
                    newData.splice(0,1)
                    const data = newData.map((elem : string[],index)=>{
                      return {key:String(index),"label":elem[0],name:elem[1],abbreviations: Array.from(new Set(elem.slice(2,-1)))}
                    })
                    // console.log(data)
                    const {dataSource:preData} = this.state;
                    const key = String(preData.length);
                    const newUploadData = {key,dictionaryName,dictionaryDescribe,wordsNum,dictsContent,data:[...Array.from(new Set(data))]}

                    // 根据需求对数据进行预处理
                    this.setState({newUploadData},message.success("数据校验成功"))
                  }
                }}
                >
            <Form.Item
              label="字典名称"
              name="dictionaryName"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
              wrapperCol={{span:20}}
            >
            <Input type="text" style={{width:'25rem', height:'1.6rem'}}/>
            </Form.Item>
            <Form.Item
              label="字典描述"
              name="dictionaryDescribe"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
              wrapperCol={{span:20}}
            >
            <TextArea autoSize={false} style={{width:'25rem', height:'6rem', resize:'none'}}></TextArea>
            </Form.Item>
          <div style={{width:'35rem', height:'2rem'}}>
            <Form.Item
              label="导入文件"
              valuePropName="fileList" 
              // 如果没有下面这一句会报错
              getValueFromEvent={(e:any) => {if (Array.isArray(e)) { return e; } return e && e.fileList; }}
              name="inputFile"
              rules={[{ required: true }]}
              style={{marginLeft:'2rem'}}
            >
              <Upload
                showUploadList = {false}
                accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                beforeUpload = {(file)=>{
                  const isType = 
                    file.type === 'application/vnd.ms-excel' ||
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    isType ? message.success("上传成功!") : message.error("上传文件只支持xls,xlsx类型")
                  return isType
                }}
                >
              <Button icon={<UploadOutlined />} style={{zIndex:"999"}} >点击上传文件</Button>
            </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{position:"relative",top:"-55px",left:"65px"}} >
                <Space>
                  <Button type="primary" htmlType="submit">
                    文件校验
                  </Button>
                  <Button type="primary" htmlType="button" onClick={()=>{
                    const {dataSource:preData,newUploadData} = this.state;
                    Object.keys(newUploadData as Object).length === 0 ? 
                      message.warn("上传失败,文件未校验或未上传") : 
                      (
                        axios({
                          timeout: 20000,
                          method:'post',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          url:"http://101.35.15.228:8080/mongo/dictionaries/upload",    
                          data: Qs.stringify(newUploadData), 
                        })
                          .then((res)=>{
                            console.log(res);
                            console.log("newUploadData",newUploadData);
                            this.setState({dataSource:[newUploadData,...preData],newUploadData:{}},message.success("字典新增成功"))
                          })
                          .catch((error)=>{
                            console.log(error)
                            message.error("请检查服务器是否开启")
                          })
                      )
                  }}>
                    新增字典
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
            dataSource={[...this.state.dataSource]}
            columns={columns  as ColumnsType<any> }
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

      {/* 右侧页面 */}

      <Space style={{position: 'relative' , top:"-10px", float:'right' , marginRight:"10px"}}>

        <Button
            type="primary"
            size="middle"
            icon={<Icon component={SaveIcon} />}
            onClick={() => {
              const {data} = this.state.dataSource[this.state.showDataKey];
              var filename = "dict.xls";
              const newData:Array<Array<string>> = data.map((value: { name: string; label: string; abbreviations?: any }) => [
                value['label'], value['name'], ...value['abbreviations']
              ])
              newData.unshift(['标签', '全称', '别名'])
              var sheetName = "Sheet1";
              var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.aoa_to_sheet(newData);
              // console.log(ws);
              XLSX.utils.book_append_sheet(wb, ws, sheetName);
              XLSX.writeFile(wb, filename);
              message.success("文件导出成功!",1)
            }}
          >
            导出
          </Button>
          <Button
            size="middle"
            type="primary"
            icon={<Icon component={AddIcon} />}
            onClick={() => {

              Modal.confirm({
                title: "增加字典",
                icon: <ExclamationCircleOutlined />,
                content: <>
                        <div style={{marginBottom:"5px"}}>
                          <label>全称:</label>&nbsp;
                          <Input ref={a=>this.addDictName  = a as Input } style={{width:"315px",zIndex:"9999"}} placeholder="请输新增字典全称"></Input>
                        </div>
                        <div style={{marginBottom:"5px"}}>
                          <label>别名:</label>&nbsp;
                          <Input ref={a=>this.addAbbreviations = a as Input}  placeholder="不同
                          别名间请以'|'分割" style={{width:"315px",zIndex:"9999"}} ></Input>
                        </div>
                        <div style={{marginBottom:"5px"}}>
                          <label>标签:</label>&nbsp;
                          <Input ref={a=>this.addLable  = a as Input } style={{width:"315px",zIndex:"9999"}} placeholder="请输新增字典标签"></Input>
                        </div>
                        </>
                ,
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                  // 实现字典数据的增加
                  const {value:addDictName} = this.addDictName.state;
                  const {value:addAbbreviations} = this.addAbbreviations.state;
                  const {value:addLable} = this.addLable.state;
                  if(addDictName==="" || addAbbreviations==="" || addLable===""){
                    message.warn("数据输入不完整")
                    return ;
                  }
                  const newAbbreviations = addAbbreviations.split('|');
                  console.log(addDictName,newAbbreviations,addLable);
                  let {dataSource:newData,showDataKey} = this.state;
                  // const tempData = newData[showDataKey]["data"];   
                  // for(let i=0;i<tempData.length;i++){
                  //   if(tempData[i].name === addDictName && tempData[i].lable === addLable){
                  //     tempData[i].abbreviations = [...tempData[i].abbreviations,...newAbbreviations];
                  //     this.setState({newData},message.success("成功添加"))
                  //     return ;
                  //   }
                  // }
                  const addData = {key:String(data.length),label: addLable,name: addDictName,abbreviations: newAbbreviations}
                  data.unshift(addData);
                  const insertData = {key:newData[showDataKey].key,"data":addData}

                  axios({
                    timeout: 20000,
                    method:'post',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url:"http://101.35.15.228:8080/mongo/dictionaries/insert",    
                    data:Qs.stringify(insertData), 
                  })
                    .then((res)=>{
                      console.log(res);
                      newData[showDataKey]["data"] = data
                      this.setState({ newData },message.success("成功添加"))
                    })
                    .catch((error)=>{
                      console.log(error)
                      message.error("添加失败")
                  })
                },
                onCancel() {
                  message.success("取消添加")
                },
              })
            }
          }
          >
          增加字典
        </Button>
        <Button
          size="middle"
          type="primary"
          onClick={()=>{
            const {selectedRowKeys,showDataKey} = this.state;
            const selectedRowKeysLen = selectedRowKeys.length;
            if(selectedRowKeysLen===0) {
              message.warn("未选中数据")
              return;
            }else{
              Modal.confirm({
                title: "警告",
                icon: <ExclamationCircleOutlined />,
                content: "请确认是否要删除",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  const findIndex = (newData: any,nowKey: string | number) =>{
                    for(let k=0;k<newData.length;k++){
                      if (newData[k].key === nowKey )
                        return k;
                    }
                  }
                  const {dataSource} = this.state;
                  for(let j=0;j<selectedRowKeysLen;j++){
                    const deleteData = {dictKey:dataSource[showDataKey].key,dataKey:selectedRowKeys[j]}
                    // 删除数据
                    axios({
                      timeout: 20000,
                      method:'delete',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      url:"http://101.35.15.228:8080/mongo/dictionaries/delete",    
                      data:Qs.stringify(deleteData), 
                    })
                      .then((res)=>{
                        const Sp = findIndex(dataSource[showDataKey].data,deleteData.dataKey)
                        data.splice(Sp as number, 1);
                        dataSource[this.state.showDataKey].data = data ;
                        this.setState({ dataSource },message.success("删除成功"))
                      })
                      .catch((error)=>{
                        console.log(error)
                        message.error("删除失败")
                      })
                  }
                },
                onCancel() {
                  message.success("取消删除")
                },
              });
            }
          }}

          >
          删除
        </Button>
        <Button
          size="middle"
          type="primary"
          onClick={()=>{
            const {selectedRowKeys} = this.state;
            if(selectedRowKeys.length === 0)
              message.warning("未选中数据")
            else if(selectedRowKeys.length > 1)
              message.warning("一次只能编辑一条数据")
            else{
              Modal.confirm({
                title: "警告",
                icon: <ExclamationCircleOutlined />,
                content: <>
                          <div style={{marginBottom:"5px"}}>
                        <label>全称:</label>&nbsp;<Input ref={a=>this.changeName  = a as Input } style={{width:"100px",zIndex:"9999"}} defaultValue={editName} placeholder="输入修改全称"></Input>
                          </div>
                          <div style={{marginBottom:"5px"}}>
                        <label>别名:</label>&nbsp;<Input ref={a=>this.changeAttribute = a as Input } style={{width:"250px",zIndex:"9999",marginRight:"5px"}} defaultValue={editAbbreviations.join("、") } placeholder="输入添加别名"></Input>
                          </div>
                        <p>Tips:&nbsp; 别名间用"、"分割</p>
                    </>,
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  const {dataSource} = this.state;
                  const {value:changeName} = this.changeName.state;
                  const {value:changeAttribute} = this.changeAttribute.state;
                  if(changeName){
                    let now_index = 0;
                    for(let j=0;j<dataSource[showDataKey]["data"].length;j++){
                      if(dataSource[showDataKey]["data"][j].key === editKey){
                          now_index = j;
                          break;
                        }
                      }
                    data[now_index]["name"] = changeName;
                    const newAttribute = changeAttribute.split("、")
                    if(!newAttribute[newAttribute.length -1 ])
                    newAttribute.splice(newAttribute.length -1,1)
                    // const Attribute = newAttribute[newAttribute.length -1 ] ? newAttribute : newAttribute.splice(newAttribute.length -1,1)
                    data[now_index]["abbreviations"] = newAttribute
                    dataSource[showDataKey].data = [...data];
                    const deleteTag = {dictKey:dataSource[showDataKey].key,dataKey:editKey,data:data[now_index]}
                    //实现删除标签后字典的更新
                    axios({
                      timeout: 10000,
                      method:'post',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      url:"http://101.35.15.228:8080/mongo/dictionaries/update",
                      data: Qs.stringify(deleteTag), 
                    })
                    .then((res)=>{
                      this.setState({dataSource,selectedRowKeys:[]},message.success("编辑成功"))
                    })
                    .catch((error)=>{
                      console.log(error)
                      message.error("编辑成功失败")
                    })
                    
                  }else{
                    message.warn("未输入内容")
                  }
                },
                onCancel() {
                  message.success("取消编辑")
                },
              });
            }
            }
          }
          >
          编辑
        </Button>
      </Space>
      
           {/* 右侧表格   */}
          
          <Table
          className="dictRight"  
          dataSource={[...data]}
          size="small"
          pagination={{
            pageSize:8,
            hideOnSinglePage:true,
            position: ["bottomRight"],
            showSizeChanger: true,
          }}
          rowSelection={{
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              // console.log(selectedRowKeys);
              const selectedLen = selectedRows.length;
              const selectedRowData = selectedLen === 0 ? {} : selectedRows[selectedLen - 1]
              this.setState({ selectedRowKeys,selectedRowData })
            }
          }}
        >
          <Column
            title="名称"
            dataIndex="name"
            key="name"
            width="15%"
            fixed="left"
            render={(name: string, record: {
              name: string,
              label: string,
              key?: string,
              abbreviations: Array<string>
            }, i: number) => {
              return <div
                      // onMouseEnter={() => {
                      //   this.setState({ inputNameByShow: name }, () => {
                      //     // this.nameInput.focus();
                      //   });
                      // }}
                    >
                      {name}
                    </div>

              // return inputNameByShow !== name ? (
              //   <div
              //     onMouseEnter={() => {
              //       this.setState({ inputNameByShow: name }, () => {
              //         this.nameInput.focus();
              //       });
              //     }}
              //   >
              //     {name}
              //   </div>
              // ) : (
              //   <Input
              //     ref={(input) => {
              //       this.nameInput = input as Input;
              //     }}
              //     type="text"
              //     size="small"
              //     placeholder={name}
              //     defaultValue={name}
              //     style={{ width: 70 }}
              //     onBlur={
              //       // 失去焦点保存
              //       (e) => {
              //         this.setState({ inputNameByShow: "" });
              //         if (!e.target.value) return;
              //         data[i]["name"] = e.target.value;
              //         const {dataSource} = this.state;
              //         const changeDictName = {dictKey:dataSource[showDataKey].key,dataKey:record.key,data:data[i]}

              //         //实现删除标签后字典的更新
              //         axios({
              //           timeout: 10000,
              //           method:'post',
              //           headers: {
              //             'Content-Type': 'application/x-www-form-urlencoded'
              //           },
              //           url:"http://101.35.15.228:8080/mongo/dictionaries/update",
              //           data: Qs.stringify(changeDictName), 
              //         })
              //         .then((res)=>{
              //           // console.log(res)
              //           dataSource[showDataKey].data = [...data]
              //           this.setState({dataSource},message.success("修改成功"))
              //         })
              //         .catch((error)=>{
              //           console.log(error)
              //           message.error("修改失败")
              //         })
              //       }
              //     }
              //     onPressEnter={
              //       // 键盘确定保存
              //       (e) => {
              //         this.setState({ inputNameByShow: "" });
              //         if (!(e.target as any).value) return;
              //         data[i]["name"] = (e.target as any).value;
              //       }
              //     }
              //   />
              // );
            }}
          />
          <Column
            width="75%"
            title="别名"
            dataIndex="abbreviations"
            key="abbreviations"
            render={(
              abbreviations,
              record: {
                name: string;
                label: string;
                key: string;
                abbreviations: Array<string>;
              },
              i: number
            ) => (
              // [...Array.from(new Set(abbreviations as string[]))]
              <>  
                {
                  [...Array.from(new Set(abbreviations as string[]))].map((abbreviation: string,index: number) => (
                  <Tag
                    // closable
                    color="blue"
                    key={index}
                    // onClose={false}
                    // onClose={(e: { preventDefault: () => void; }) => {
                    //   e.preventDefault();
                    //   const newNames: Array<string> = abbreviations.filter(
                    //     (name: string) => name !== abbreviation
                    //   );
                    //   // console.log(record,i,abbreviation);
                    //   const {dataSource}  = this.state ;

                    //   for(let j=0;j<dataSource[showDataKey]["data"].length;j++){
                    //     if(dataSource[showDataKey]["data"][j].key === record.key){
                    //       data[j]["abbreviations"] = [...newNames];
                    //       const deleteTag = {dictKey:dataSource[showDataKey].key,dataKey:record.key,data:data[j]}
                    //       //实现删除标签后字典的更新
                    //       axios({
                    //         timeout: 10000,
                    //         method:'post',
                    //         headers: {
                    //           'Content-Type': 'application/x-www-form-urlencoded'
                    //         },
                    //         url:"http://101.35.15.228:8080/mongo/dictionaries/update",
                    //         data: Qs.stringify(deleteTag), 
                    //       })
                    //       .then((res)=>{
                    //         // console.log(res)
                    //         dataSource[showDataKey].data = [...data]
                    //         this.setState({dataSource},message.success("删除成功"))
                    //       })
                    //       .catch((error)=>{
                    //         console.log(error)
                    //         message.error("删除失败")
                    //       })
                    //       break;
                    //       }
                    //     }
                    // }}
                  >
                    {abbreviation}
                  </Tag>
                ))}
                {/* {"label" + i === inputVisibleName && (
                  <Input
                    ref={(input) => {
                      this.input = input as Input;
                    }}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    onBlur={(e) => {
                      this.setState({ inputVisibleName: "" });
                      if (!e.target.value) return;
                      data[i]["abbreviations"].push(
                        e.target.value
                      );
                      const {dataSource} = this.state;
                      const addTag = {dictKey:dataSource[showDataKey].key,dataKey:record.key,data:data[i]}

                    // 实现增加标签后字典的更新
                      axios({
                        timeout: 10000,
                        method:'post',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        url:"http://101.35.15.228:8080/mongo/dictionaries/update",
                        data: Qs.stringify(addTag), 
                      })
                        .then((res)=>{
                          // console.log(res)
                          dataSource[showDataKey].data = [...data]
                          this.setState({dataSource},message.success("添加成功"))
                        })
                        .catch((error)=>{
                          console.log(error)
                          message.error("添加失败")
                        })
                    }}
                    onPressEnter={(e) => {
                      this.setState({ inputVisibleName: "" });
                      if (!(e.target as any).value) return;
                      data[i]["abbreviations"].push(
                        (e.target as any).value
                      );
                    }
                  }
                  />
                )}
                {"label" + i !== inputVisibleName && (
                  <Tag
                    className="site-tag-plus"
                    onClick={() => {
                      this.setState({ inputVisibleName: "label" + i }, () => {
                        (this.input as any).focus();
                      });
                    }}
                  >
                    <PlusOutlined /> 添加别名
                  </Tag>
                )} */}
              </>
            )}
          />
        </Table>
        </div>
        </Spin>
      </div>
    )
  }
}
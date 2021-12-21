import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Divider, Input, message, PageHeader, PageHeaderProps, Row, Space, Table, TablePaginationConfig, Tag } from 'antd';
import React, { Component } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import ProCard from '@ant-design/pro-card';
import { getTableScroll } from '../utils/getTableScroll';
import { DictionaryDataType, DictionaryDetailDataType, LoadingDataType, StoreType, TextDataType, TextDetailDataType } from '../../types/propsTypes';
import { connect } from 'react-redux';
import { changeLoadingDataDictionarySelectObject, changeLoadingDataTextsSelectObject } from '../../action';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';
import { PlusOutlined } from '@ant-design/icons';
// 文件导出操作 库
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import './LoadingData.css'
// import '../../public/css/defaultTable.less'

interface LoadingDataProps extends LoadingDataType{
  changeLoadingDataDictionarySelectObject:typeof changeLoadingDataDictionarySelectObject,
  changeLoadingDataTextsSelectObject:typeof changeLoadingDataTextsSelectObject
}
interface LoadingDataState {
  path:String,
  contentTitle:String,
  yScroll:String,
  myPagination:Object,
  dictionariesData?:DictionaryDataType,
  dictionaryDetail?:DictionaryDetailDataType,
  textsData?:TextDataType,
  textsDetail?:TextDetailDataType,
  // inputVisibleName:string
}

let testData:Array<any> = []
for(let i=0;i<1000;i++){
  testData.push({
      text:'假装自己是一条语料数据',
  })
}
let dictData:Array<any> = []
for(let i=0;i<1000;i++){
  dictData.push({
    text:"test",
    abbreviations:['abbreviations','abbreviations']
  })
}


class LoadingData extends Component<LoadingDataProps, LoadingDataState>{
  public constructor(props: LoadingDataProps) {
    super(props)
    this.state ={
      path:"dict",
      contentTitle:'加载字典数据',
      // selectedRowKeys:[],
      yScroll:"",
      myPagination:{
        defaultPageSize:4,
        pageSizeOptions: ['4','10', '30', '50', '100'],
        showTotal:(total: any, range: any) => `共${total}条记录`,
        itemRender:(page: number, type: string, element: React.ReactNode)=>{
          return element
        }

      },
      // inputVisibleName: "",
    }
  }

  componentDidMount(){
    let navLink = document.getElementById('loadingData-naviLink')
    navLink?.click()

    axios.get(`${PATH}/mongo/dictionaries/all`).then((res:AxiosResponse<any, any>)=>{
      const { dictionaries } = res.data.data
      this.setState({
        dictionariesData:dictionaries
      })
    })

    axios.get(`${PATH}/mongo/texts/all`).then((res:AxiosResponse<any,any>) => {
      const {texts} = res.data.data
      this.setState({
        textsData:texts
      })
    })

  }

  componentDidUpdate(){
    let navLink = document.getElementById('loadingData-naviLink')
    navLink?.click()
  }

  public render(): JSX.Element {
    const {Column} = Table
    const { changeLoadingDataDictionarySelectObject,changeLoadingDataTextsSelectObject } = this.props
    const { textsSelectObject,dictionarySelectObject } = this.props
    const { dictionariesData,textsData,dictionaryDetail,textsDetail} = this.state
    return (
      
        <ProCard
        tabs={{
          type: 'card',
        }}
      >
        <ProCard.TabPane key="dict" tab="字典">
              <Table
                size='small'
                id="ant-table"
                rowKey={'key'}
                dataSource={dictionariesData}
                sticky = {false}
                pagination={{
                  ...this.state.myPagination,
                  hideOnSinglePage:true,
                  style:{
                    height:"0px"
                  }
                } as TablePaginationConfig }
                style={{ 
                  width: '100%' 
              }}
                rowSelection={{
                  selectedRowKeys:dictionarySelectObject?.selectedRowKeys,
                  onChange: (selectedRowKeys, selectedRows) => {
                    changeLoadingDataDictionarySelectObject({selectedRowKeys,selectedRows})
                  }
                }}
            >
              <Column
                title="字典名称"
                width={'20%'}
                align='center'
                key={'dictionaryName'}
                dataIndex={'dictionaryName'}
              ></Column>
              <Column
                title="字典描述"
                align='center'
                width={'40%'}
                key="dictionaryDescribe"
                dataIndex={'dictionaryDescribe'}
              ></Column>
              <Column
                title="包含词量"
                width={'12%'}
                dataIndex={'wordsNum'}
                key="wordsNum"
              ></Column>
              <Column
                title="字典容量"
                width={'12%'}
                dataIndex={'dictsContent'}
                key={'dictsContent'}
              ></Column>
              <Column
                title="操作"
                width={'20%'}
                dataIndex={'action'}
                align='center'
                render={(text,record:any,index) => {
                  return <Space>
                    <a
                      onClick={()=>{
                        this.setState({
                          dictionaryDetail:record
                        })
                      }}
                    >查看</a>
                    <a
                      onClick={() => {
                        /* original data */
                        var filename = "dict.xls";
                        // const data:Array<Array<string>> = [['标签', '全称', '别名']]
                        const data:Array<Array<string>> = record.data.map((value: { name: string; label: string; key?: string | undefined; abbreviations: string[]; }) => [
                          value['label'], value['name'], ...value['abbreviations']
                        ])
                        data.unshift(['标签', '全称', '别名'])
                        // const data = 
                        var sheetName = "Sheet1";
                        var wb = XLSX.utils.book_new(),
                          ws = XLSX.utils.aoa_to_sheet(data);
                        /* add worksheet to workbook */
                        XLSX.utils.book_append_sheet(wb, ws, sheetName);
                        /* write workbook */
                        XLSX.writeFile(wb, filename);
                      }}
                    >导出</a>
                  </Space>
                }}
              ></Column>
              </Table>
            
              <Divider></Divider>
          
              <Table
                  size='small'
                  id="ant-table"
                  // columns={this.state.columns as ColumnsType<any>}
                  // scroll={{y:this.state.yScroll as string}}
                  rowKey={'key'}
                  dataSource={dictionaryDetail ? (dictionaryDetail as DictionaryDetailDataType).data as Array<any> : []}
                  sticky = {false}
                  pagination={this.state.myPagination}

                  
                  // style={{ width: '100%' }}
              > 
                <Column
                  title="词语"
                  width={'20%'}
                  align='center'
                  key={'name'}
                  dataIndex={'name'}
                ></Column>
                <Column
                  title="同义词表"
                  width={'60%'}
                  align='center'
                  key={"abbreviations"}
                  dataIndex={'abbreviations'}
                  render={(value,record:any,i:number) => {

                    return <>{ record.abbreviations.map((item: string) => (<Tag closable color="blue" >{item}</Tag>))}
{/*                         
                        {"label" + i === this.state.inputVisibleName && ( 
                          <Input
                            ref={(input) => {
                              this.input = input;
                            }}
                            style={{width:'5rem'}}
                            onBlur={(e) => {
                              // console.log(record, i);
                              this.setState({ inputVisibleName: "" });
                              if (!e.target.value) return;
                              record["abbreviations"].push(
                                e.target.value
                              );
                              this.upDataDictionary({dictKey: this.props.detail.key,
                                dataKey: record['key'],
                                data: record});
                            }}
                            onPressEnter={(e) => {
                              this.setState({ inputVisibleName: "" });
                              if (!(e.target as any).value) return;
                              record["abbreviations"].push(
                                (e.target as any).value
                              );
                              this.upDataDictionary({dictKey: this.props.detail.key,
                                dataKey: record['key'],
                                data: record});
                            }}/>
                        )}
                        {"label" + i !== this.state.inputVisibleName && (
                          <Tag
                            className="site-tag-plus"
                            onClick={() => {
                              console.log(this.input)
                              this.setState({ inputVisibleName: "label" + i }, () => {
                                (this.input as any).focus();
                              });
                            }}
                          >
                            <PlusOutlined />添加别名
                          </Tag>
                        )} */}
                      
                      </>
                  }}
                ></Column>
                <Column
                  title="操作"
                  width={'20%'}
                  align='center'
                  dataIndex={'action'}
                  render={(value,record:any,index) => {
                    return <Space>
                    <a
                      onClick={()=>{
                        axios.delete(`${PATH}/mongo/dictionaries/delete`,{
                          "dictKey":this.state.dictionaryDetail?.key,
                          "dataKey":record['key']
                        }as any).then((res:AxiosResponse<any,any>) =>{
                          if(res.data.status === 200 ){
                            message.success("删除成功")
                            this.setState({})
                          }
                        })
                      }}
                    >删除</a>
                    <a>导出</a>
                  </Space>
                  }}
                ></Column>
              </Table>
          
        </ProCard.TabPane>
        <ProCard.TabPane key="texts" tab="语料">
        
              
                <Table
                  size='small'
                  id="ant-table"
                  rowKey={'key'}
                  dataSource={textsData}
                  sticky = {false}
                  pagination={
                    {
                      ...this.state.myPagination,
                      style:{height:"0px"},
                      hideOnSinglePage:true
                    } as TablePaginationConfig
                  }
                  style={{ width: '100%' }}
                  rowSelection={{
                    selectedRowKeys:textsSelectObject?.selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                      changeLoadingDataTextsSelectObject({selectedRowKeys,selectedRows})
                    }
                  }}
              >
                <Column
                  title="语料名称"
                  width={'20%'}
                  align='center'
                  dataIndex={'textsName'}
                  key="textsName"
                ></Column>
                <Column
                  title="语料描述"
                  align='center'
                  width={'40%'}
                  dataIndex={'textsDescribe'}
                  key="textsDescribe"
                ></Column>
                <Column
                  title="包含词量"
                  width={'12%'}
                  dataIndex={'wordsNum'}
                  key="wordsNum"
                ></Column>
                <Column
                  title="语料容量"
                  width={'12%'}
                  dataIndex={'textsContent'}
                  key="textsContent"
                ></Column>
                <Column
                  title="操作"
                  align='center'
                  width={'20%'}
                  dataIndex={'action'}
                  render={(value,record:any,index) => {
                    return <Space>
                      <a
                        onClick={() => {
                          this.setState({
                            textsDetail:record
                          })
                        }}
                      >查看</a>
                      <a
                        onClick={()=>{
                            const textString:string = record.data.map(
                              (value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; }) => value['text']
                            ).join('\r\n')
                            saveAs(new Blob([textString], {type: 'text/plain;charset=utf-8'}), `data.txt`);
                        }}
                      >导出</a>
                    </Space>
                  }}
                ></Column>
                </Table>
              <Divider></Divider>
                <Table
                    size='small'
                    id="ant-table"
                    // columns={this.state.columns as ColumnsType<any>}
                    rowKey={'key'}
                    dataSource={textsDetail ? (textsDetail as TextDetailDataType).data as Array<any> : []}
                    scroll={{
                      
                    }}
                    
                    sticky = {false}
                    pagination={this.state.myPagination}
                    style={{ width: '100%' }}
                > 
                  <Column
                    title="文本"
                    width={'100%'}
                    align='center'
                    dataIndex={'text'}
                    key="text"
                  ></Column>
                  {/* <Column
                    title="操作"
                    width={'20%'}
                    align='center'
                    dataIndex={'action'}
                    
                    render={(text,record,index) => {

                      return <Space>
                      <a
                        onClick={()=>{
                          console.log("@@@",text,record,index)
                        }}
                      >查看</a>
                      <a>导出</a>
                    </Space>
                    }}
                  ></Column> */}
                </Table>
              
        </ProCard.TabPane>
      </ProCard>
        
      
      // <div className="LoadingDict">
      //   <div className="LoadingDict-head">
      //       <Button className="LoadingDict-head-button" onClick={() => { }} style={{ width: "100px", float: "left" }}>语料</Button>
      //       <Button className="LoadingDict-head-button" onClick={() => { }} style={{ width: "100px", float: "left", marginLeft: "10px" }}>字典</Button>
      //   </div>

      //   <div className="LoadingDict-table">
            // <Table
            //     size='small'
            //     id="ant-table"
            //     // columns={this.state.columns as ColumnsType<any>}
            //     rowKey={'key'}
            //     // dataSource={dataSource}
            //     pagination={false}
            //     style={{ width: '100%' }}
            // />
      //       <div className="LoadingDict-data" style={{ float: 'right', marginTop: "5px", height: "6%" }}>
      //           <Button className="LoadingDict-data-button" onClick={() => { }} style={{ width: "100px", float: "left" }}>加载数据</Button>
      //           <Button className="LoadingDict-data-button" onClick={() => { }} style={{ width: "100px", float: "left", marginLeft: "10px" }}>导出数据</Button>
      //       </div>
      //       <div className="LoadingDict-show-data" style={{ height: '65%' }}>
      //           {/* <DictionaryView></DictionaryView> */}
      //       </div>
      //   </div>

      // </div>
    )
  }
}

const mapStateToProps = (state:StoreType,ownProps?:any) => {
  const { LoadingDataCom } = state
  return {
    ...ownProps,
    ...LoadingDataCom
  }
}

const mapDispatchToProps = {
  changeLoadingDataTextsSelectObject,
  changeLoadingDataDictionarySelectObject
}


export default connect(mapStateToProps,mapDispatchToProps)(LoadingData);




{/* <PageContainer
        // content={`${this.state.contentTitle}`}
        // header={{
        //   // title:<div style={{display:"none"}}></div>
        // }}
        onTabChange={(value) => {
          console.log("@",value)
          this.setState({
            path:`${value}`
          })
        }}
        tabList={[
          {
            tab: '字典',
            key: 'dict',
          },
          {
            tab: '语料',
            key: 'texts',
          },
        ]}
      ></PageContainer> */}

  
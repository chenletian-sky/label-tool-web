import React, {Component} from 'react';
//antd组件库
import {Button, Table, Form, Input, Slider, Dropdown, Menu, message, Tag} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import '../current/current'
import TrainMarkView from './TrainMarkView'
import { LoadingDataType, StoreType } from '../../types/propsTypes';
import { connect } from 'react-redux';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';
import { error } from 'console';

interface WordRecognitionProps {
  LoadingDataCom:LoadingDataType
}
interface WordRecognitionState {
  SliderVal: number
  texts: Array<any>
  MarkTexts: Array<any>
  labels: Array<any>
}
class WordRecognition extends Component<WordRecognitionProps, WordRecognitionState>{
  public constructor(props: WordRecognitionProps) {
    super(props)
    this.state={
      SliderVal: 30,
      texts: [],
      MarkTexts: [],
      labels: []
    }
  }

  public componentDidMount() {
    const AllTextsData = (this.props.LoadingDataCom.textsSelectObject as any).selectedRows
    let {texts} = this.state
    // console.log(AllTextsData)
    for(let i = 0; i < AllTextsData.length; i++) {
      // console.log(AllTextsData[i])
      for(let j = 0; j < AllTextsData[i].data.length; j++) {
        if(AllTextsData[i].data[j].key !== '-100') {
          texts.push(AllTextsData[i].data[j])
        }
      }
    }
    axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
      if(res.data.status === 200){
        const {data:labels} = res.data
        this.setState({
          texts,
          labels
        })
      }
    })
    // this.setState({texts: texts})
  }
  
  public render(): JSX.Element{
    const menu = (
      <Menu>
        <Menu.Item key="1">
          BiLSTM
        </Menu.Item>
      </Menu>
    );
    // console.log(this.state.MarkTexts)
    return(
      <div>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
        >
          <Form.Item
            label="模型名称"
            name="name"
            rules={[{ required: true}]}
            style={{
              marginTop:'1rem'
            }}
          >
            <Dropdown overlay={menu}>
              <Button style={{
                marginLeft: '-16.5rem'
              }}>
                BiLSTM<DownOutlined />
              </Button>
            </Dropdown>
          </Form.Item>
          {/* <Form.Item
            label="权重路径"
            name="path"
            rules={[{ required: true}]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="语料数据"
            name="texts"
            rules={[{ required: true}]}
          >
            <Slider key='Slider' defaultValue={30} 
              onChange = 
              {
                (value:any) => {
                  this.setState({
                    SliderVal:value
                  })
                }
              }/>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '16.5rem'
              }}
              onClick={
                ()=>{
                  let MarkTexts = []
                  for(let i = 1; i <= (this.state.texts.length * this.state.SliderVal/100); i++){
                    const RandomVal = Math.floor(Math.random()*(this.state.texts.length))
                    
                    MarkTexts.push(this.state.texts[RandomVal])
                  }
                  // console.log("this.state.texts",this.state.texts)
                  // console.log("MarkTexts",MarkTexts)
                  this.setState({MarkTexts: [...MarkTexts]})
                  // console.log(this.state.MarkTexts)
                }
              }>采样</Button>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '21.5rem'
              }}
              onClick={
                () => {     
                  console.log("1")
                  // console.log(this.props.LoadingDataCom)
                  const upLoadData = {
                      key:-200,
                      textsName:'RecognitionTexts',
                      textsDescribe:'test',
                      textsContent:'100kb',
                      data:this.state.MarkTexts,
                      wordsNum:1000,
                    }
                  axios.post(`http://101.35.15.228:8080/mongo/texts/upload`, upLoadData)
                    .then((zeroRes:AxiosResponse<any, any>) => {
                     // console.log(`${PATH}/mongo/utils/dbDictSplit`);
                      if(zeroRes.data.status === 200){
                        console.log("dbDictSplit",this.props.LoadingDataCom.dictionarySelectObject?.selectedRows[0].key)
                        axios.post(`${PATH}/mongo/utils/dbDictSplit`, {dictKey:this.props.LoadingDataCom.dictionarySelectObject?.selectedRows[0].key,textsKey:"-200"})
                          .then((firstRes:AxiosResponse<any, any>) => {
                            if(firstRes.data.status === 200){
                              message.success("字典分词调用成功")
      
                              axios.post(`${PATH}/mongo/utils/jiaguTrainModel`, {textsKey:"-200",numberOfTrainingIterations:-1})
                                .then((secondRes:AxiosResponse<any, any>) => {
                                  if(secondRes.data.status === 200 ){
                                    message.success("jiagu 调用成功")
                                    axios.get(`${PATH}/mongo/xferStations/all`)
                                      .then((res:AxiosResponse<any, any>) => {
                                        if(res.data.status === 200 ){
                                          // console.log(res.data.data.data.now)
                                          const fileData = res.data.data.data.now
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
                                                let color = 'red'
                                                console.log(this.state.labels)
                                                for(let j = 0; j < this.state.labels.length; j++) {
                                                  if (this.state.labels[j].name === label) {
                                                    color = this.state.labels[j].color
                                                    break
                                                  }
                                                }
                                                returnValue['textArr'].splice(start, end - start)
                                                returnValue['textArr'].splice(start, 0, {
                                                    text: value['text'].slice(start, end),
                                                    start,
                                                    end: end - 1,
                                                    label,
                                                    color: color
                                                })
                                            }
      
                                            return returnValue
                                          })
                                          this.setState({MarkTexts: after})
                                        }
                                        
                                    })
                                  }
                                  
                              })
                            }
                        })
                      }
                  })
                  .catch((error)=>{
                    console.log(error);
                  })
                }
              }
            >识别</Button>
          </Form.Item>
        </Form>
        <div style={{marginLeft:'-25rem', marginBottom:'0.5rem'}}>
          { 
            this.state.labels.map((text, index) => (
              <Tag color={text.color}>{text.name + ' [' + text.key + ']'}</Tag>
            ))
          }
        </div>
        
        <TrainMarkView 
          MarkTexts={this.state.MarkTexts}
        ></TrainMarkView>
      </div>
    )
  }
}

// export default TrainMarkView;

const mapStateToProps = (state:StoreType,ownProps?:any) =>{
  const { LoadingDataCom } = state
  return {
    ...ownProps,
    LoadingDataCom:LoadingDataCom
  }
}

export default connect(mapStateToProps,null)(WordRecognition);
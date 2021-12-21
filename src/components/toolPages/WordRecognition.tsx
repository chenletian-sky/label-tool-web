import React, {Component} from 'react';
//antd组件库
import {Button, Table, Form, Input, Slider, Dropdown, Menu} from 'antd';
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
}
class WordRecognition extends Component<WordRecognitionProps, WordRecognitionState>{
  public constructor(props: WordRecognitionProps) {
    super(props)
    this.state={
      SliderVal: 30,
      texts: [],
      MarkTexts: []
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
    this.setState({texts: texts})
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
                    SliderVal:value.target.value
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
                  let {MarkTexts} = this.state
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
                  // axios.post(`http://101.35.15.228:8080/mongo/texts/upload`, upLoadData)
                  //   .then((res:AxiosResponse<any, any>) => {
                  // })
                  console.log(`${PATH}/mongo/utils/dbDictSplit`);
                  
                  
                  
                  axios.post(`${PATH}/mongo/utils/dbDictSplit`, {dictKey:this.props.LoadingDataCom.selectedRowKeys[0],textsKey:"-200"})
                    .then((res:AxiosResponse<any, any>) => {
                      if(res.data.status === 200)
                      console.log("2")
                      console.log("2")
                  })
                  .catch((error)=>{
                    console.log(error);
                  })
                  axios.post(`${PATH}/mongo/utils/jiaguTrainModel`, {textsKey:"-200",numberOfTrainingIterations:-1})
                    .then((res:AxiosResponse<any, any>) => {
                      console.log("3")
                  })
                  axios.get(`${PATH}/mongo/xferStations/all`)
                    .then((res:AxiosResponse<any, any>) => {
                      console.log(res.data.data.data.now)
                      this.setState({MarkTexts: res.data.data.data.now})
                  })
                  console.log(this.state.MarkTexts,"8888")
                  // this.setState({MarkTexts:})
                }
              }
            >识别</Button>
          </Form.Item>
        </Form>
        <TrainMarkView MarkTexts={[...this.state.MarkTexts]}></TrainMarkView>
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
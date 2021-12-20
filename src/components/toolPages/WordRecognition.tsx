import React, {Component} from 'react';
//antd组件库
import {Button, Table, Form, Input, Slider, Dropdown, Menu} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import '../current/current'
import TrainMarkView from './TrainMarkView'
import { LoadingDataType, StoreType } from '../../types/propsTypes';
import { connect } from 'react-redux';

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
    const AllTextsData = this.props.LoadingDataCom.textsSelectObject.selectedRows
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
                (value) => {
                  this.state.SliderVal = value
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
                  this.setState({MarkTexts: MarkTexts})
                  // console.log(this.state.MarkTexts)
                }
              }>采样</Button>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '21.5rem'
              }}>识别</Button>
          </Form.Item>
        </Form>
        <TrainMarkView MarkTexts={this.state.MarkTexts}></TrainMarkView>
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
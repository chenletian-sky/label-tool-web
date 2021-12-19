import React, {Component} from 'react';
//antd组件库
import {Button, Table, Form, Input, Slider} from 'antd';
import '../current/current'
import MarkView from './MarkView'

interface ModelTrainProps {

}
interface ModelTrainState {

}
class ModelTrain extends Component<ModelTrainProps, ModelTrainState>{
  public constructor(props: ModelTrainProps) {
    super(props)
  }
  
  public render(): JSX.Element{
    return(
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Form.Item
            label="模型"
            name="module"
            rules={[{ required: true}]}
            style={{width: '25rem', marginTop: '1rem', marginLeft: '-4.1rem'}}
          >
            <Input />
            <Button
              type="primary"
              style={{position: 'absolute', marginLeft:'1rem'}}>训练</Button>
          </Form.Item>
          <span style={{position:'absolute', marginTop:'0.3rem', marginLeft:'-20.8rem'}}>模型参数</span>
          <Form.Item
            label="迭代次数"
            name="time"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '1.8rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="权重保存路径"
            name="path"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '1.8rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="输入维度"
            name="input"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '4rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="网络层数"
            name="web"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '4rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="隐含层维度"
            name="implication"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '6.2rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="输出维度"
            name="output"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '6.2rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
        </Form>
        <div style={{marginTop:'10rem'}}>
          
        </div>
      
      </div>
    )
  }
}
export default ModelTrain;
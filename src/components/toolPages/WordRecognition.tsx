import React, {Component} from 'react';
//antd组件库
import {Button, Table, Form, Input, Slider} from 'antd';
import '../current/current'
import MarkView from './MarkView'

interface WordRecognitionProps {

}
interface WordRecognitionState {

}
class WordRecognition extends Component<WordRecognitionProps, WordRecognitionState>{
  public constructor(props: WordRecognitionProps) {
    super(props)
  }
  
  public render(): JSX.Element{
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
            <Input />
          </Form.Item>
          <Form.Item
            label="权重路径"
            name="path"
            rules={[{ required: true}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="语料数据"
            name="texts"
            rules={[{ required: true}]}
          >
            <Slider defaultValue={30} />
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '12rem'
              }}>采样</Button>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '16.5rem'
              }}>识别</Button>
            <Button
              type="primary"
              style={{
                position: 'absolute',
                marginTop: '-2rem',
                marginLeft: '21rem'
              }}>导出</Button>
          </Form.Item>
        </Form>
        <MarkView></MarkView>
      </div>
    )
  }
}
export default WordRecognition;
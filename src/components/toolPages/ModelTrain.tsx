import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';  //下载
import * as echarts from 'echarts';
import Qs from 'qs'
//antd组件库
import {Button, Table, Form, Input, Slider,Space, message} from 'antd';
import '../current/current'
import MarkView from './MarkView'
import axios from 'axios';
type EChartsOptions = echarts.EChartsOption;    //版本太高会报错

interface ModelTrainProps {

}
interface ModelTrainState {
  currentRate:Array<number>,
  historyRate:Array<number>,
  iterNum:number,
}

class ModelTrain extends Component<ModelTrainProps, ModelTrainState>{
  state = {
    currentRate:[],
    historyRate:[],
    iterNum:2,

  }
  inputIterNum!: Input | null;
  
  public constructor(props: ModelTrainProps) {
    super(props)
  }
  getOption = (k:number)=>{
    const { currentRate,historyRate } = this.state;
    let xSeries = []
    let min_data = 85;
    if(k===1){
      for(let i=0;i<currentRate.length;i++){
        min_data = currentRate[i]<min_data ? currentRate[i] - 5 : min_data;
        xSeries.push(i+1)
      }
    }else if(k===2){
      for(let i=0;i<historyRate.length;i++){
        min_data = historyRate[i]<min_data ? historyRate[i] - 5 : min_data;
        xSeries.push(i+1)
      }
    }
    
    const option: EChartsOptions = {
        title: {
            text: '准确率',
            textStyle: {
                fontSize: 15,
            }
            },
        tooltip: {
            trigger: "axis",
        },
        legend: {
          data:['按照顺序取','随机取',"分类后随机取"],
          selected:{'原模型':true,'改进的模型':true,}
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          name: k===2 ? "训练序号":"迭代次数",
          nameLocation:"center",
          nameGap:22,
          data: xSeries,
        },
        yAxis: {
          type: 'value',
          name:"准确率/%",
          min:min_data,
          max:100,
          splitNumber: 15,
          axisLine: {
              show: true,
          }
        },
        series: [
          {
            name: k === 1 ? "自迭代曲线" : "历史曲线",
            data: k === 1 ? currentRate : historyRate,
            type: 'line',
            stack: 'Total',
            smooth: 0.5,
          },
        ]
    }
    return option;
  }
  handelTrain = ()=>{
    const {state:{value:inputIterNum}} = this.inputIterNum as Input 
    console.log(inputIterNum);
    if((inputIterNum ?? "") === ""){
      message.warning("未输入迭代次数")
      return ;
    }
    const sendInfor = {textsKey:"32232",numberOfTrainingIterations:Number(inputIterNum)}
    axios({
      timeout: 400000,
      method:'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url:"http://101.35.15.228:8080/mongo/utils/jiaguTrainModel",    
      data: Qs.stringify(sendInfor)
    })
      .then((res)=>{
        const {data} = res.data;
        const currentRate = (data[0] as string).split("\r\n").map((item:string) =>{
          return Number(item);
        } )
        console.log(currentRate);
        currentRate.pop()
        const {historyRate}  =this.state ;
        this.setState({currentRate:[...currentRate],historyRate:[...historyRate,currentRate[currentRate.length -1 ]]})
      message.success("训练成功")
    })
      .catch((error)=>{
      message.error("请检查服务器是否开启")
    })
  }
  
  public render(): JSX.Element{
    return(
      <div style={{height:"100%",width:"100%",position:"absolute"}}>
        <div style={{height:"35%"}}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          style={{marginTop:"1rem"}}
        >
          <Form.Item
            label="模型"
            name="module"
            rules={[{ required: true}]}
            style={{width: '25rem', marginLeft: '-4.1rem'}}
          >
            {/*  */}
            <Input value="LSTM + AveragePerceptron"  />  
            <Button
              type="primary"
              onClick={this.handelTrain}
              style={{position: 'absolute', marginLeft:'1rem'}}>训练</Button>
          </Form.Item>
          <span style={{position:'absolute', marginTop:'0.3rem', marginLeft:'-20.8rem'}}>模型参数</span>
          <Form.Item
            label="迭代次数"
            name="time"
            rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '1.8rem', position: 'absolute'}}
          >
            <Input ref={a=>this.inputIterNum =  a} onKeyUp={(e)=>{
              const tranValue = (e.target as any).value;
              // console.log(tranValue)
              (e.target as any).value = tranValue.replace(/^[^0-9]|[^\d]+/g,'')
            }}  />
          </Form.Item>
          <Form.Item
            label="权重保存路径"
            name="path"
            // rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '1.8rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="输入维度"
            name="input"
            // rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '4rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="网络层数"
            name="web"
            // rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '4rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="隐含层维度"
            name="implication"
            // rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '1rem', marginTop: '6.2rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="输出维度"
            name="output"
            // rules={[{ required: true}]}
            style={{width:'20rem', marginLeft: '26rem', marginTop: '6.2rem', position: 'absolute'}}
          >
            <Input />
          </Form.Item>
        </Form>
        </div>
        {/* <div style={{marginTop:'10rem'}}>
        </div> */}
        <div style={{ height:"65%",width:"100%"}}>
          <ReactEcharts option={this.getOption(1)} theme="" notMerge={true} lazyUpdate={true} style={{ height: "100%",width:"49%",float:"left"}} />
          <ReactEcharts option={this.getOption(2)} theme="" notMerge={true} lazyUpdate={true} style={{ height: "100%",width:"49%",float:"right",}} />
        </div>
        
      </div>
    )
  }
}
export default ModelTrain;
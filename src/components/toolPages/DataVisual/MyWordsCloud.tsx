import React, { Component } from 'react';
import {WordCloudImage} from '../../../types/propsTypes'
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../../types/actionTypes';
import { message } from 'antd';

// 需要全局声明方便后面的删除 
var myCharts:any
interface WordCloudDataType{
  [classId:string]:Array<{
      name:string,
      value:number
  }>
}   

interface MyWordsCloudProps {

}
interface MyWordsCloudState {
  WordsCloudData:WordCloudDataType,
  classId:String

}
class MyWordsCloud extends Component<MyWordsCloudProps, MyWordsCloudState>{
  public constructor(props: MyWordsCloudProps) {
    super(props)
    this.state = {
      classId: "0",   //用于调节绘制哪个类的词云图
      WordsCloudData:{}
    }
  }

  createWordCloud = ()=>{
      const {WordsCloudData} = this.state
      myCharts = echarts.init(document.querySelector(".WordsCloud") as HTMLDivElement);
      let {classId} = this.state;
      // jsonList 用于绘制对应类词云图的数据
      var jsonList:Array<{
          name: string;
          value: Number;
      }> = WordsCloudData[classId as string];

      var maskResource = new Image()
      maskResource.src = WordCloudImage;
      var option ={
          //设置标题，居中显示
          title:{
              text: "第" + classId + "类的情况",
              left:'center',
              fill: "red",
          },
          //数据可以点击
          tooltip:{
          },
          series:[
              {
                  maskImage:maskResource,
                  //词的类型
                  type: 'wordCloud',
                  //设置字符大小范围
                  shape: 'circle',
                  sizeRange:[18,36],
                  rotationRange:[-45,90],
                  width: '100%',
                  height: '100%',
                  textStyle: {             //设置随机的字体颜色
                      fontFamily: 'sans-serif',
                      fontWeight: 'bold',
                      color: function () {
                          // Random color
                          return 'rgb(' + [
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160)
                          ].join(',') + ')';
                      }
                  },
                  emphasis: {
                      focus: 'self',
                      textStyle: {
                          shadowBlur: 10,
                          shadowColor: '#333'
                      }
                  },
                  //不要忘记调用数据
                  data:jsonList
              }
          ]
      };

      //加载图像，将数据放在图像中

      maskResource.onload = function():void{
      
          myCharts.setOption(option)
          };
      // maskResource.onload()
  }

  componentDidMount(){
    axios.get(`${PATH}/mongo/wordCloudData/all`).then((res:AxiosResponse<any,any>) => {
      if(res.data.status === 200) {
        // message.success("获取词云数据成功")
        // console.log("wordsCloud",res.data.data.data)
        this.setState({
          WordsCloudData:res.data.data.data
        })

        this.createWordCloud()
      }
    })
  }

  componentDidUpdate(){
    //每次重绘需要删除原图元
    if (myCharts != null && myCharts !== "" && myCharts !== undefined) {
        myCharts.dispose();//销毁
    }
    this.createWordCloud();
    
  }

  handleChange = ()=>{
      let { classId } = this.state
      let changeId:number = (Number(classId) + 1)%9 === 0 ? 1 : (Number(classId) + 1)%9
      this.setState(({
          classId:  String(changeId)
      }))
  }

  public render(): JSX.Element {
    return (
      <>
        {
                    // isComplete ? 
                    (<div className="WordsCloud"
                    style={{
                        height:"100%",
                        width:"100%"
                    }}
                    >
                        WordsCloud....
                    </div>)
                // :<Spin></Spin>
                // :(<div className="loading"></div>)
          }
      </>
    )
  }
}
export default MyWordsCloud;
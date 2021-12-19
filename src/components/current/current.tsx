import React, {Component} from "react";
import { Route,Routes,NavLink } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios'
//antd组件库
import {Button, Radio} from 'antd';
//事件流对应组件
import LoadingData from '../toolPages/LoadingData'//加载字典数据
import DataPreprocessing from '../toolPages/DataPreprocessing' //数据预处理
import HandleLabel from '../toolPages/HandleLabel' //手动标注
import ModelTrain from '../toolPages/ModelTrain' //模型训练
import WordRecognition from '../toolPages/WordRecognition' //语料识别
import './current.css';
// import {textsLoadData} from '../../types/propsTypes'

interface CurrentState{

}

interface CurrentProps{

}

export default class Current extends Component<CurrentProps, CurrentState>{
  public constructor(props: CurrentProps) {
    super(props)
    this.state = {
      path:'loadingData'
    }
  }

  componentDidMount(){
    // axios.get(`http://101.35.15.228:8080/mongo/trainTexts/all`)
    // .then((res:AxiosResponse<any, any>) => {
    //   const item = res.data.data.texts
    //   console.log(item)
    //   // this.setState({data: item})
    // })
  }

  public render(): JSX.Element {
    return(
      <div style={{width:'90rem', height:'40rem', marginTop:'-0.8rem', marginLeft:'-0.8rem', backgroundColor:'white', zIndex:'0', position:'absolute'}}>
        <div style={{width: '32rem',
          height: '36.5rem',
          border: '0.1rem solid gray',
          marginTop: '2rem',
          marginLeft: '2.5rem',
          position: 'absolute',
          zIndex: '1'}}>
          <span style={{position:'absolute', width:'5rem', marginLeft:'-14rem', marginTop:'-0.8rem', backgroundColor:'white'}}>工作流</span>
          <div style={{position: 'absolute',border: 'medium none', zIndex: '-1', width:"20rem", height:"36rem", marginLeft:'6rem', marginTop:'-0.8rem'}}>
            <svg style={{width:"100%", height:"100%"}}>
              <line x1="50%" x2="50%" y1="10%" y2="90%" stroke='black'></line>
              <rect x="3%" y="28.5%" width="33%" height="45%" stroke='black' fill='none'></rect>
              <rect x="63%" y="43.5%" width="33%" height="30%" stroke='black' fill='none'></rect>
              <rect x="36%" y="28.5%" width="27%" height="45%" strokeWidth='0.2rem' stroke='white' fill='none'></rect>
              {/* <line x1="63%" x2="63%" y1="43.5%" y2="47.5%" stroke='black'></line> */}
            </svg>
          </div>
          <div style={{width:"32rem", height:"36rem", zIndex:"3"}}>
            <NavLink to={'loadingData'} ><Button className="buttonCss">加载数据/字典</Button></NavLink>
            <NavLink to={'PreTreatmentData'}><Button className="buttonCss">数据预处理</Button></NavLink>
            <NavLink to={'HandLabel'}><Button className="buttonCss">手工标注</Button></NavLink>
            <NavLink to={'ModelTrain'}><Button className="buttonCss">训练模型</Button></NavLink>
            <NavLink to={'WordRecognition'}><Button className="buttonCss">语料识别</Button></NavLink>
            <NavLink to={'ExportData'}><Button className="buttonCss">数据导出</Button></NavLink>
          </div>
        </div>
        <div style={{width:"45rem", height:"36.5rem", border: '0.1rem solid gray', marginTop:'2rem', marginLeft:'36rem', position:'absolute'}}>
          <Routes>
            <Route path='/loadingData/*' element={<LoadingData></LoadingData>}></Route>
            <Route path='/PreTreatmentData' element={<DataPreprocessing></DataPreprocessing>}></Route>
            <Route path="/HandLabel" element={<HandleLabel></HandleLabel>}></Route>
            <Route path='/ModelTrain' element={<ModelTrain></ModelTrain>}></Route>
            <Route path='/WordRecognition' element={<WordRecognition></WordRecognition>}></Route>
            <Route path='/ExportData' element={<div></div>}></Route>
          </Routes>
        </div>
      </div>

    )
  }
}
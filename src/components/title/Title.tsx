import React from 'react';

// antd组件库
import Icon from '@ant-design/icons';
import 'antd/dist/antd.css';
import {Avatar, Button, Layout, Menu, Breadcrumb} from 'antd';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import  Sider from './sider'

// 自定义inco
import {Logo} from '../Icon';

export default class Title extends React.Component{
  public render(): JSX.Element {
    const { Header, Content, Footer } = Layout;
    return(
      <div id="main" style={{"width": '95.9rem', "height": '3.2rem', backgroundColor: 'rgb(0, 68, 107)'}}>
        <div id="title" style={{width: '13rem',
          height: '3.2rem',
          backgroundColor: 'rgb(6, 96, 148)',
          fontSize: '1.3rem',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '3rem',
          zIndex: '1'}}>
          <Icon 
            style={{textAlign: 'left',
            height: '1.3rem',
            width: '1.3rem',
            overflow: 'hidden'
          }} 
            component={Logo}/>
          &nbsp;
          实体抽取工具
        </div>
        {/* <div id="list" style={{
          width: '11rem',
          height: '43.5rem',
          float: 'left',
          position: 'absolute',
          backgroundColor: 'white',
          zIndex: '2'}} >
        </div> */}
        <Avatar icon={<Logo />}
          style={{
            float: 'right',
            marginTop: '-2.6rem',
            marginRight: '1.1rem'
          }} />
        <Sider/>
        {/* <div id="page" style={{
          width: '100%',
          height: '2.5rem',
          backgroundColor: 'white',
          zIndex: '1'
        }}>
          
        </div> */}

        {/* <div id="header" style={{
          width: '100%',
          height: '2rem',
          backgroundColor: 'rgb(89,165,222)',
          zIndex: '0',
          fontSize: '1rem',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '2rem'
        }}>
          字典管理
        </div> */}
        
      </div>
    )
  }
}
import React, { useRef, Component } from 'react';
import { Route,Routes,NavLink } from 'react-router-dom';
// antd组件库
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';

import Dictionary from '../dictionary/dictionary';
import customMenuDate from './Menu';
import Current from '../current/current';
import TextsTool from '../TextsTool'

export default class Sider extends React.Component{
  public render(): JSX.Element{
    return (
      <div style={{width:'95.9rem', height:'43.9rem', overflow:'hidden'}}>
        <ProLayout
          style={{
            height: '100vh',
            // border: '1rem solid white',
          }}
          logo={()=>{}}
          title=""
          headerRender={false}
          collapsed={false}
          siderWidth={208}
          menuItemRender={(item: any, dom: any) => (
            <NavLink to={item.path as string}  onClick={() => {
              console.log('menuItemClick',item,dom)
              this.setState({
                pathname:(item.path || '/dictionary')
                // name:item.name
              })
            }}>{item.name}</NavLink>
          )}

          menu={{
            request: async () => {
              return customMenuDate;
            },
          }}
          layout='side'
          navTheme='light'>
          <Routes>
            <Route path="/"  element={<PageContainer title="字典管理"><Dictionary /></PageContainer>}></Route>
          </Routes>
          <PageContainer >
            <Routes>
              <Route path="/texts" element={<TextsTool></TextsTool>}></Route>
              <Route path="/tool/*" element={<Current></Current>}></Route>
              <Route path="/dictionary" element={<Dictionary />}></Route>
            </Routes>
          </PageContainer>
          
        </ProLayout>
      </div>
    );
  }

};
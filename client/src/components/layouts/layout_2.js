import React, { Component } from 'react'
import {HashRouter,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Myfiles from "../myfiles/myfiles"
import Upload from "../upload/upload"
import Verify from "../verify/verify"
import getinstance from '../getWeb3/getinstance'
import Welcome from "../welcome/welcome"
import styles from '../../css/layout.scss'
import 'antd/dist/antd.css'
import dataContain from '../dataContain'

import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const customHistory = createBrowserHistory();
export default class layout extends Component {
    constructor(props){
      super(props);
      this.state={
          contract:null,
          web3:null,
          accounts:null,
          filehashs:null,
      }
    }
    componentWillMount = async () => {
      try {
        console.log("进入layout的初始化函数")
        var instance
        if(!this.state.contract){//说明当前没有拿到合约实例
         instance = await getinstance()//调用函数，拿到合约实例
         dataContain.data=instance//将合约实例保存到datacontain中
         console.log("这是layout中的dataContain："+dataContain)
        }
        this.setState({
            contract: instance[0],//已经部署的合约放到state中
            web3:instance[1],
            accounts:instance[2],
            filehashs:instance[3],
          },
          () => {           
             // console.log('contract address :' + this.state.contract.address)
              console.log('web3             :' + Object.values(this.state.web3))
              console.log('accounts         :' + this.state.accounts)
              console.log('filehashs        :' + this.state.filehashs)  
              console.log("系统入口，完成合约实例的创建，以及保存到datacontain")          
          } 
        )
      } catch (error) {
        console.log('this is error :' + error)
      }
    }
    render() {
        return (
            <HashRouter   history={customHistory}>
                    <Layout>
                        <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={broken => {
                            console.log(broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                        }}
                        >
                        <div className="logo" />

                        <Menu theme="dark" mode="inline"  defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                            <UserOutlined />
                            <span className="nav-text">nav 1</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                            <VideoCameraOutlined />
                            <span className="nav-text">nav 2</span>
                            </Menu.Item>
                            <Menu.Item key="3">
                            <UploadOutlined />
                            <span className="nav-text">nav 3</span>
                            </Menu.Item>
                            <Menu.Item key="4">
                            <UserOutlined />
                            <span className="nav-text">nav 4</span>
                            </Menu.Item>
                        </Menu>
                        </Sider>

                        <Layout>
                        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                        <Content style={{ margin: '15px 15px 0' }}>
                            <div className="site-layout-background" style={{ padding: 40, minHeight: 500 }}>
                            content
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center',padding: 24 }}>Ant Design ©2018 Created by Ant UED</Footer>
                        </Layout>
                    </Layout>,
            </HashRouter>
        )
    }
}
 
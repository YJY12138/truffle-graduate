import React, { Component } from 'react'
import {HashRouter,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import Myfiles from "./myfiles/myfiles"
import Upload from "./upload/upload"
import Verify from "./verify/verify"
import getinstance from './getWeb3/getinstance'
import Welcome from "./welcome/welcome"
import {Layout, Menu }from 'antd'
import styles from '../css/app.scss'
import dataContain from './dataContain'
const {Header, Footer, Content } = Layout;

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
        //alert("进入layout")
        //进入系统的时候先获得合约的信息,存到dataContain中
        const instance = await getinstance()
        this.setState({
            contract: instance[0],//已经部署的合约放到state中
            web3:instance[1],
            accounts:instance[2],
            filehashs:instance[3],
          },
          () => {
            dataContain.data=instance
          } 
        )
      } catch (error) {
        console.log('this is error :' + error)
      }
    }
    render() {
        return (
            <HashRouter>
            <Layout className="layout" style={{height: '100%'}}>
            <Header>
              <div className="logo"/>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.hash.split('/')[1]]}>
                <Menu.Item key="welcome">
                <Link to="./welcome">首页</Link>
                </Menu.Item>
                <Menu.Item key="upload">
                <Link to={{pathname:'./upload',state:{contract:this.state.contract,web3:this.state.web3,account:this.state.accounts}}}>上传文件</Link>
                </Menu.Item>
                <Menu.Item key="myfiles">
                <Link to={{pathname:'./myfiles',state:{contract:this.state.contract,web3:this.state.web3,account:this.state.accounts}}}>我的文件</Link>
                </Menu.Item>
                <Menu.Item key="verify">
                <Link to={{pathname:'./verify',state:{contract:this.state.contract,web3:this.state.web3,account:this.state.accounts}}}>文件验权</Link>
                </Menu.Item>
              </Menu>
            </Header>
            {/*中间内容区 */}
            <Content style={{ padding: '0 50px' }}>
              
              
              <Route path = "/welcome"  component={Welcome}></Route>
              <Route path = "/upload"  component={Upload}></Route>
              <Route path = "/myfiles" component={Myfiles}></Route>
              <Route path =  "/verify" component={Verify}></Route>
              

            </Content>
            {/*<Footer style={{ textAlign: 'center' }}>Created by YJY</Footer>*/}
          </Layout>
          </HashRouter>
        )
    }
}
 
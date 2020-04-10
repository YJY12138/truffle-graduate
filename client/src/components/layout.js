import React, { Component } from 'react'
import {HashRouter,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Myfiles from "./myfiles/myfiles"
import Upload from "./upload/upload"
import Verify from "./verify/verify"
import getinstance from './getWeb3/getinstance'
import Welcome from "./welcome/welcome"
import {Layout, Menu }from 'antd'
import styles from '../css/layout.scss'
import 'antd/dist/antd.css'
import dataContain from './dataContain'
const {Header, Footer, Content } = Layout;
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
              console.log('contract address :' + this.state.contract.address)
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
            <Layout className="layout" style={{height: '100%'}}>
            <Header>
              <div className="logo"/>
 
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.hash.split('/')[1]]}>{/*保证f5之后地址栏和选项对应 */}
                <Menu.Item key="welcome">
                <Link to="/welcome">首页</Link>
                </Menu.Item>
                <Menu.Item key="upload">
                <Link to="/upload">上传文件</Link>
                </Menu.Item>
                <Menu.Item key="myfiles">
                <Link to="/myfiles">我的文件</Link>
                </Menu.Item>
                <Menu.Item key="verify">
                <Link to="/verify">文件验权</Link>
                </Menu.Item>
                <Menu.Item key="id">
                <Link >{this.state.accounts}</Link>
                </Menu.Item>
              </Menu>
            </Header>
            {/*中间内容区 */}
            <Content style={{ padding: '0 50px' }}>
              
              <div className="outbox">
             
              <Route path = "/welcome"  component={Welcome}></Route>
              <Route path = "/upload"  component={Upload}></Route>
              <Route path = "/myfiles" component={Myfiles}></Route>
              <Route path = "/verify" component={Verify}></Route>
              </div>

            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by YJY</Footer>
          </Layout>
          </HashRouter>
        )
    }
}
 
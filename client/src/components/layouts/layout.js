import React, { Component } from 'react'
import {HashRouter,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Myfiles from "../myfiles/myfiles"
import Upload from "../upload/upload"
import Verify from "../verify/verify"
import getinstance from '../getWeb3/getinstance'
import Welcome from "../welcome/welcome"
import {Layout, Menu, Button }from 'antd'
import styles from '../../components/layouts/css/layout.scss'
import 'antd/dist/antd.css'
import dataContain from '../dataContain'
import $ from  'jquery'
const {Header, Footer, Content } = Layout;
const customHistory = createBrowserHistory();
var instance
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
    changstate=(e)=>{
         this.setState({
            filehashs:e.target.value
         })
    }
    handleclick=(i)=>{
       this.transer(i)
    }
     transer=(i)=>{
      var cur = document.getElementById(i);
      this.getPosition(cur);
    }
     getPosition=(e)=> {
      　　var t=e.offsetTop;
      　　var l=e.offsetLeft;
      　　while(e=e.offsetParent){
      　　　　t+=e.offsetTop-40;
      　　　　l+=e.offsetLeft;
      　　}
      　$("html,body").animate({scrollTop:t},300);
      }
    render() {
        return (
          <div className="outer">
            <div className="divlayout">
         
             <div className="layout-upload"><Button  className="but" type="primary" onClick={(e)=>{this.handleclick("div1",e)}}>上传文件</Button></div>
             <div className="layout-myfile"><Button  className="but" type="primary" onClick={(e)=>{this.handleclick("div2",e)}}>我的文件</Button></div>
             <div className="layout-verify"><Button  className="but" type="primary" onClick={(e)=>{this.handleclick("div3",e)}}>文件验权</Button></div>
              
            </div>
            <div className="accountinfo">{this.state.accounts}</div>
            <div className="footer"><span className="footerspan"><h3>Create by yjy</h3></span></div>
            <div className="contents">
            <div className="div1" id="div1"><Upload  files={this.state.filehashs} account={this.state.accounts}></Upload></div>
            <div className="div2" id="div2"><Myfiles files={this.state.filehashs} account={this.state.accounts}></Myfiles></div>
            <div className="div3" id="div3"><Verify  files={this.state.filehashs}></Verify></div>
            </div>
          </div>
        )
    }
}
 
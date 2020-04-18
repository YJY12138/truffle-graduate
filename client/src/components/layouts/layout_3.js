import React, { Component } from 'react'
import {HashRouter,Route,Link,BrowserRouter,Switch,Redirect} from 'react-router-dom';
import Upload from "../upload/upload_3"
import getinstance from '../getWeb3/getinstance'
import Welcome from "../welcome/welcome"
import {Layout, Menu, Button }from 'antd'
import styles from '../../components/layouts/css/layout_3.scss'
import 'antd/dist/antd.css'
import dataContain from '../dataContain'
import $ from  'jquery'




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
    componentDidMount = async () => {
      try {
        console.log("进入layout的初始化函数")
        if(!this.state.contract){//说明当前没有拿到合约实例
         instance = await getinstance()//调用函数，拿到合约实例
         dataContain.data=instance//将合约实例保存到datacontain中
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
    changstate=(value)=>{
         this.setState({
            filehashs:value
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
      　　　　t+=e.offsetTop;
      　　　　l+=e.offsetLeft;
      　　}
      　$("html,body").animate({scrollTop:t},300);
      }
    render() {
        return (
          <div className="outer">
            
              <div className="divlayout">
                <ul  className="nav">
                  <li className="li1" ><a href="#" onClick={(e)=>{this.handleclick("div1",e)}}> <p><span class="bg"></span><span class="base"></span><span class="text">上传文件</span></p></a></li>
                  <li><a href="#" onClick={(e)=>{this.handleclick("div2",e)}}> <p><span class="bg"></span><span class="base"></span><span class="text">文件列表</span></p></a></li>
                  <li><a href="#" onClick={(e)=>{this.handleclick("div3",e)}}> <p><span class="bg"></span><span class="base"></span><span class="text">文件验权</span></p></a></li>
                </ul>        
              </div>

               <div className="accountinfo">
               <span><h3>当前账户：{this.state.accounts}</h3></span>
               </div>

              <div className="contents">
              <div className="div1" id="div1"><Upload  files={this.state.filehashs} account={this.state.accounts} contract={this.state.contract} web3={this.state.web3} changestate={this.changstate}></Upload></div>
              </div>
              <div className="footer">
                        <span><h1>create by yjy</h1></span>
              </div>
           
          </div>
        )
    }
}
 
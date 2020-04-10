import React, { Component } from 'react'
import getinstance from '../getWeb3/getinstance'
import dataContain from '../dataContain'
import imgURL from '../../image/background.jpg';
export default class welcome extends Component {
    constructor(props){
        super(props)
        this.state={
          user:null,//当前的用户
          contract:null,
          web3:   null,
          accounts:null,
          filehashs:null,
        }
    }
    fun2=()=>{
      setTimeout(()=>{
        this.setState({
          contract: dataContain.data[0],//已经部署的合约放到state中
          web3:     dataContain.data[1],
          accounts: dataContain.data[2],
          filehashs:dataContain.data[3],
        })
      },600)
    }
   componentDidMount() {
    if(this.state.contract===null){
      this.fun2()
    }
    this.setState({
      contract:dataContain.data[0],
      web3:dataContain.data[1],
      accounts:dataContain.data[2],
      filehashs:dataContain.data[3],
    },()=>{
          if(this.state.contract){
          console.log("-------welcome中的state----------")    
          console.log('contract address :' + this.state.contract.address)
          console.log('web3             :' + Object.values(this.state.web3))
          console.log('accounts         :' + this.state.accounts)
          console.log('filehashs        :' + this.state.filehashs)  
          console.log("---------------------------------")   
          } 
        }
   )
  }
    render() {
        return (
      
            <div  id="imgbox" >
              <img  id="right" alt="yjy" src={imgURL}/>
            </div>
           
        )
    }

}
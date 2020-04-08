import React, { Component } from 'react'
import getinstance from '../getWeb3/getinstance'
import dataContain from '../dataContain'
export default class welcome extends Component {
    constructor(props){
        super(props)
        this.state={
            user:null,//当前的用户
            filehashs:null,
            contract:null,
            web3:null,
            accounts:null,
        }
    }
    componentWillMount = async () => {
        try {

          this.setState({
              contract: dataContain.data[0],//已经部署的合约放到state中
              web3:dataContain.data[1],
              accounts:dataContain.data[2],
              filehashs:dataContain.data[3],
            },
            () => {
              if(!dataContain.data){
              console.log('这是welcome中设置完state之后的回调函数,把合约,web3,账户,文件信息存到dataContain')
              console.log('contract address :' + this.state.contract.address)
              console.log('web3             :' + this.state.web3)
              console.log('accounts         :' + this.state.accounts)
              console.log('filehashs        :' + this.state.filehashs)
              
              dataContain.data={contract:this.state.contract,web3:this.state.web3,accounts:this.state.accounts,filehashs:this.state.filehashs}
              }
            } 
            // this.runExample
          )
        } catch (error) {
          console.log('this is error :' + error)
        }
      }
     /* fun1 = async ()=>{
         const instance = await getinstance();
         dataContain.data  =instance;
         dataContain.data +=instance[0].getFile();
      } */
    render() {
        return (
            <div >
                <h1><span>这是欢迎页面</span></h1>           
            </div>
        )
    }
}
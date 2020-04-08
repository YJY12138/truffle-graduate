import React, { Component } from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//验证所有权页面
//用户选择文件,点击验证
//从区块链上查询文件的hash
//如果当前用户上传的文件的hash已经存在,那么弹窗显示  该文件已经存在, 文件所有者为...xxxx

export default class verify extends Component {
    constructor(props){
        super(props)
        this.state={
            user:null,//当前的用户
            currentfilehash:null
        }
    }

    componentWillMount = async () => {
        try {
          const web3 = await getWeb3()
          const accounts = await web3.eth.getAccounts()
          const Contract = truffleContract(SimpleStorageContract)
          Contract.setProvider(web3.currentProvider)
          // 返回已经部署的合约
          const instance = await Contract.deployed()
          this.setState({
              web3: web3,
              accounts: accounts,
              contract: instance,//已经部署的合约放到state中
              blockNumber: web3.eth.blockNumber,
            },
            () => {
              console.log('设置完state之后的回调函数')
              console.log('web3             :' + this.state.web3)
              console.log('accounts         :' + this.state.accounts)
              console.log('contract address :' + instance.address)
              console.log('currentFilehash  :' + this.state.curretFilehash)
              console.log('blockNumber      :' + this.state.blockNumber) 
            }
            // this.runExample
          )
        } catch (error) {
          console.log('this is error :' + error)
        }
      }

    render() {
        return (
            <div >
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
                <h1><span>这是验权页面</span></h1>
          
                
            </div>
        )
    }
}

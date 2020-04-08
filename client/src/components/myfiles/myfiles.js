import React, { Component } from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import dataContain from "../dataContain"
import getinstance from "../getWeb3/getinstance"
import { Table, Tag } from 'antd';
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//查询用户的所有文件,并且提供下载按钮
//下载功能可能也需要ipfs接口

const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '哈希值',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'ipfs地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>下载</a>
      </span>
    ),
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'http://localhost:8080/ipfs/',
  },
];

export default class myfiles extends Component {
    constructor(props){
        super(props)
        this.state={
            files:[],
            filenumber:0,
            user:null,//当前用户
        }
    }
    componentWillMount = async () => {
      try {
          this.fun1();
          console.log(dataContain.data[3].length)
          for(var i=0;i<dataContain.data[3].length;i++){
                  var temp={
                    key:i,
                    name: dataContain.data[3][i][1],
                    age: dataContain.data[3][i][0],
                    address: 'http://localhost:8080/ipfs/'+dataContain.data[3][i][0],
                  }
                  data[i]=temp;
          }
          this.setState({
            contract: dataContain.data[0],//已经部署的合约放到state中
            web3:dataContain.data[1],
            accounts:dataContain.data[2],
            filehashs:dataContain.data[3],
          })
          
         }catch (error) {
          console.log('this is error :' + error)
      }
    }
    fun1 = async ()=>{
      console.log("这是myfiles :")
      console.log("查看dataContain中的信息 :"+dataContain.data[0])
      console.log("查看dataContain中的信息 :"+dataContain.data[1])
      console.log("查看dataContain中的信息 :"+dataContain.data[2])
      console.log("查看dataContain中的信息 :"+dataContain.data[3])
   
      if(!dataContain.data){
           const instance = await getinstance();
           dataContain.data =instance;
      }else{
   
     }
   }
  

  
    render() {
        return (
            <div id="filebox" style={{overflow:'auto'}}>
             <Table columns={columns} dataSource={data} />
            </div>

        )
    }
}

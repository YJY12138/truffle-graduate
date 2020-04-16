import React, { Component } from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import dataContain from "../dataContain"
import getinstance from "../getWeb3/getinstance"
import { Table, Button,message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import style from "./myfiles.scss"
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//查询用户的所有文件,并且提供下载按钮
//下载功能可能也需要ipfs接口

/*const columns = [
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
        <a onClick={this.dowloadfile()}>下载{record.age}</a>
      </span>
    ),
  },
];
const data = [
 
];
*/
export default class myfiles extends Component {
    constructor(props){
        super(props)
        this.state={
            contract:null,
            web3:null,
            accounts:null,
            filehashs:[],
            filenumber:0,
            user:null,//当前用户
            data:[],
            top: 'topLeft',
            bottom: 'bottomCenter',
        }
    }
    fun2=()=>{
        var data= []
        for(var i=0;i<dataContain.data[3].length;i++){  
             console.log(dataContain.data[2]+"-----"+dataContain.data[3][i][2])       
            if(dataContain.data[2]==dataContain.data[3][i][2]){
              var temp={
                key:i,
                name: dataContain.data[3][i][1],
                age: dataContain.data[3][i][0],
                address: 'http://localhost:8080/ipfs/'+dataContain.data[3][i][0],
              }
              data[data.length]=temp;   
              }
         }
     setTimeout(()=>{
       this.setState({data:data})
      },1000)
    }

    componentWillMount = async () => {
      try {
        var data= []
        if(this.state.data===null){
          this.fun2()
        }
          console.log("this myfiles 的初始化函数：")            
          for(var i=0;i<dataContain.data[3].length;i++){    
            console.log(dataContain.data[2]+"-----"+dataContain.data[3][i][2])
            if(dataContain.data[2]==dataContain.data[3][i][2]){         
                  var temp={
                    key:i,
                    name: dataContain.data[3][i][1],
                    age: dataContain.data[3][i][0],
                    address: 'http://localhost:8080/ipfs/'+dataContain.data[3][i][0],
                  }
                  data[data.length]=temp;    
                }          
          }
          this.setState({
            contract: dataContain.data[0],//已经部署的合约放到state中
            web3:dataContain.data[1],
            accounts:dataContain.data[2],
            filehashs:dataContain.data[3],
            data:data
          },()=>{
            if(this.state.contract){
         
            console.log("这是data中的数据："+data)
            }
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
  
dowloadfile=async(event,api_url)=>{//下载文件
    console.log('this is :'+api_url)
    /*return new Promise((resolve,reject)=>{
      try{
          ipfs.get(hash,function (err,files) {
              if (err || typeof files == "undefined") {
                  reject(err);
              }else{
                  resolve(files[0].content);
              }
          })
      }catch (ex){
          reject(ex);
      }
  }); */ 
  window.open(api_url)
  message.success('下载成功')
 }
  
    render() {
      const columns = [
        {
          title: '文件名',
          dataIndex: 'name',
          key: 'name',
          align:'center',
        },
        {
          title: '哈希值',
          dataIndex: 'age',
          key: 'age',
          align:'center',
        },
        {
          title: 'ipfs地址',
          dataIndex: 'address',
          key: 'address',
          align:'center',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'small'} onClick={e=>{this.dowloadfile(e,record.address.toString());return false}}></Button>
            </span>
          ),
          align:'center'
        },
      ];

        return (
            <div  className="myfiles" id="filebox" style={{overflow:'auto'}}>
             <Table   pagination={{ position: [this.state.bottom] ,defaultPageSize:5}} tableLayout={'fixed'} size={'small'} defaultPageSize={6} columns={columns} dataSource={this.state.data} />
            </div>

        )
    }
}

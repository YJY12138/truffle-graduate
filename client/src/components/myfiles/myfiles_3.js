import React, { Component } from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import dataContain from "../dataContain"
import getinstance from "../getWeb3/getinstance"
import { Table, Button,message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from "../myfiles/css/myfiles_3.scss"
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
var data=[]
export default class myfiles extends Component {
    constructor(props){
        super(props)
        this.state={
            contract:null,
            web3:null,
            accounts: this.props.account,
            filehashs:this.props.files,
            filenumber:0,
            user:null,//当前用户
            data:[],
            top: 'topLeft',
            bottom: 'bottomCenter',
        }
    }
    fun2=async()=>{

        for(var i=0;i<this.props.files.length;i++){      
            if(await this.props.account==this.props.files[i][2]){         
                  var temp={
                    key:i,
                    name: this.props.files[i][1],
                    age: this.props.files[i][0],
                    address: 'http://localhost:8080/ipfs/'+this.props.files[i][0],
                  }
                  data[data.length]=temp;    
                }          
          }
     setTimeout(()=>{
       this.setState({data:data})
      },2000)
    }

    componentWillMount = async () => {

      try {
        await this.fun2()
        this.setState({
            contract: this.props.contract,//已经部署的合约放到state中
            web3:    this.props.web3,
            accounts:this.props.account,
            filehashs:this.props.files,
            data:data
          },()=>{
            if(this.state.filehashs){        
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

   }
  
dowloadfile=async(event,url)=>{//下载文件
    fetch(url).then(res => res.blob().then(blob => {
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      var filename = 'file.png';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
     }));
 // window.open(api_url)
  message.success('下载成功')
 }
  componentWillReceiveProps = async () => {
    this.setState({
      accounts: this.props.account,
      filehashs:this.props.files,
    },()=>{
      console.log(this.state.accouts)
    })
  }
  componentWillUpdate = async () => {
    
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
                <div className="mytable">        
                <Table   pagination={{ position: [this.state.bottom] ,defaultPageSize:5}} tableLayout={'fixed'} size={'small'} defaultPageSize={6} columns={columns} dataSource={this.state.data} />
                </div> 
            </div>
        )
    }
}

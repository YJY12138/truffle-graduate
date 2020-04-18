import React, {Component} from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import getinstance from '../getWeb3/getinstance'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import { Button ,message} from 'antd';
import dataContain from '../dataContain'
import { resolveOnChange } from 'antd/lib/input/Input';
import ethaddress from '../test/ethAddress'
import Myfiles from "../myfiles/myfiles"
import Verify from "../verify/verify"
import searchfile from '../test/searchfile'
import style from "./css/uploadcss.scss"
import moment from 'moment';
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//把文件存到ipfs
let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer).then((response) => {
      console.log(response)
      resolve(response[0].hash);
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}
var outflag=0;
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      contract:null,
      web3:   null,
      accounts:null,
      filehashs:[],
      blockNumber:'unknown',
      currentransaction:'unknown',
      filehashs:[],//从合约取出的所有的文件的信息
      filecounts:0,//从合约中取出的文件个数
      //当前文件的所有者,文件名,文件hash
      currentfileowner:null,
      currentfilename:null,
      currentfilehash:null,
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
componentWillMount = async () => {
  try {  
       if(this.state.contract===null){
         this.fun2()
       }
          this.setState({
          contract:  this.props.contract,//已经部署的合约放到state中
          web3:      this.props.web3,
          accounts:  this.props.account,
          filehashs: this.props.files,
         //filecounts:this.props.files.length
        },
          () => {
            if(this.state.contract){
            console.log('这是upload中收到的参数')
            console.log('contract address :' + this.state.contract.address)
            console.log('web3             :' + this.state.web3)
            console.log('accounts         :' + this.state.accounts)
            console.log('filehashs        :' + this.state.filehashs)
            console.log('文件数量          :' + this.state.filecounts)
            }else{          
            }
          })    
          setTimeout(this.changeHeight, 0);
        
     }catch (error) {
      console.log('this is error :' + error)
  }
}
//将文件存到链上,以及从链上获取信息
operateContract = async () => {
  console.log('进入operateContract')
  const contract = dataContain.data[0] //我们已经部署好的合约,{账户,合约}
  console.log('this is contract :' + this.props.contract)
  const accounts = dataContain.data[2]
  console.log('this is accounts :' + this.props.account)
  //this.fun1()

  //先拿到合约里面的文件信息,看是否存在当前的hash
  var response_1 = await contract.getFile()
  console.log("这是当前hash :" +this.state.currentfilehash)
  console.log("这是长度 : "+response_1.length+"  这是存文件之前合约里的文件信息 :"+ response_1[response_1.length-1])

 if(await this.hashExistorNot()===1){//当前文件还未存链
   await this.state.contract.setFilemsg(this.state.currentfilehash.toString(),this.state.currentfilename.toString(),this.state.currentfileowner.toString(),
                         { from: this.state.currentfileowner.toString()}
                         )//默认指定第0个账户可以加上第二个参数{from:accounts[0]}
   message.success('上传成功')
   dataContain.data[3]=await contract.getFile();
   outflag=1;
 }else{
   console.log("文件已经存在")
 }
   //ethaddress();
 
  var filecounts= await contract.getFilenumber();//取得区块链上面文件的数量

  const transaction=this.state.web3.eth.getTransaction(this.state.blockNumber, 0).then(
                                             data=>{if(data!=null)
                                                     console.log("这是本次transaction："+data)
                                                    else console.log('data为空')
                                                    }
                                                  )
  response_1 = await contract.getFile()

  console.log("这是长度："+response_1.length+"这是存文件之后合约里最新的文件信息 ："+ response_1[response_1.length-1])

  const blockNumber=await contract.getBlocknumber()

  this.setState({
      blockNumber:blockNumber,
      filecounts:filecounts,
      filehashs:response_1,
      currentransaction:transaction,
    },
    () => {
      console.log('---------operateContract之后的数据--------------')
      console.log('web3             :' + Object.values(this.state.web3))
      console.log('当前accounts        :' + this.state.currentfileowner)
      console.log('contract address :' + this.state.contract.address)
      console.log('blockNumber      :' + this.state.blockNumber)
      console.log('transaction      :' + this.state.currentransaction)
      console.log('文件数量          :' + this.state.filecounts)
      console.log('-----------------------------------------------')
    }
  )
 this.getTrans()
}
hashExistorNot= async () =>{
    
    console.log("进入hashExitorNot")
    
    let flag=1;//表示hash还未存在
   
    const currenthash=this.state.currentfilehash
   
    const existhashs= await this.state.filehashs
    if(existhashs.length===0) {
      console.log("existhahs为空")
      return flag;
    }else{
      for(var i=0;i<existhashs.length;i++){
            if(existhashs[i][0]===currenthash){
              flag = 0;
              alert("该文件已经存在,所有者为"+existhashs[i][2])
              outflag=0;
              return flag;
            }
      } 
      return flag; 
    }     
}

getTrans = async () => {
  console.log("这是函数中返回的交易信息：")
  const blocknumber=this.state.blockNumber
  await this.state.web3.eth.getTransactionFromBlock(blocknumber, 0, function(error, result) {
    if(result!==null)console.log(result)
  });

}
uploadFiles = async ()=>{

  var ownerinfo=this.state.accounts;
  var file = this.refs.file.files[0];
  var filename=this.refs.file.value.toString().split('\\')[2];
  var reader = new FileReader();
  // reader.readAsDataURL(file);
  if(await file!=null)
   reader.readAsArrayBuffer(file)
  else alert("请先选择文件")
  reader.onloadend = (e) => {
    console.log('这是reader')
    console.log(reader);
    // 上传数据到IPFS
      saveImageOnIpfs(reader).then((hash) => {             
      this.setState({currentfilehash: hash,currentfileowner: ownerinfo,currentfilename:filename,contract:dataContain.data[0],accounts:dataContain.data[2],web3:dataContain.data[1],filehashs:dataContain.data[3]},this.operateContract)
    });
  }
}
fun1 = async ()=>{
 
   
   if(!dataContain.data){
        const instance = await getinstance();
        dataContain.data =instance;
   }else{

  }
}

handleclick=async(e)=>{

      searchfile()
     message.success("click")
}
  render() {
 
    let date=moment().format("YYYY-MM-DD HH:mm") 
  
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }else{
    
    return (
    <div className="upload" align="center" id="upload" >
     <div className="uploadself">
        <div className="select1">
           <div className="select2">
           <h3>当前账户：</h3>
            <span type="txt" size="50" ref="owner" id="owner" className="owner" >{this.state.accounts}</span>
           <h1><span>上传文件</span></h1>
            <input type="file" ref="file" id="file" className="file" multiple="multiple"/> <button onClick={this.uploadFiles}>提交文件</button>
            <br></br>   
           </div>
       </div>

          <div className="displ">
          {    
          this.state.currentfilehash&&outflag
              ? <div className="out">                 
          
                        <table boder="1" className="uploadtable">             
                        <tbody>
                              <tr>
                                <td className="td1">文件名</td>   
                                <td className="td2">{this.state.currentfilename}</td>                          
                              </tr>
                              <tr>
                                  <td className="td1">hash值</td>   
                                  <td className="td2">{this.state.currentfilehash}</td>                            
                              </tr>
                              <tr>
                                <td className="td1">所有人</td>   
                                <td className="td2">{this.state.currentfileowner}</td>                         
                              </tr>
                              <tr>
                                  <td className="td1">上传时间</td>   
                                  <td className="td2">{date}</td> 
                            
                              </tr>
                              </tbody>
                        </table>
              

                { /* <div  id="right" >
                  <img alt="yjy" style={{
                      width: 200,height:200
                    }} src={"http://localhost:8080/ipfs/" + this.state.currentfilehash}/>
                  </div>*/}
                </div>
              : <div className="img">               
                </div>        
          }
          </div>
       </div>
          <div  className="other">
            <div className="div2" id="div2"><Myfiles files={this.state.filehashs} account={this.state.accounts} contract={this.state.contract} web3={this.state.web3}></Myfiles></div>
            <div className="div3" id="div3"><Verify  files={this.state.filehashs} account={this.state.accounts}></Verify></div>
          </div>
    </div>
    );
  }
}
}

export default App
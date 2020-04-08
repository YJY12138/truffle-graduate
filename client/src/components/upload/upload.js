import React, {Component} from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import getinstance from '../getWeb3/getinstance'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import { Button } from 'antd';
import dataContain from '../dataContain'
import { resolveOnChange } from 'antd/lib/input/Input';
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
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3:null,
      accounts:null,
      contract:null,
      blockNumber:'unknown',
      transaction:'unknown',
      filehashs:[],//从合约取出的所有的文件的信息
      filecounts:0,//从合约中取出的文件个数
      //当前文件的所有者,文件名,文件hash
      currentfileowner:null,
      currentfilename:null,
      currentfilehash:null,
    }
  }
componentWillMount = async () => {
  try {
    
     //alert("进入upload")
     if(!dataContain.data)
     {
        const instance = await getinstance()
        this.setState({
          contract: dataContain.data[0],//已经部署的合约放到state中
          web3:dataContain.data[1],
          accounts:dataContain.data[2],
          filehashs:dataContain.data[3],
        },
          () => {
            console.log('这是upload中设置完state之后的回调函数')
            console.log('contract address :' + this.state.contract.address)
            console.log('web3             :' + this.state.web3)
            console.log('accounts         :' + this.state.accounts)
            console.log('filehashs         :' +this.state.filehashs)
          })
     }else{
      this.setState({
        contract: dataContain.data[0],//已经部署的合约放到state中
        web3:dataContain.data[1],
        accounts:dataContain.data[2],
        filehashs:dataContain.data[3],
      })
      }
     }catch (error) {
      console.log('this is error :' + error)
  }
}
//将文件存到链上,以及从链上获取信息
operateContract = async () => {
  console.log('进入operateContract')
  const contract = dataContain.data[0] //我们已经部署好的合约,{账户,合约}
  console.log('this is contract :' + contract)
  const accounts = dataContain.data[2]
  console.log('this is accounts :' + accounts)
  this.fun1()

  //先拿到合约里面的文件信息,看是否存在当前的hash
  var response_1 = await contract.getFile()
  console.log("这是当前hash :" +this.state.currentfilehash)
  console.log("这是长度 : "+response_1.length+"  这是存文件之前合约里的文件信息 :"+ response_1[response_1.length-1])

 if(await this.hashExistorNot()===1){//当前文件还未存链
       await this.state.contract.setFilemsg(this.state.currentfilehash.toString(),this.state.currentfilename.toString(),this.state.currentfileowner.toString(),
                         { from: this.state.currentfileowner.toString()}
                         )//默认指定第0个账户可以加上第二个参数{from:accounts[0]}

                         dataContain.data[3]=await contract.getFile();
 }else{
   alert("该文件已经存在,所有者为"+this.state.accounts)
 }
  var filecounts= await contract.getFilenumber();//取得区块链上面文件的数量

  const transaction=this.state.web3.eth.getTransaction(this.state.blockNumber, 0).then(
                                             data=>{if(data!=null)
                                                     console.log(data)
                                                    else console.log('data为空')
                                                    }
                                                  )
  response_1 = await contract.getFile()

  console.log("这是长度"+response_1.length+"这是存文件之后合约里的文件信息 "+ response_1[response_1.length-1])

  const blockNumber=await contract.getBlocknumber()

  await this.setState({
      blockNumber:blockNumber,
      filecounts:filecounts,
      filehashs:response_1,
    },
    () => {
      console.log('operateContract之后的回调函数')
      console.log('web3             :' + Object.values(this.state.web3))
      console.log('accounts         :' + this.state.accounts)
      console.log('contract address :' + this.state.contract.address)
      console.log('blockNumber      :' + this.state.blockNumber)
      console.log('transaction      :' + transaction)
      console.log('文件数量          :' + this.state.filecounts)
     // console.log('账户的balance    :' + userbalance)
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
              return flag;
            }
      } 
      return flag; 
    }     
}

getTrans = async () => {
   console.log("交易信息:")
  const blocknumber=this.state.blockNumber
  await this.state.web3.eth.getTransactionFromBlock(blocknumber, 0, function(error, result) {
    if(result!==null)console.log(result)
  });

}
uploadFiles = async ()=>{

  var ownerinfo=this.refs.owner.value.toString();
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
    this.fun1()
    if (!dataContain.data) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }else{
    
    return (<div className="App" align="center">
        <h1><span>上传图片到IPFS</span></h1>
           <h3><span>选择文件</span></h3>
           <div>
            <input type="file" ref="file" id="file" name="file" multiple="multiple"/>
            <h3>账户</h3>
            <input type="txt" size="50" ref="owner" id="owner" name="owner"  />
           </div>

      <div> 
        <button onClick={this.uploadFiles}>提交文件</button>
      </div>
      {
        //如果拿到了图片存在ipfs的hash就显示链接,否则不显示
        this.state.currentFilehash
          ? <div id="out">   
               <div id="lift" > 
                  <h4>{"http://localhost:8080/ipfs/" + this.state.currentFilehash}</h4>
                  {/*<h4>从合约返回的文件hash值: {this.state.hashFromContracts}</h4>*/}
                  <h4>文件列表</h4>        
                  <ul>{this.state.filehashs.map(function(val){
                      return <li >http://localhost:8080/ipfs/{val}</li>
                  })}
                  </ul>
                </div>
              <div  id="right" >
              <img alt="yjy" style={{
                  width: 200,height:200
                }} src={"http://localhost:8080/ipfs/" + this.state.currentFilehash}/>
               </div>
            </div>
          : <img alt="" />
      }
    </div>);
  }
}
}

export default App
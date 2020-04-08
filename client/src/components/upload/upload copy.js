import React, {Component} from 'react'
import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
import { Button } from 'antd';
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
      currentFilehash:null,
      hashFromContracts:null,
      gasUsed:0,//部署消耗
      fileOwner:null,
      ownerFromContracts: null,
      blockNumber:'unknown',
      transaction:'unknown',
      filehashs:[],
      fileHashcounts:0,
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
//setstate之后的回调函数写在这
runExample = async () => {
  console.log('进入runexample')
  const contract = this.state.contract //我们已经部署好的合约,{账户,合约}
  console.log('this is contract :' + contract)
  const accounts = this.state.accounts
  console.log('this is accounts :' + accounts)
  //const block=this.state.web3.eth.getBlock(0,true)
  //console.log('这是runexample里的block:'+Object.values(block));
  
 if(await this.hashExistorNot()===1){
 await contract.setFile(this.state.currentFilehash.toString(),accounts.toString(),
                         { from: accounts[0]}
                         )//默认指定第0个账户可以加上第二个参数{from:accounts[0]}
 }else{
   alert("该文件已经存在,所有者为"+this.state.ownerFromContracts)
 }
  const filecounts= await contract.getFilenumber();//取得区块链上面文件的数量

  const transaction=this.state.web3.eth.getTransaction(this.state.blockNumber, 0).then(
                                             data=>{if(data!=null)
                                                     console.log(data)
                                                    else console.log('data为空')
                                                    }
                                                  )

 // await contract.setOwner(this.state.fileOwner.toString(), 
  //                        {from: accounts[0]}
   //                      )
  const response_1 = await contract.getFile()   //把刚才set的值拿出来

  const response_2 = await contract.getOwner()

  //await contract.setuser({from: accounts[0]});

  const blockNumber=await contract.getBlocknumber()

  //const contractbalance=await contract.getBalance()

  //const userbalance=await contract.getUerbalance()

  await this.setState({
      hashFromContracts: response_1,
      ownerFromContracts: response_2,
      blockNumber:blockNumber,
      fileHashcounts:filecounts,
      filehashs:response_1,
    },
    () => {
      console.log('runexample之后的回调函数')
      console.log('web3             :' + Object.values(this.state.web3))
      console.log('accounts         :' + this.state.accounts)
      console.log('contract address :' + this.state.contract.address)
      console.log('currentFilehash  :' + this.state.currentFilehash)
      console.log('blockNumber      :' + this.state.blockNumber)
      console.log('transaction      :' + transaction)
      console.log('文件数量          :' + this.state.fileHashcounts)
     // console.log('账户的balance    :' + userbalance)
    }
  )
  this.getTrans()
}
hashExistorNot= async () =>{
    
    console.log("进入hashExitorNot")
    
    let flag=1;//表示hash还未存在
   
    const currenthash=this.state.currentFilehash

    const existhashs=this.state.filehashs
    if(existhashs==null) return flag;
    console.log(existhashs)

    await existhashs.forEach((item)=>{
      if(currenthash===item){
         flag =0 ;
         return flag;
      }
    })
    return flag;   
}
getTrans = async () => {
  //const contract = this.state.contract //我们已经部署好的合约,{账户,合约}
  //const accounts = this.state.accounts
  const blocknumber=this.state.blockNumber
  //await this.state.web3.eth.getBlockTransactionCount(blocknumber, function(error, result) {
   //  console.log('getTrans:'+result)  
  //});
  await this.state.web3.eth.getTransactionFromBlock(blocknumber, 0, function(error, result) {
    if(result!==null)console.log(result)
  });

}
uploadFiles = async ()=>{

  var ownerinfo=this.refs.owner.value.toString();
  var file = this.refs.file.files[0];
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
      this.setState({currentFilehash: hash,fileOwner: ownerinfo},this.runExample)
    });

  }
}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (<div className="App" align="center">
           <Button type="primary">button</Button>
        <h1><span>上传图片到IPFS</span></h1>
           <h3><span>选择文件</span></h3>
           <div>
            <input type="file" ref="file" id="file" name="file" multiple="multiple"/>
            <h3>账户</h3>
            <input type="txt" size="50" ref="owner" id="owner" name="owner" value={this.state.accounts}/>
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
                      return <li>http://localhost:8080/ipfs/{val}</li>
                  })}
                  </ul>
                </div>
              <div  id="right" >
              <img alt="yjy" style={{
                  width: 500
                }} src={"http://localhost:8080/ipfs/" + this.state.currentFilehash}/>
               </div>
            </div>
          : <img alt="" />
      }
    </div>);
  }

}

export default App
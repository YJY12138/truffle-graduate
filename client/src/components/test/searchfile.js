import getinstance from "../getWeb3/getinstance"
import dataContain from "../dataContain"
import { message} from 'antd';


var addressList = []
var web3


let web3already =async()=>{
    if(!dataContain.data){
        console.log("dataContain.data为空")
        var instance = await getinstance(); 
        web3=instance[1]
   }else{
       web3=dataContain.data[1]  
   }
   
}


let ethAddress = async ()=>{
    console.log("进入searchfile")
    await  web3already()
    await  web3.eth.getBlockNumber().then(
    function(result){
        console.log("blockNumber:"+result);
        throughBlock(result);
    })
}
let throughBlock =(blockNumber)=> {
    if (!blockNumber) {console.log('blockNumber is 0');return false;};
    for (var i = 0; i < blockNumber; i++) {
        getBlock(i);
    };
}

//获取当前区块的信息
let getBlock =(blockNumber)=> {
    web3.eth.getBlock(blockNumber).then(
        function(result){
           var transactions = result.transactions;
            for (var i = 0; i < transactions.length; i++) {
                getTransactions(transactions[i]);
            }
        });
}

//获取交易信息
let getTransactions =(txh) =>{
    web3.eth.getTransaction(txh).then(
        function(result){
           var from = result.from;
           var to = result.to;
            getCode(from);
            getCode(to);
    });
}

// 验证地址是否是合约地址
let getCode =(address)=> {
    if (!address) {return false;};
    web3.eth.getCode(address).then(
        function(result){
            if (result == '0x') {
                getBalance(address);                
            };          
    });
}

// 获取地址余额
let getBalance =(address)=> {
    web3.eth.getBalance(address).then(
        function(result){
            if (!addressList.includes(address)) {
                addressList.push(address);
                console.log(address+"\t"+result); //地址 余额
            };  
            for(var i=0 ;i<addressList.length;i++)
            {
                console.log(addressList[i]+"\t"+result[i]); //地址 余额
            }        
        });
}


export default  ethAddress 
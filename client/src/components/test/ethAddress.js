import React, { Component } from 'react'
var Web3 = require('web3');
console.log(Web3.version);
//设置web3对象
const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:7545")

// var web3 = new Web3('https://rinkeby.infura.io/'); //rinkeby测速网络节点地址，开发测试可以使用测试网络，快
var web3 = new Web3(provider);
var addressList = []
let ethAddress =()=>{
    web3.eth.getBlockNumber().then(
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
          var  to = result.to;
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